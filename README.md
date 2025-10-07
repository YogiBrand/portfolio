# Portfolio Builder Waitlist

Beautiful waitlist app with role-specific surveys and database storage. Collect emails and detailed survey responses from potential users.

## 🚀 Deploy to Vercel (5 Minutes)

### Step 1: Set Up Database (Choose One)

**Option A: Neon (Recommended - Free)**
1. Go to https://neon.tech
2. Sign up (free tier: 0.5GB storage)
3. Create a new project
4. Copy the connection string
5. It will look like: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb`

**Option B: Supabase (Also Free)**
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (Transaction mode)

**Option C: Railway (Free $5 credit)**
1. Go to https://railway.app
2. Create new project → Add PostgreSQL
3. Copy the DATABASE_URL from the Connect tab

**Option D: Vercel Postgres (Paid)**
1. In Vercel dashboard → Storage → Create Database
2. Choose Postgres
3. Copy connection string

### Step 2: Push to GitHub

```bash
cd /home/yogi/portfolio-waitlist

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Portfolio waitlist app"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/portfolio-waitlist.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. In "Environment Variables", add:
   - `DATABASE_URL` = Your database connection string from Step 1
   - `NEXT_PUBLIC_APP_URL` = (leave blank, Vercel sets this)

5. Click "Deploy"

### Step 4: Run Database Migration

After first deploy:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Run migration
vercel env pull .env.production
npx prisma db push
```

OR use Vercel's online shell:
1. Go to your project → Settings → Functions
2. Enable "Serverless Function Logs"
3. Trigger `/api/waitlist` endpoint (it will create tables automatically)

### Step 5: Access Your Waitlist

Your waitlist will be live at:
```
https://your-app.vercel.app
```

Admin dashboard:
```
https://your-app.vercel.app/admin
```

## 📊 Database Schema

### Tables Created Automatically

**waitlist_users**
- `id` (string, primary key)
- `email` (string, unique)
- `role` (string)
- `ipAddress` (string, optional)
- `userAgent` (string, optional)
- `referrer` (string, optional)
- `createdAt` (datetime)
- `updatedAt` (datetime)

**survey_responses**
- `id` (string, primary key)
- `waitlistUserId` (string, foreign key)
- `questionId` (string)
- `answer` (text)
- `isMultipleChoice` (boolean)
- `createdAt` (datetime)

**waitlist_analytics**
- `id` (string, primary key)
- `event` (string)
- `role` (string, optional)
- `metadata` (json, optional)
- `ipAddress` (string, optional)
- `userAgent` (string, optional)
- `createdAt` (datetime)

## 🎯 Features

- ✅ Beautiful gradient landing page
- ✅ 4 role types (Photographer, Developer, Video Editor, Creative)
- ✅ Role-specific survey questions (9 per role)
- ✅ Database storage for emails & responses
- ✅ Admin dashboard to view all signups
- ✅ CSV export functionality
- ✅ Analytics event tracking
- ✅ Mobile responsive
- ✅ Fast loading

## 🔐 Securing the Admin Dashboard (Production)

The `/admin` route is currently open. To secure it:

### Option 1: Simple Password Protection

Create `/src/middleware.ts`:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const basicAuth = request.headers.get('authorization');
    
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');
      
      if (user === 'admin' && pwd === process.env.ADMIN_PASSWORD) {
        return NextResponse.next();
      }
    }
    
    return new NextResponse('Auth required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Dashboard"',
      },
    });
  }
}

export const config = {
  matcher: '/admin/:path*',
};
```

Then add to Vercel env vars:
```
ADMIN_PASSWORD=your_secure_password
```

### Option 2: Use Vercel Authentication

Install Vercel's auth:
```bash
npm install next-auth
```

Follow NextAuth.js docs to add GitHub/Google login.

## 📧 Email Notifications (Optional)

To send confirmation emails when users join:

### Install Resend

```bash
npm install resend
```

### Add to Environment Variables

```
RESEND_API_KEY=re_xxx
```

### Create Email Route

`/src/app/api/waitlist/send-confirmation/route.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();
  
  await resend.emails.send({
    from: 'waitlist@yourdomain.com',
    to: email,
    subject: 'You\'re on the list!',
    html: '<h1>Thanks for joining!</h1>',
  });
  
  return Response.json({ success: true });
}
```

Then call it after successful waitlist submission.

## 📈 Viewing Analytics

### Using Prisma Studio (Local)

```bash
npx prisma studio
```

Opens at http://localhost:5555 with full database browser.

### Export Data Regularly

Visit `/admin` dashboard and click "Export CSV" to download:
- All emails
- All survey responses
- Timestamps
- Import into your CRM/email tool

## 🎨 Customization

### Change Survey Questions

Edit `/src/app/page.tsx`:

```typescript
const surveyQuestions = {
  photographer: [
    {
      id: 'your-question-id',
      question: 'Your question here?',
      type: 'single', // or 'multiple'
      options: [
        'Option 1',
        'Option 2',
      ]
    }
  ]
}
```

### Change Branding

Edit metadata in `/src/app/layout.tsx`:

```typescript
export const metadata = {
  title: 'Your Product - Waitlist',
  description: 'Your description',
}
```

### Change Gradients

In `/src/app/page.tsx`, update role colors:

```typescript
const roles = [
  {
    color: 'from-purple-500 to-pink-500', // Change these
  }
]
```

## 🔄 Updating After Deploy

```bash
# Make changes locally
git add .
git commit -m "Update survey questions"
git push

# Vercel auto-deploys!
```

## 💡 Pro Tips

1. **Export data daily** - Download CSV backups from admin
2. **Check /admin regularly** - Monitor signups in real-time
3. **Test survey flow** - Make sure all questions work before sharing
4. **Use analytics** - Track which roles convert best
5. **Add email confirmation** - Build trust with users

## 🆘 Troubleshooting

### "Database connection failed"
- Check DATABASE_URL is correct in Vercel env vars
- Make sure database allows connections from Vercel IPs
- Neon/Supabase work out of the box with Vercel

### "Prisma Client not found"
- Make sure `prisma generate` runs before build
- Check `package.json` has correct build command

### Admin dashboard shows no data
- Check if users are actually submitting (check logs)
- Verify DATABASE_URL is the same for all functions
- Try redeploying

### CSS not loading
- Tailwind v3 is installed
- Hard refresh (Ctrl+Shift+R)
- Check browser console for errors

## 📝 Local Development

```bash
# Install dependencies
npm install

# Set up database
npx prisma db push

# Start dev server
npm run dev

# Open
http://localhost:3200
```

## 🎯 Production Checklist

Before going live:

- [ ] Database set up (Neon/Supabase/etc.)
- [ ] Environment variables configured in Vercel
- [ ] Tested full survey flow
- [ ] Admin dashboard accessible
- [ ] CSV export working
- [ ] (Optional) Admin password protection added
- [ ] (Optional) Email confirmations set up
- [ ] Shared waitlist URL with target audience

## 📊 What Data You'll Collect

For each user:
- Email address
- Role (photographer/developer/etc.)
- All survey answers (9 questions per role)
- IP address (for fraud prevention)
- User agent (device/browser info)
- Referrer (where they came from)
- Timestamp

Perfect for:
- Understanding your audience
- Segmenting by role
- Prioritizing features based on feedback
- Email marketing campaigns
- Product positioning

---

**Ready to deploy!** Push to GitHub and connect to Vercel! 🚀
