import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.waitlistUser.findMany({
      include: {
        responses: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Create CSV
    let csv = 'Email,Role,Question,Answer,Multiple Choice,Submitted At\n';

    for (const user of users) {
      if (user.responses.length === 0) {
        csv += `${user.email},${user.role},,,${user.createdAt}\n`;
      } else {
        for (const response of user.responses) {
          csv += `${user.email},${user.role},"${response.questionId}","${response.answer.replace(/"/g, '""')}",${response.isMultipleChoice},${user.createdAt}\n`;
        }
      }
    }

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="waitlist-${new Date().toISOString()}.csv"`,
      },
    });
  } catch (error) {
    console.error('[ADMIN_EXPORT]:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

