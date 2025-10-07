# Quick Deploy Guide

## 🚀 Deploy to Vercel in 5 Minutes

### 1. Get a Free Database

**Neon (Recommended):**
1. Go to https://neon.tech → Sign up
2. Create project → Copy DATABASE_URL
3. Should look like: `postgresql://user:pass@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

### 2. Push to GitHub

```bash
cd /home/yogi/portfolio-waitlist

git init
git add .
git commit -m "Portfolio waitlist app"

# Create repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/portfolio-waitlist.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel

1. Go to https://vercel.com → New Project
2. Import your GitHub repo
3. Add Environment Variable:
   - Key: `DATABASE_URL`
   - Value: (paste your Neon database URL)
4. Click Deploy

### 4. Initialize Database

After first deploy, run this ONCE:

```bash
# Install Vercel CLI
npm i -g vercel

# Pull production env
vercel link
vercel env pull .env.production

# Push database schema
npx prisma db push
```

OR just visit your `/api/waitlist` endpoint once - it will create tables automatically.

### 5. Done!

Your waitlist is live at:
- Landing: `https://your-app.vercel.app`
- Admin: `https://your-app.vercel.app/admin`

## 📊 Collecting Responses

All responses automatically save to your database!

**View them:**
1. Visit: `https://your-app.vercel.app/admin`
2. See all signups
3. Click "Export CSV"
4. Import to Mailchimp/ConvertKit/etc.

## 🔐 Secure Admin (Optional)

Add password protection:

1. In Vercel, add env var:
   - `ADMIN_PASSWORD` = your_password

2. Create `/src/middleware.ts`:

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
        'WWW-Authenticate': 'Basic realm="Admin"',
      },
    });
  }
}
```

3. Redeploy

Now admin page requires login!

## 💾 Database Backup

Download all data regularly:

1. Visit `/admin`
2. Click "Export CSV"  
3. Save to Google Drive/Dropbox

Or use Prisma Studio:
```bash
npx prisma studio
```

## 🆘 Troubleshooting

**"Database connection failed"**
→ Check DATABASE_URL in Vercel env vars

**"No data showing"**
→ Test by submitting the form yourself
→ Check database has tables (use Prisma Studio)

**"CSS not loading"**
→ Hard refresh (Ctrl+Shift+R)
→ Clear Vercel build cache and redeploy

## 🎯 Free Database Options

| Provider | Free Tier | Best For |
|----------|-----------|----------|
| **Neon** | 0.5GB, 1 project | Easy setup, great DX |
| **Supabase** | 500MB, 2 projects | Has auth built-in |
| **Railway** | $5 credit | Simple, no credit card |
| **Vercel Postgres** | Paid | Tightly integrated |

We recommend **Neon** for this use case!

---

That's it! Your waitlist will be live and collecting responses! 🎉

