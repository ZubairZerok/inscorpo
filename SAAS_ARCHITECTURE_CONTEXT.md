# 🏛️ INSYT CORPORATE — SUPERMASSIVE SAAS ARCHITECTURE CONTEXT & CODEBASE SPECIFICATION

> **System Overview**: INSYT Corporate is a high-performance, executive-grade **Career Operating System** designed to bridge higher education and corporate recruitment. It combines verified skill tracks, job simulations, AI-powered mock interviews, gamified XP progression, interactive resume building (Career Passport), standardized test prep, and corporate recruitment pipelines.

---

## 1. TECH STACK & SYSTEM ARCHITECTURE

| Layer | Technology | Version / Configuration |
|---|---|---|
| **Framework** | Next.js (App Router) | `16.2.10` (Turbopack enabled) |
| **UI Library** | React | `19.2.4` (Client & Server Components) |
| **Styling System** | Tailwind CSS + Vanilla CSS Tokens | `@tailwindcss/postcss ^4` + `@import "tailwindcss"` + CSS Custom Variables |
| **Animations** | Framer Motion | `^12.42.2` (Springs, AnimatePresence, Layout animations) |
| **Icons** | Lucide React | `^1.24.0` |
| **Backend & DB** | Appwrite (Cloud / Local Node) | `appwrite ^26.2.0` (Client SDK), `node-appwrite ^27.0.0` (Server SDK) |
| **PDF Generation** | jsPDF + html2canvas | `jspdf ^4.2.1`, `html2canvas ^1.4.1` |
| **Language** | TypeScript | `^5` (Strict mode) |

---

## 2. DIRECTORY STRUCTURE & FILE MAP

```
d:\inscorpo
├── app/                           # Next.js App Router root
│   ├── (admin)/                   # Admin management interfaces
│   ├── (auth)/                    # Authentication routes (login, register)
│   ├── (dashboard)/               # Authenticated Dashboard Application shell
│   │   ├── ai/                    # AI Assistant Suite (12+ AI Prompt Coaches)
│   │   ├── career-hub/            # Career Opportunities Hub
│   │   ├── career-passport/       # Interactive Resume Builder & Hash Verification
│   │   ├── certificates/          # Verifiable Certificate Gallery
│   │   ├── challenges/            # Gamified Skill Challenges
│   │   ├── community/             # Discussion Spaces & Social Activity
│   │   ├── company-reviews/       # Salary Benchmarks & Company Directory
│   │   ├── dashboard/             # Executive Command Center Main View
│   │   ├── events/baubc/          # BAUBC Business Competition Partnership
│   │   ├── gmat-insights/         # Data Insights Lab & Business Analytics
│   │   ├── gmat-journal/          # Mistake Log & Journal
│   │   ├── gmat-practice/         # GMAT Practice Hub
│   │   ├── gmat-tutor/            # AI GMAT Tutor
│   │   ├── gre-formulas/          # Aptitude Formula Library
│   │   ├── gre-notebook/          # GRE Mistake Notebook
│   │   ├── gre-practice/          # Verbal Practice Hub
│   │   ├── gre-tutor/             # AI English & Verbal Coach
│   │   ├── gre-vocabulary/        # Interactive Vocab Flashcard Engine
│   │   ├── help/                  # Help Center & FAQ
│   │   ├── jobs/                  # Job Opportunities & 1-Click Apply
│   │   ├── leaderboard/           # Global XP Standings & Tier Rankings
│   │   ├── learn/                 # Academy, Learning Paths & Lesson Player
│   │   │   ├── [pathSlug]/        # Path detail view
│   │   │   └── courses/           # Course Catalog Explorer
│   │   ├── marketplace/           # XP Store & Voucher Redemption Hub
│   │   ├── mba-center/            # MBA Success Center
│   │   ├── mock-interviews/       # AI Voice/Mic Mock Interview Simulator
│   │   ├── mock-tests/            # Timed Assessment & Practice Test Engine
│   │   ├── rewards/               # Gamification Rewards Overlay
│   │   ├── settings/              # User Preferences & Data Reset
│   │   ├── simulations/           # Corporate Job Simulations
│   │   ├── subscription/          # Monetization & Payment Checkout
│   │   ├── workshops/             # Live Executive Workshops
│   │   ├── layout.tsx             # Dashboard Layout (Sidebar + Topbar + Banner + BottomNav)
│   │   └── page.tsx               # Main Dashboard Route
│   ├── (marketing)/               # Public Marketing Landing Pages
│   ├── api/                       # Next.js Serverless API Routes
│   │   ├── ai/                    # AI Integration endpoints
│   │   ├── events/register/       # Event registration handler
│   │   ├── payments/              # Payment gateways (bKash, Nagad, SSLCommerz, Stripe)
│   │   ├── seed/                  # Database seeder route
│   │   └── setup/                 # Appwrite DB schema initializer
│   ├── globals.css                # CSS Variables, Design System Tokens, Animations
│   └── layout.tsx                 # Root HTML/Body Layout
├── components/                    # Reusable Component Architecture
│   ├── auth-guard.tsx             # Authentication Route Protection Guard
│   ├── dashboard/                 # Dashboard Widgets (Hero, Heatmap, Velocity Chart, Feed)
│   ├── layout/                    # Shell Navigation (Sidebar, Topbar, MobileNav, Banner)
│   └── providers/                 # React Context Providers (UserContext, AuthProvider, ThemeProvider)
├── lib/                           # Core Business Logic & Infrastructure
│   ├── appwrite.ts                # Appwrite SDK client connection
│   ├── db.ts                      # Appwrite Database CRUD functions & fallbacks
│   ├── payments.ts                # Payment plans, pricing tiers, and checkout processor
│   ├── subscription.ts            # Tier feature access matrix (`hasFeatureAccess`)
│   ├── data/                      # Hardcoded static data catalogs (courses, jobs, challenges)
│   └── state/                     # Global User State types & initial values
└── public/                        # Static assets, branding, and images
```

---

## 3. STATE MANAGEMENT & USER CONTEXT

### State Type Schema (`lib/state/types.ts`)

Global state is maintained via `UserProvider` (`components/providers/user-context.tsx`) and synced to Appwrite User Preferences (`account.updatePrefs()`).

```typescript
export type UserState = {
  // Core Profile Identity
  name: string;
  username: string;
  email: string;
  xp: number;            // Total Earned Experience Points
  level: number;         // Level = Math.floor(xp / 200) + 1
  streak: number;        // Consecutive Daily Check-in Streak Days
  
  // Weekly Activity Tracking (Minutes Mon-Sun: [0..6])
  weeklyActivity: number[];

  // Collections
  notifications: Notification[];
  courseProgress: CourseProgress[];
  leaderboard: LeaderboardUser[];
  communityPosts: CommunityPost[];
  xpLogs: XpLog[];
  todayTasks: Task[];
  upcomingEvents: Event[];
  recentBadges: Badge[];

  // User Goals & Scoping
  careerGoals?: string[];
  experienceLevel?: string;

  // Subscription & Monetization
  subscriptionTier?: "starter" | "pro" | "enterprise";
  subscriptionStatus?: "active" | "inactive" | "trialing";

  // Career Passport CV Data
  passportProfile?: PassportProfile;

  // Gamification & Enrollments
  enrolledPathSlugs: string[];
  lastCheckInDate?: string;
  streakFreezes?: number;
  redeemedVouchers: string[];
  completedChallengeIds: string[];
  purchasedItemIds: string[];
};
```

### Key User Context Actions (`UserContextType`)
- `addXP(amount, reason)`: Increments XP, recalculates level, records ISO-timestamped `XpLog`.
- `claimDailyCheckIn()`: Awards +25 XP, increments streak, records 5 mins activity.
- `updateCourseProgress(courseId, progress)`: Updates percentage; awards +300 XP and "Course Graduate" badge upon 100% completion.
- `enrollInPath(slug, title)`: Appends path to `enrolledPathSlugs`, triggers welcome notification.
- `buyStreakFreeze()`: Spends 200 XP to add a protective streak shield.
- `updatePassportProfile(data)`: Merges fields into `passportProfile`.
- `recordStudyMinutes(minutes)`: Increments today's index in `weeklyActivity`.

---

## 4. DATABASE & BACKEND SCHEMA (`lib/db.ts`)

**Appwrite Database ID**: `6a56075800013fce1aa1`

### Collections & Fallback Architecture
All DB calls implement **graceful degradation** — if Appwrite collections or indexes are unconfigured, fallback local data is returned so the app remains 100% functional.

1. **`profiles`**: User profile sync (`name`, `xp`, `level`, `streak`, `email`).
2. **`tasks`**: Daily tasks catalog (`title`, `xp`, `category`).
3. **`events`**: Upcoming events (`title`, `date`, `time`, `type`, `location`).
4. **`paths`**: Learning paths metadata (`slug`, `title`, `modules`, `hours`, `topics`).
5. **`courses`**: Course module catalog (`slug`, `pathSlug`, `title`, `xp`, `skills`).
6. **`community_posts`**: Social posts (`authorName`, `content`, `space`, `likes`, `replies`).
7. **`mock_tests`**: Test suite (`title`, `category`, `duration`, `questions`, `xp`).
8. **`test_attempts`**: Historical score records (`userId`, `testId`, `score`, `correctAnswers`).
9. **`workshops`**: Live workshop listings (`title`, `host`, `date`, `spots`).
10. **`workshop_registrations`**: Seat bookings (`workshopId`, `userId`, `registeredAt`).
11. **`certificates`**: Issued credentials (`title`, `issueDate`, `hash`).

---

## 5. GAMIFICATION ENGINE & EXECUTIVE RANKS

### Level & XP Formula
- **Level Calculation**: `Level = Math.floor(XP / 200) + 1`
- **XP Sources**:
  - Daily Check-in: `+25 XP`
  - Daily Task Completion: `+15 to +50 XP`
  - Module Completion: `+150 XP`
  - Course Track Completion (100%): `+300 XP`
  - Voucher Code Redemption: `+100 to +500 XP`
  - Challenge Win: `+200 to +500 XP`
  - Item Purchase Bonus: `+100 XP`

### Executive Rank Tiers

| Rank Name | Min XP Required | Color Code | Badge | Title Tier |
|---|---|---|---|---|
| **Bronze** | 0 XP | `#CD7F32` | 🥉 | Associate |
| **Silver** | 2,500 XP | `#94A3B8` | 🥈 | Specialist |
| **Gold** | 7,500 XP | `#D97706` | 🥇 | Lead |
| **Platinum** | 15,000 XP | `#6366F1` | 💎 | Manager |
| **Diamond** | 30,000 XP | `#0891B2` | 👑 | Director |
| **Elite** | 50,000 XP | `#DC2626` | ⚡ | Vice President |
| **Legend** | 100,000 XP | `#F59E0B` | 🌟 | Chief Executive (C-Suite) |

---

## 6. CORE DOMAIN MODULE SPECIFICATIONS

### 1. Dashboard Overview (`/dashboard`)
- **`DashboardHero`**: Dynamic welcome banner showing user rank, greeting, level progress bar, and dynamic CTA resolving active enrolled track.
- **`ActivityHeatmap`**: 16-week (112-day) GitHub-style contribution grid driven by `xpLogs`.
- **`WeeklyVelocityChart`**: Dynamic daily learning time bar chart with threshold target line at 30 mins/day.
- **`ActivityFeed`**: SoloLearn-style timeline widget synthesizing course completions, badges, streak milestones, challenge wins, and community peer events.
- **Right Sidebar Widgets**: Daily Streak Check-in, Today's Action Tasks, XP Audit Ledger, Badges Gallery, Live Leaderboard Standings.

### 2. Career Passport & CV Builder (`/career-passport`)
- Interactive profile editor: Headline, Summary, Contact, Education, Work Experience array, Custom Skills tags.
- Cryptographic Verification Hash generation for authenticating resume integrity.
- **High-Res PDF Exporter**: Uses `html2canvas` + `jsPDF` to compile a professional 1-page executive resume layout directly in browser.

### 3. Academy & Learning Paths (`/learn`)
- 8 Core Executive Tracks:
  1. `excel-corporate`: Excel Financial Modeling & XLOOKUP Masterclass
  2. `corporate-mto`: Corporate Management Trainee (MTO) Preparation
  3. `power-bi`: Power BI & Business Intelligence Analytics
  4. `ai-automation`: AI & Prompt Engineering for Work
  5. `supply-chain`: Supply Chain Operations & Logistics
  6. `business-comm`: Executive Business Communication & PPT
  7. `project-management`: Agile & PMP Project Management
  8. `digital-marketing`: Growth Marketing & Personal Branding
- Sub-routes: `/learn/courses` (catalog explorer), `/learn/[pathSlug]` (path detail), `/learn/[pathSlug]/[courseSlug]/[lessonSlug]` (lesson player).

### 4. Job Simulations & AI Mock Interviews
- **`/simulations`**: Portfolio-building corporate project tasks with deliverable requirements, document submitters, and automated XP rewards.
- **`/mock-interviews`**: Interactive AI voice simulator using browser Web Speech API (`webkitSpeechRecognition`) for real-time behavioral & technical interview scenarios.

### 5. Practice & Test Prep (`/mock-tests`, `/gre-vocabulary`, `/gmat-insights`)
- **`/mock-tests`**: Timed quiz/assessment engine with automatic score logging.
- **`/gre-vocabulary`**: Spaced-repetition flashcard engine with "Mastered" vs "Review Later" state tracking.
- **`/gmat-insights`**: Interactive data analysis practice for charts, tables, and multi-source reasoning.
- **Conditional Navigation Rules**: Standardized test prep items are dynamically visible in navigation ONLY if user is enrolled in test-prep paths or specifies verbal/GMAT career goals.

### 6. Monetization & Subscriptions (`/subscription`)
- **Tiers**: `Starter` (Free), `Pro` (৳999/mo or ৳7,990/yr), `Enterprise` (Custom).
- **Payment Gateways**: Local Bangladesh gateways (bKash, Nagad) + Global (SSLCommerz, Stripe).
- **`PremiumBanner`**: Contextual route-aware top banner (e.g. "Take unlimited practice tests with INSYT Pro" on `/mock-tests`), hidden on small mobile screens (<640px).

---

## 7. DESIGN SYSTEM & STYLING SPECIFICATION

### CSS Tokens (`app/globals.css`)

```css
:root {
  --corp-bg: #FAFBFC;
  --corp-bg-secondary: #F3F4F6;
  --corp-surface: #FFFFFF;
  --corp-surface-hover: #F9FAFB;
  --corp-border: #E5E7EB;
  --corp-border-active: #D1D5DB;
  --corp-text: #111827;
  --corp-text-secondary: #374151;
  --corp-text-tertiary: #4B5563;
  --corp-accent: #2563EB;
  --corp-accent-hover: #1D4ED8;
  --corp-accent-light: #EFF6FF;
}

.dark {
  --corp-bg: #09090B;
  --corp-bg-secondary: #141417;
  --corp-surface: #1A1A1F;
  --corp-surface-hover: #222228;
  --corp-border: #2D2D32;
  --corp-border-active: #3F3F46;
  --corp-text: #FAFAFA;
  --corp-text-secondary: #E4E4E7;
  --corp-text-tertiary: #D4D4D8;
  --corp-accent: #60A5FA;
  --corp-accent-hover: #93C5FD;
  --corp-accent-light: rgba(96, 165, 250, 0.12);
}
```

### Component Styling Conventions
- **Cards**: `rounded-2xl border` with `background: "var(--corp-surface)"` and `borderColor: "var(--corp-border)"`.
- **Badges / Tags**: `rounded-full text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5`.
- **Typography**: Inter for sans-serif UI text, JetBrains Mono for numbers, XP, and timers.
- **Glassmorphism**: `.glass` class using `backdrop-filter: blur(20px)`.

---

## 8. KEY DEVELOPER CONTRACTS & GUIDELINES

1. **Always Use CSS Variables for Colors**: Never hardcode raw hex colors in components; use `var(--corp-surface)`, `var(--corp-border)`, `var(--corp-text)`, `var(--corp-accent)` to ensure seamless Light/Dark mode compatibility.
2. **Deterministic SSR Operations**: Never use `Math.random()` or module-level `Date.now()` inside React render functions or hooks to prevent SSR hydration mismatches. Use string-based hashing functions like `deterministicOffset()`.
3. **Appwrite Fallback Protection**: Any call to `databases.listDocuments` or `account.getPrefs` MUST be wrapped in try/catch blocks with sensible local initial fallbacks so the UI renders gracefully even if offline or missing collections.
4. **Navigation Consistency**: All new top-level routes MUST be added to `breadcrumbMap` in `dashboard-topbar.tsx` and routed through `buildNavSections()` in `dashboard-sidebar.tsx` and `mobile-bottom-nav.tsx`.
5. **Mobile Touch Area**: Interactive elements on mobile MUST have minimum dimensions of `44x44px` or contain `touch-manipulation` active states.
