import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, role, responses } = body;

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      );
    }

    // Get request metadata
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';
    const referrer = headersList.get('referer') || null;

    // Create or update waitlist user
    const waitlistUser = await prisma.waitlistUser.upsert({
      where: { email },
      update: {
        role,
        ipAddress,
        userAgent,
        referrer,
        updatedAt: new Date(),
      },
      create: {
        email,
        role,
        ipAddress,
        userAgent,
        referrer,
      },
    });

    // Delete old responses for this user
    await prisma.surveyResponse.deleteMany({
      where: { waitlistUserId: waitlistUser.id },
    });

    // Save survey responses
    if (responses && typeof responses === 'object') {
      const responseEntries = Object.entries(responses);
      
      for (const [questionId, answer] of responseEntries) {
        if (Array.isArray(answer)) {
          // Multiple choice - save each selection as separate row
          for (const singleAnswer of answer) {
            await prisma.surveyResponse.create({
              data: {
                waitlistUserId: waitlistUser.id,
                questionId,
                answer: singleAnswer,
                isMultipleChoice: true,
              },
            });
          }
        } else {
          // Single choice
          await prisma.surveyResponse.create({
            data: {
              waitlistUserId: waitlistUser.id,
              questionId,
              answer: answer as string,
              isMultipleChoice: false,
            },
          });
        }
      }
    }

    // Track analytics
    await prisma.waitlistAnalytics.create({
      data: {
        event: 'email_submitted',
        role,
        metadata: { email, responseCount: Object.keys(responses || {}).length },
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully added to waitlist',
    });
  } catch (error) {
    console.error('[WAITLIST_SUBMIT]:', error);
    
    // Handle unique constraint error (duplicate email)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'This email is already on the waitlist' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}

// Get waitlist stats (for admin dashboard later)
export async function GET() {
  try {
    const [total, byRole] = await Promise.all([
      prisma.waitlistUser.count(),
      prisma.waitlistUser.groupBy({
        by: ['role'],
        _count: true,
      }),
    ]);

    return NextResponse.json({
      total,
      byRole: byRole.reduce((acc, curr) => {
        acc[curr.role] = curr._count;
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (error) {
    console.error('[WAITLIST_STATS]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

