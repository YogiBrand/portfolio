'use client';

import React, { useState } from 'react';
import { Camera, Code, Video, Palette, ArrowRight, Check, Sparkles } from 'lucide-react';

// Types
type RoleId = 'photographer' | 'developer' | 'video-editor' | 'creative';
type QuestionType = 'single' | 'multiple';

interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options: string[];
  maxSelections?: number;
}

// Main Waitlist App Component
export default function PortfolioWaitlist() {
  const [stage, setStage] = useState('landing'); // landing, role-select, survey, success
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Role configurations
  const roles: Array<{
    id: RoleId;
    name: string;
    icon: any;
    color: string;
    description: string;
    heroLine: string;
  }> = [
    {
      id: 'photographer' as const,
      name: 'Photographer',
      icon: Camera,
      color: 'from-purple-500 to-pink-500',
      description: 'Showcase your shots with stunning galleries',
      heroLine: 'Your best work deserves a portfolio as beautiful as your photos'
    },
    {
      id: 'developer' as const,
      name: 'Developer',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      description: 'Display projects with live demos & code',
      heroLine: 'Ship your portfolio faster than you can say git push'
    },
    {
      id: 'video-editor' as const,
      name: 'Video Editor',
      icon: Video,
      color: 'from-red-500 to-orange-500',
      description: 'Embed showreels and highlight your best edits',
      heroLine: 'Let your edits do the talking with an epic showreel site'
    },
    {
      id: 'creative' as const,
      name: 'Creative / Designer',
      icon: Palette,
      color: 'from-green-500 to-teal-500',
      description: 'Present your design work & case studies',
      heroLine: 'Your creativity deserves a canvas that matches your vision'
    }
  ];

  // Role-specific survey questions
  const surveyQuestions: Record<RoleId, Question[]> = {
    photographer: [
      {
        id: 'portfolio-blocker',
        question: 'What\'s REALLY stopping you from having the portfolio you want?',
        type: 'single',
        options: [
          'I\'ve been procrastinating for months - never started',
          'I started but gave up halfway - too overwhelming',
          'I have one but it looks generic/amateur',
          'I have one but updating it takes FOREVER',
          'My images load slow and look bad on mobile',
          'I lost clients because I don\'t have a proper showcase'
        ]
      },
      {
        id: 'time-spent',
        question: 'Be honest: How much time have you WASTED trying to build/fix your portfolio?',
        type: 'single',
        options: [
          '0 hours - I haven\'t started yet',
          '5-10 hours - got frustrated and quit',
          '20-40 hours - still not happy with it',
          '40+ hours - I\'m exhausted and it\'s STILL not done',
          'Weeks/months on-and-off - it\'s my procrastination project'
        ]
      },
      {
        id: 'biggest-pain',
        question: 'What makes you want to throw your laptop out the window?',
        type: 'single',
        options: [
          'Spending hours moving pixels around, still looks like crap',
          'My beautiful photos look compressed/pixelated online',
          'Takes me 30 minutes just to add one new project',
          'Mobile version is completely broken',
          'Every template looks the same - can\'t stand out',
          'Squarespace/Wix keeps crashing and I lose my work',
          'Can\'t afford to pay someone $3k+ to build it'
        ]
      },
      {
        id: 'dream-scenario',
        question: 'If you could snap your fingers, what would your DREAM portfolio process look like?',
        type: 'single',
        options: [
          'Upload 20 photos → get a stunning site in 5 minutes',
          'Pick a style, AI does the rest automatically',
          'Add new work in under 60 seconds, no login needed',
          'Looks unique to me, not a generic template',
          'Just WORKS on mobile without me doing anything',
          'Someone else builds it for me but it only costs $50'
        ]
      },
      {
        id: 'feature-ranking',
        question: 'Rank these features: Which 3 are MUST-HAVES for you? (Pick exactly 3)',
        type: 'multiple',
        maxSelections: 3,
        options: [
          'Lightning-fast image loading (optimized automatically)',
          'Perfect mobile responsive (no manual work)',
          'Gallery layouts (grid, masonry, slideshow)',
          'Client testimonials section',
          'Before/after comparison sliders',
          'Instagram feed integration',
          'Contact/booking form',
          'Blog for behind-the-scenes',
          'Print shop/ecommerce integration',
          'SEO optimization (get found on Google)',
          'Password-protected client galleries',
          'Add new projects in under 2 minutes'
        ]
      },
      {
        id: 'switching-trigger',
        question: 'What would make you switch FROM Squarespace/Wix TO this?',
        type: 'single',
        options: [
          'If images loaded 5x faster and looked better',
          'If I could build it in under 10 minutes (vs hours)',
          'If updating was actually easy (not a 30-min ordeal)',
          'If it cost half as much ($10-15 vs $25-40)',
          'If mobile version just WORKED without me fixing it',
          'If it looked unique, not like every other template',
          'Nothing - I\'d stick with what I have'
        ]
      },
      {
        id: 'usage-frequency',
        question: 'Which features would you use WEEKLY? (Pick all that apply)',
        type: 'multiple',
        options: [
          'Add/update new photos from shoots',
          'Change layout/design of galleries',
          'Check visitor analytics (who viewed my site)',
          'Update about/bio section',
          'Add client testimonials',
          'Write blog posts',
          'Respond to contact form inquiries',
          'Share portfolio on social media',
          'Update pricing/services page',
          'None - I rarely update once it\'s live'
        ]
      },
      {
        id: 'deal-breaker',
        question: 'Which ONE feature would make you NOT use this? (Pick the worst one)',
        type: 'single',
        options: [
          'Takes more than 15 minutes to set up',
          'Images load slowly (3+ seconds)',
          'Photos look compressed/worse quality',
          'Can\'t use my own domain (stuck with subdomain)',
          'Costs more than $30/month',
          'Mobile version looks broken',
          'Can\'t easily switch templates later',
          'No way to update from my phone'
        ]
      },
      {
        id: 'pricing',
        question: 'What would you pay for a tool that solves all this?',
        type: 'single',
        options: [
          '$20-25/month - If it saves me hours of work',
          '$25-30/month - If images look perfect and load fast',
          '$30-40/month - If it books me more clients',
          '$40+/month - If it\'s truly professional quality',
          'I\'d try free tier first, then upgrade'
        ]
      }
    ],
    developer: [
      {
        id: 'portfolio-reality',
        question: 'What\'s your portfolio situation REALLY like?',
        type: 'single',
        options: [
          'It\'s on my todo list... for the past 6 months',
          'I started building it but got bored/busy',
          'I have a basic GitHub README and that\'s it',
          'Mine exists but looks like it\'s from 2015',
          'I have one but I\'m embarrassed to send it to employers',
          'Spending more time on it than actual coding projects'
        ]
      },
      {
        id: 'real-blocker',
        question: 'Why haven\'t you shipped your perfect portfolio yet?',
        type: 'single',
        options: [
          'Spending time coding a portfolio feels like a waste (I should be coding real projects)',
          'I\'m a backend dev - design is NOT my thing',
          'Analysis paralysis: too many framework choices',
          'Every time I start, I want to rebuild it with the new hot framework',
          'Don\'t want to spend time on deployment/hosting setup',
          'My projects aren\'t "impressive" enough yet'
        ]
      },
      {
        id: 'hiring-reality',
        question: 'When job hunting, what actually happens with your portfolio?',
        type: 'single',
        options: [
          'Hiring managers spend 2 minutes then move on',
          'They just look at my GitHub, not my website',
          'Mobile version breaks and I lose opportunities',
          'They want to see code, not a fancy website',
          'My portfolio projects don\'t match job requirements',
          'Haven\'t gotten a single interview from my portfolio'
        ]
      },
      {
        id: 'showcase-problem',
        question: 'What\'s hardest about showing off your work?',
        type: 'single',
        options: [
          'My best work is all proprietary/NDA code',
          'My projects are on GitHub but no one sees them',
          'Can\'t explain technical decisions without being boring',
          'Side projects are half-finished and embarrassing',
          'Don\'t know how to make CRUD apps look impressive',
          'Screenshots don\'t do justice - need live demos'
        ]
      },
      {
        id: 'must-have-features',
        question: 'Pick your top 3 MUST-HAVE features (exactly 3)',
        type: 'multiple',
        maxSelections: 3,
        options: [
          'GitHub integration (auto-pull repos with stats)',
          'Live project demos (not just screenshots)',
          'Code syntax highlighting that actually works',
          'Tech stack badges/icons',
          'One-click deploy to Vercel/Netlify',
          'Resume/CV download section',
          'Blog for technical writing',
          'Contact form',
          'SEO optimized (get found on Google)',
          'Mobile responsive (automatic)',
          'Dark mode',
          'Fast page loads (<1 second)'
        ]
      },
      {
        id: 'github-importance',
        question: 'If this tool auto-synced with GitHub (shows your best repos), would you use it?',
        type: 'single',
        options: [
          'YES - that\'s a game-changer, I\'d use it immediately',
          'YES - but only if it picks the RIGHT repos to show',
          'MAYBE - depends on how it looks',
          'NO - I want manual control over what\'s shown',
          'NO - hiring managers don\'t care about GitHub anyway'
        ]
      },
      {
        id: 'time-value',
        question: 'How much time would this need to save you to be worth $10/month?',
        type: 'single',
        options: [
          '2+ hours (I can build my own in 2 hours)',
          '5+ hours (worth it if it saves me 5 hours)',
          '10+ hours (needs to save significant time)',
          '20+ hours (my time is valuable)',
          'Doesn\'t matter - I won\'t pay for something I can build myself'
        ]
      },
      {
        id: 'job-hunting-features',
        question: 'For job hunting, which matters MOST? (Pick one)',
        type: 'single',
        options: [
          'ATS-friendly resume download',
          'Showcasing projects with clear tech stack',
          'Live demos that actually work',
          'GitHub contributions graph/stats',
          'Technical blog posts showing expertise',
          'Explaining my thinking process (not just code)',
          'Mobile-friendly (recruiters check on phone)',
          'None - portfolios don\'t get me interviews anyway'
        ]
      },
      {
        id: 'pricing',
        question: 'What would you pay for a portfolio that actually gets you interviews?',
        type: 'single',
        options: [
          '$20/month - If it saves me 20+ hours',
          '$25/month - If GitHub integration works perfectly',
          '$30/month - If it looks better than custom-built',
          '$35+/month - If it actually lands me a job',
          'I need a free tier to try it first'
        ]
      }
    ],
    'video-editor': [
      {
        id: 'current-mess',
        question: 'How are you showing your work to clients right now?',
        type: 'single',
        options: [
          'Sending Vimeo/YouTube links in emails like an amateur',
          'Using Instagram but it compresses my work to hell',
          'WeTransfer-ing huge files because I don\'t have a site',
          'Have a portfolio but videos take FOREVER to load',
          'Using Squarespace and it butchers my video quality',
          'I lost a client because they couldn\'t find my work easily'
        ]
      },
      {
        id: 'video-nightmare',
        question: 'What makes you rage when dealing with portfolio sites?',
        type: 'single',
        options: [
          'Embedding videos is a technical nightmare',
          'My 4K showreel looks like 480p on mobile',
          'Video thumbnails are auto-generated and look terrible',
          'Can\'t organize by project type (commercials vs weddings)',
          'Loading a single video preview page takes 10 seconds',
          'Vimeo embeds have their ugly branding all over',
          'Client asks "where\'s your website?" and I cringe'
        ]
      },
      {
        id: 'client-loss',
        question: 'Have you ACTUALLY lost work because of your portfolio (or lack of one)?',
        type: 'single',
        options: [
          'Yes - client went with someone who had a better portfolio',
          'Yes - potential clients ghost me after I send my "portfolio"',
          'Probably - hard to tell but I\'m not booking enough',
          'Not yet but I\'m nervous every time I share my work',
          'No - but I\'m embarrassed every time someone asks for my site',
          'I don\'t even pitch high-end clients because I\'m ashamed'
        ]
      },
      {
        id: 'update-hell',
        question: 'How painful is it to add new work to your current setup?',
        type: 'single',
        options: [
          'I have to upload to YouTube first, then embed - takes 30 mins',
          'So painful I haven\'t updated in 6+ months',
          'I avoid it because the interface is confusing',
          'I pay someone to do it because I can\'t figure it out',
          'Easy but my site looks generic and unprofessional',
          'No setup yet - that\'s why I\'m here'
        ]
      },
      {
        id: 'must-have-features',
        question: 'Your top 3 MUST-HAVE features (pick exactly 3)',
        type: 'multiple',
        maxSelections: 3,
        options: [
          'Video showreel on homepage (auto-plays beautifully)',
          'YouTube/Vimeo embed without their ugly branding',
          'Fast video loading (no 10-second wait times)',
          'Custom video thumbnails (not auto-generated crap)',
          'Category filtering (commercials, weddings, music videos)',
          'Password-protected client galleries',
          'Project case studies (before/after, process)',
          'Client testimonials section',
          'Booking/inquiry form',
          'Mobile optimization (videos work on phones)',
          'Behind-the-scenes content section',
          'SEO optimized (get found on Google)'
        ]
      },
      {
        id: 'video-quality-importance',
        question: 'Be honest: Would you pay MORE for better video quality/loading?',
        type: 'single',
        options: [
          'YES - I\'d pay $30-40/month if my 4K looked perfect',
          'YES - I\'d pay $20-30/month for good optimization',
          'MAYBE - depends how much better it looks',
          'NO - video quality is fine on YouTube/Vimeo',
          'NO - I\'ll compress videos myself to save money'
        ]
      },
      {
        id: 'client-booking',
        question: 'If clients could book you DIRECTLY from your portfolio, would you use it?',
        type: 'single',
        options: [
          'YES - that would book me more clients immediately',
          'YES - but only if it integrated with my calendar',
          'MAYBE - depends on the booking flow',
          'NO - I prefer email inquiries only',
          'NO - I use a different booking system already'
        ]
      },
      {
        id: 'update-speed',
        question: 'How fast should adding a new video project be?',
        type: 'single',
        options: [
          'Under 2 minutes or I won\'t update regularly',
          'Under 5 minutes is acceptable',
          'Under 10 minutes is fine',
          '10-15 minutes is okay if it looks good',
          'Doesn\'t matter - I rarely add new work anyway'
        ]
      },
      {
        id: 'pricing',
        question: 'What would you invest in a portfolio that books you more clients?',
        type: 'single',
        options: [
          '$20-25/month - If videos load fast and look amazing',
          '$25-30/month - If it includes client galleries',
          '$30-40/month - If it books me one extra $5k client',
          '$40+/month - If video quality is truly 4K perfect',
          'I need to try free tier first'
        ]
      }
    ],
    creative: [
      {
        id: 'portfolio-shame',
        question: 'What\'s the TRUTH about your current portfolio?',
        type: 'single',
        options: [
          'It\'s outdated and I\'m too embarrassed to share it',
          'I\'ve started 3 times and never finished',
          'Just using Behance/Dribbble - feels unprofessional',
          'Spent weeks on it, still looks generic',
          'I have one but adding new projects is torture',
          'Don\'t have one - using Instagram which isn\'t cutting it'
        ]
      },
      {
        id: 'design-paradox',
        question: 'As a designer, what\'s your ACTUAL portfolio problem?',
        type: 'single',
        options: [
          'Mine needs to be perfect - I\'ve been tweaking for months',
          'Every template looks amateur compared to my work',
          'I design for others all day - no energy for my own site',
          'Started custom coding it - now it\'s been 6 months',
          'Client work looks great, but I can\'t explain my process',
          'Imposter syndrome - my portfolio never feels "ready"'
        ]
      },
      {
        id: 'case-study-hell',
        question: 'What makes creating case studies absolute torture?',
        type: 'single',
        options: [
          'Writing is hard - I\'m a visual person',
          'Takes 3-4 hours PER project to document',
          'Don\'t know what clients actually want to read',
          'My best work is under NDA',
          'Writing about my process feels pretentious',
          'Too many screenshots - it looks cluttered'
        ]
      },
      {
        id: 'competitor-envy',
        question: 'When you see other designers\' portfolios...',
        type: 'single',
        options: [
          'I think "mine should look that good" - then feel stuck',
          'They all look the same - I can\'t stand out',
          'They clearly spent $$$$ or months building it',
          'Mine needs crazy animations to compete',
          'How do they have time for this??',
          'They\'re probably not getting work either'
        ]
      },
      {
        id: 'must-have-features',
        question: 'Top 3 features you NEED (pick exactly 3)',
        type: 'multiple',
        maxSelections: 3,
        options: [
          'Beautiful project galleries (make my work shine)',
          'Case study templates (stop staring at blank page)',
          'AI-generated project descriptions (save 3 hours per project)',
          'Process visualization (show my thinking, not just finals)',
          'Client testimonials section',
          'About me / personal story section',
          'Service offerings page',
          'Blog for design thoughts',
          'Contact/inquiry form',
          'Fast mobile experience',
          'SEO optimization (get found by clients)',
          'Easy updates (add project in under 5 minutes)'
        ]
      },
      {
        id: 'ai-writing',
        question: 'If AI could write your case studies, would you use it?',
        type: 'single',
        options: [
          'YES - writing case studies is torture, I\'d use this daily',
          'YES - as a starting draft I can edit',
          'MAYBE - depends on the quality',
          'NO - my writing needs to sound like me',
          'NO - case studies should be authentic, not AI'
        ]
      },
      {
        id: 'template-vs-custom',
        question: 'Would you rather have...',
        type: 'single',
        options: [
          'Amazing template that looks custom (done in 1 hour)',
          'Full customization but takes 20+ hours to build',
          'Template + some customization (done in 3-4 hours)',
          'Basic template but can add custom CSS',
          'Blank canvas - I want to design everything myself'
        ]
      },
      {
        id: 'completion-guarantee',
        question: 'What would make you ACTUALLY finish your portfolio?',
        type: 'single',
        options: [
          'If I could build it in under 2 hours total',
          'If AI did 90% and I just approved/tweaked',
          'If someone gave me a deadline and held me accountable',
          'If it was SO easy I couldn\'t procrastinate',
          'If updating was fast (no 30-min ordeal)',
          'Honestly, nothing - I\'m a perfectionist and never finish'
        ]
      },
      {
        id: 'pricing',
        question: 'What would you pay for a portfolio you\'d actually finish and maintain?',
        type: 'single',
        options: [
          '$20-25/month - If AI writes my case studies',
          '$25-30/month - If it looks custom, not template-y',
          '$30-35/month - If it books me freelance clients',
          '$35+/month - If it saves me 10+ hours per project',
          'I need free tier to test it first'
        ]
      }
    ]
  };

  // Get current role config
  const currentRole = roles.find(r => r.id === selectedRole);
  const currentQuestions: Question[] = selectedRole ? surveyQuestions[selectedRole as RoleId] : [];

  // Handle answer selection
  const handleAnswer = (questionId: string, answer: string) => {
    const question = currentQuestions.find(q => q.id === questionId);
    
    if (!question) return;
    
    if (question.type === 'multiple') {
      const current = (responses[questionId] || []) as string[];
      const maxSelections = question.maxSelections || Infinity;
      
      if (current.includes(answer)) {
        // Remove if already selected
        const updated = current.filter(a => a !== answer);
        setResponses({ ...responses, [questionId]: updated });
      } else {
        // Add if under limit
        if (current.length < maxSelections) {
          const updated = [...current, answer];
          setResponses({ ...responses, [questionId]: updated });
        }
        // If at limit, do nothing (or optionally replace oldest)
      }
    } else {
      setResponses({ ...responses, [questionId]: answer });
    }
  };

  // Check if all questions answered
  const allQuestionsAnswered = currentQuestions.every(q => {
    const response = responses[q.id];
    return response && (Array.isArray(response) ? response.length > 0 : true);
  });

  // Submit to waitlist
  const handleSubmit = async () => {
    if (!email || !selectedRole) return;
    
    setSubmitting(true);
    
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role: selectedRole,
          responses,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to submit');
      }

      setStage('success');
    } catch (error) {
      console.error('Submission failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to join waitlist. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // LANDING PAGE
  if (stage === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-20">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Early Access • Launching Soon</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Your Portfolio,
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Built in Minutes
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              AI-powered portfolio builder for creators. Choose a template, add your work, 
              get a stunning website. No coding required.
            </p>

            <button
              onClick={() => setStage('role-select')}
              className="bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-100 transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              Join the Waitlist
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {roles.map(role => {
              const Icon = role.icon;
              return (
                <div
                  key={role.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className={`bg-gradient-to-br ${role.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{role.name}</h3>
                  <p className="text-sm text-slate-400">{role.description}</p>
                </div>
              );
            })}
          </div>

          {/* Social Proof */}
          <div className="text-center text-slate-400 text-sm">
            <p>Join 2,847+ creators waiting for early access</p>
          </div>
        </div>
      </div>
    );
  }

  // ROLE SELECTION
  if (stage === 'role-select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <button
            onClick={() => setStage('landing')}
            className="text-slate-400 hover:text-white mb-8 flex items-center gap-2"
          >
            ← Back
          </button>

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What type of creator are you?</h2>
            <p className="text-slate-300 text-lg">
              We'll customize the experience for your specific needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {roles.map(role => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role.id);
                    setStage('survey');
                  }}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-xl p-8 text-left transition-all group"
                >
                  <div className={`bg-gradient-to-br ${role.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{role.name}</h3>
                  <p className="text-slate-300 mb-4">{role.heroLine}</p>
                  <div className="flex items-center gap-2 text-purple-400">
                    Continue <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // SURVEY
  if (stage === 'survey' && currentRole) {
    const Icon = currentRole.icon;
    const answeredCount = Object.keys(responses).length;
    const progress = (answeredCount / currentQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <button
            onClick={() => setStage('role-select')}
            className="text-slate-400 hover:text-white mb-8 flex items-center gap-2"
          >
            ← Back
          </button>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`bg-gradient-to-br ${currentRole.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{currentRole.name} Survey</h3>
                  <p className="text-sm text-slate-400">
                    {answeredCount} of {currentQuestions.length} answered
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${currentRole.color} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-8">
            {currentQuestions.map((question, idx) => (
              <div key={question.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-4">
                  {idx + 1}. {question.question}
                </h3>
                
                {question.type === 'multiple' && question.maxSelections && (
                  <p className="text-sm text-purple-400 mb-3">
                    Selected: {(Array.isArray(responses[question.id]) ? responses[question.id].length : 0)} / {question.maxSelections}
                  </p>
                )}
                
                <div className="space-y-2">
                  {question.options.map(option => {
                    const isSelected = question.type === 'multiple'
                      ? (Array.isArray(responses[question.id]) && responses[question.id].includes(option))
                      : responses[question.id] === option;

                    return (
                      <button
                        key={option}
                        onClick={() => handleAnswer(question.id, option)}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-purple-500/20 border-purple-400'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected ? 'bg-purple-500 border-purple-500' : 'border-white/30'
                          }`}>
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {question.type === 'multiple' && (
                  <p className="text-sm text-slate-400 mt-2">
                    {question.maxSelections 
                      ? `Pick exactly ${question.maxSelections}`
                      : 'Select all that apply'}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Email + Submit */}
          <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold mb-4">
              Almost done! Where should we send your early access?
            </h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-purple-400 focus:outline-none mb-4"
            />
            <button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered || !email || submitting}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                allQuestionsAnswered && email && !submitting
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                  : 'bg-white/10 cursor-not-allowed opacity-50'
              }`}
            >
              {submitting ? 'Submitting...' : 'Join Waitlist'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SUCCESS PAGE
  if (stage === 'success' && currentRole) {
    const Icon = currentRole.icon;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <div className="mb-8">
            <div className={`bg-gradient-to-br ${currentRole.color} w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
              <Check className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">You're on the list! 🎉</h2>
            <p className="text-xl text-slate-300 mb-6">
              We'll email you at <span className="text-white font-semibold">{email}</span> when we launch.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-8 border border-white/10 mb-6">
            <h3 className="text-xl font-semibold mb-4">What happens next?</h3>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="bg-purple-500/20 rounded-lg p-2 mt-1">
                  <span className="text-purple-400 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Early access invite</h4>
                  <p className="text-slate-400">You'll get first access when we launch in 2-3 weeks</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-500/20 rounded-lg p-2 mt-1">
                  <span className="text-purple-400 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Exclusive perks</h4>
                  <p className="text-slate-400">Early users get 50% off for 6 months + custom domain free</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-500/20 rounded-lg p-2 mt-1">
                  <span className="text-purple-400 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Shape the product</h4>
                  <p className="text-slate-400">Your feedback will directly influence features we build</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
            <p className="text-sm text-slate-300">
              💡 <span className="font-semibold">Pro tip:</span> Share with your creative friends! 
              The more signups we get, the faster we launch.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
