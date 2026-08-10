import { NextResponse } from "next/server";
import { Client, Databases, Permission, Role, Query } from "node-appwrite";

const DB_ID = "6a56075800013fce1aa1";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: Request) {
  const results: string[] = [];

  try {
    const adminSecret = req.headers.get("x-admin-secret");
    const expectedSecret = process.env.ADMIN_SECRET_KEY;

    if (!expectedSecret || adminSecret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized access to database setup endpoint" }, { status: 401 });
    }

    const reqBody = await req.json().catch(() => ({}));
    const apiKey = reqBody.apiKey || process.env.APPWRITE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server API key or request apiKey is required" }, { status: 400 });
    }

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1")
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "6a55c66500032e142d85")
      .setKey(apiKey);

    const db = new Databases(client);

    // ─── 1. CREATE DATABASE ──────────────────────────────────────
    try {
      await db.create(DB_ID, "InsytCorp");
      results.push("✅ Created database: 6a56075800013fce1aa1");
    } catch (e: any) {
      if (e.code === 409) {
        results.push("ℹ️ Database already exists");
      } else {
        results.push(`ℹ️ Database creation bypassed (using existing database): ${e.message}`);
      }
    }

    await sleep(1000);

    // ─── 2. CREATE COLLECTIONS ───────────────────────────────────
    const collections = [
      { id: "profiles",         name: "Profiles" },
      { id: "tasks",            name: "Tasks" },
      { id: "events",           name: "Events" },
      { id: "paths",            name: "Learning Paths" },
      { id: "courses",          name: "Courses" },
      { id: "community_posts",  name: "Community Posts" },
      { id: "mock_tests",       name: "Mock Tests" },
      { id: "workshops",        name: "Workshops" },
      { id: "certificates",     name: "Certificates" },
    ];

    for (const col of collections) {
      try {
        await db.createCollection(DB_ID, col.id, col.name, [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]);
        results.push(`✅ Created collection: ${col.name}`);
      } catch (e: any) {
        if (e.code === 409) results.push(`ℹ️ Collection exists: ${col.name}`);
        else results.push(`❌ Failed: ${col.name} — ${e.message}`);
      }
    }

    await sleep(2000);

    // ─── 3. ATTRIBUTES ───────────────────────────────────────────
    const stringAttr = async (col: string, key: string, size = 255, required = true, defaultVal?: string) => {
      try {
        await db.createStringAttribute(DB_ID, col, key, size, required, defaultVal);
        results.push(`  attr ✅ ${col}.${key}`);
      } catch (e: any) {
        if (e.code !== 409) results.push(`  attr ❌ ${col}.${key}: ${e.message}`);
      }
    };
    const intAttr = async (col: string, key: string, required = true, defaultVal?: number) => {
      try {
        await db.createIntegerAttribute(DB_ID, col, key, required, undefined, undefined, defaultVal);
        results.push(`  attr ✅ ${col}.${key}`);
      } catch (e: any) {
        if (e.code !== 409) results.push(`  attr ❌ ${col}.${key}: ${e.message}`);
      }
    };
    const floatAttr = async (col: string, key: string, required = true, defaultVal?: number) => {
      try {
        await db.createFloatAttribute(DB_ID, col, key, required, undefined, undefined, defaultVal);
        results.push(`  attr ✅ ${col}.${key}`);
      } catch (e: any) {
        if (e.code !== 409) results.push(`  attr ❌ ${col}.${key}: ${e.message}`);
      }
    };
    const boolAttr = async (col: string, key: string, required = true, defaultVal?: boolean) => {
      try {
        await db.createBooleanAttribute(DB_ID, col, key, required, defaultVal);
        results.push(`  attr ✅ ${col}.${key}`);
      } catch (e: any) {
        if (e.code !== 409) results.push(`  attr ❌ ${col}.${key}: ${e.message}`);
      }
    };
    const arrAttr = async (col: string, key: string, size = 255) => {
      try {
        await db.createStringAttribute(DB_ID, col, key, size, false, undefined, true);
        results.push(`  attr ✅ ${col}.${key}[]`);
      } catch (e: any) {
        if (e.code !== 409) results.push(`  attr ❌ ${col}.${key}[]: ${e.message}`);
      }
    };
    const indexAttr = async (col: string, key: string, type: "key" | "fulltext" | "unique", attributes: string[]) => {
      try {
        await db.createIndex(DB_ID, col, key, type as any, attributes);
        results.push(`  index ✅ ${col}.${key}`);
      } catch (e: any) {
        if (e.code !== 409) results.push(`  index ❌ ${col}.${key}: ${e.message}`);
      }
    };

    results.push("--- profiles ---");
    await stringAttr("profiles", "name");
    await stringAttr("profiles", "email");
    await intAttr("profiles", "xp", true, 0);
    await intAttr("profiles", "level", true, 1);
    await intAttr("profiles", "streak", true, 0);
    await stringAttr("profiles", "tier", 64, false, "Bronze");
    await sleep(500); // Wait for attributes to provision
    await indexAttr("profiles", "xp_index", "key", ["xp"]);
    await sleep(500);

    results.push("--- tasks ---");
    await stringAttr("tasks", "title");
    await intAttr("tasks", "xp");
    await stringAttr("tasks", "category", 64, false, "general");
    await sleep(500);

    results.push("--- events ---");
    await stringAttr("events", "title");
    await stringAttr("events", "date");
    await stringAttr("events", "time");
    await stringAttr("events", "type");
    await stringAttr("events", "location", 512, false, "Online");
    await stringAttr("events", "description", 1000, false);
    await sleep(500);

    results.push("--- paths ---");
    await stringAttr("paths", "slug");
    await stringAttr("paths", "title");
    await stringAttr("paths", "description", 1000);
    await intAttr("paths", "modules");
    await intAttr("paths", "hours");
    await intAttr("paths", "students", false, 0);
    await floatAttr("paths", "rating", false, 0);
    await stringAttr("paths", "icon");
    await stringAttr("paths", "gradient");
    await arrAttr("paths", "topics");
    await sleep(500);

    results.push("--- courses ---");
    await stringAttr("courses", "slug");
    await stringAttr("courses", "pathSlug");
    await stringAttr("courses", "title");
    await stringAttr("courses", "description", 1000);
    await intAttr("courses", "lessons");
    await intAttr("courses", "hours");
    await intAttr("courses", "xp");
    await boolAttr("courses", "locked", false, false);
    await arrAttr("courses", "skills");
    await sleep(500);

    results.push("--- community_posts ---");
    await stringAttr("community_posts", "authorName");
    await stringAttr("community_posts", "authorRole", 128, false, "Student");
    await stringAttr("community_posts", "content", 2000);
    await stringAttr("community_posts", "space");
    await intAttr("community_posts", "likes", false, 0);
    await sleep(500);

    results.push("--- mock_tests ---");
    await stringAttr("mock_tests", "title");
    await stringAttr("mock_tests", "category");
    await stringAttr("mock_tests", "difficulty");
    await intAttr("mock_tests", "questions");
    await intAttr("mock_tests", "duration");
    await intAttr("mock_tests", "xp");
    await stringAttr("mock_tests", "description", 1000, false);
    await boolAttr("mock_tests", "locked", false, false);
    await sleep(500);

    results.push("--- workshops ---");
    await stringAttr("workshops", "title");
    await stringAttr("workshops", "host");
    await stringAttr("workshops", "date");
    await stringAttr("workshops", "time");
    await stringAttr("workshops", "duration");
    await stringAttr("workshops", "level");
    await stringAttr("workshops", "description", 1000, false);
    await boolAttr("workshops", "registered", false, false);
    await intAttr("workshops", "spots", false, 0);
    await sleep(500);

    results.push("--- certificates ---");
    await stringAttr("certificates", "userId");
    await stringAttr("certificates", "courseTitle");
    await stringAttr("certificates", "pathTitle");
    await stringAttr("certificates", "issuedDate");
    await intAttr("certificates", "score", false, 0);
    await sleep(2000);

    // ─── 4. SEED DATA ────────────────────────────────────────────
    results.push("=== SEEDING DATA ===");

    // ─── Paths ───────────────────────────────────────────────────
    const paths = [
      {
        slug: "academic-english",
        title: "Academic English Mastery",
        description: "Target elite verbal reasoning logic, academic syntax, writing templates, and vocabulary for GRE, GMAT, IELTS, and Corporate English.",
        modules: 5, hours: 40, students: 1892, rating: 4.9,
        icon: "GraduationCap",
        gradient: "from-violet-600 to-purple-700",
        topics: ["GRE Verbal", "GMAT Verbal", "IELTS Academic", "Corporate English", "Analytical Writing"],
      },
      {
        slug: "data-analytics",
        title: "Data Analytics & Excel",
        description: "Master Excel, Power BI, SQL and Python for data-driven decision making in finance and consulting roles.",
        modules: 6, hours: 52, students: 1450, rating: 4.8,
        icon: "BarChart3",
        gradient: "from-emerald-600 to-teal-700",
        topics: ["Excel Advanced", "Power BI", "SQL Basics", "Python Analytics", "Data Visualization"],
      },
      {
        slug: "corporate-finance",
        title: "Corporate Finance & CFA Prep",
        description: "Build a strong foundation in corporate finance, valuation, and investment analysis aligned with CFA Level 1.",
        modules: 7, hours: 60, students: 980, rating: 4.9,
        icon: "TrendingUp",
        gradient: "from-blue-600 to-indigo-700",
        topics: ["Financial Statements", "DCF Valuation", "Fixed Income", "Equity", "Ethics"],
      },
      {
        slug: "gmat-prep",
        title: "GMAT Complete Prep",
        description: "Comprehensive GMAT preparation covering Quant, Verbal, Data Insights and AWA with adaptive practice.",
        modules: 8, hours: 72, students: 2300, rating: 4.7,
        icon: "Brain",
        gradient: "from-rose-600 to-pink-700",
        topics: ["Quant", "Verbal", "Data Insights", "AWA", "Integrated Reasoning"],
      },
      {
        slug: "career-readiness",
        title: "Career Readiness & Interviews",
        description: "Land your dream corporate role with interview prep, CV writing, case studies and networking strategies.",
        modules: 4, hours: 28, students: 1620, rating: 4.8,
        icon: "Briefcase",
        gradient: "from-amber-600 to-orange-700",
        topics: ["CV Writing", "Case Interviews", "Behavioral", "Networking", "Salary Negotiation"],
      },
    ];
 
    for (const path of paths) {
      try {
        const existing = await db.listDocuments(DB_ID, "paths", [Query.equal("slug", path.slug)]);
        if (existing.documents.length > 0) {
          await db.updateDocument(DB_ID, "paths", existing.documents[0].$id, path);
          results.push(`  🔄 Updated Path: ${path.title}`);
        } else {
          await db.createDocument(DB_ID, "paths", "unique()", path);
          results.push(`  ✅ Created Path: ${path.title}`);
        }
      } catch (e: any) {
        results.push(`  ❌ Path ${path.title}: ${e.message}`);
      }
    }
 
    // ─── Courses ─────────────────────────────────────────────────
    const courses = [
      // Academic English
      { slug: "verbal-reasoning", pathSlug: "academic-english", title: "Verbal Reasoning & Logical Structures", description: "Master sentence context, logical pivots, synonyms, and inference logic for GRE and GMAT.", lessons: 12, hours: 8, xp: 300, locked: false, skills: ["Verbal Logic", "Inference", "Critical Reading"] },
      { slug: "academic-writing", pathSlug: "academic-english", title: "Academic Writing & AWA Essays", description: "Draft structured essays, outline logical arguments, and check cohesion for AWA.", lessons: 10, hours: 7, xp: 280, locked: false, skills: ["Essay Writing", "Argument Analysis", "AWA Templates"] },
      { slug: "gre-vocabulary", pathSlug: "academic-english", title: "GRE/GMAT Vocabulary Mastery", description: "Learn 1200+ high-frequency words through spaced repetition and contextual usage.", lessons: 15, hours: 10, xp: 350, locked: false, skills: ["Vocabulary", "Context Clues", "Word Roots"] },
      { slug: "ielts-academic", pathSlug: "academic-english", title: "IELTS Academic Band 7+", description: "Reading, Writing, Listening strategies to achieve Band 7+ in IELTS Academic.", lessons: 14, hours: 9, xp: 320, locked: true, skills: ["IELTS Reading", "IELTS Writing", "Band Scoring"] },
      { slug: "corporate-english", pathSlug: "academic-english", title: "Corporate English Communication", description: "Professional emails, presentations, and negotiation language for the workplace.", lessons: 8, hours: 6, xp: 250, locked: true, skills: ["Business Writing", "Presentations", "Negotiation"] },
 
      // Data Analytics
      { slug: "excel-advanced", pathSlug: "data-analytics", title: "Excel Advanced Formulas & Pivot", description: "VLOOKUP, INDEX-MATCH, pivot tables, dashboards and automation with macros.", lessons: 16, hours: 10, xp: 400, locked: false, skills: ["VLOOKUP", "Pivot Tables", "Dashboard Design"] },
      { slug: "power-bi", pathSlug: "data-analytics", title: "Power BI for Business Intelligence", description: "Build interactive BI dashboards connecting to Excel, SQL and web sources.", lessons: 14, hours: 10, xp: 380, locked: false, skills: ["Power BI", "DAX", "Data Modeling"] },
      { slug: "sql-fundamentals", pathSlug: "data-analytics", title: "SQL for Data Analysis", description: "Query databases, join tables and aggregate data using SQL for business analytics.", lessons: 12, hours: 8, xp: 320, locked: false, skills: ["SELECT", "JOINs", "Aggregation"] },
      { slug: "python-analytics", pathSlug: "data-analytics", title: "Python for Data Analytics", description: "Use pandas, matplotlib and seaborn to analyze and visualize business data.", lessons: 18, hours: 14, xp: 450, locked: true, skills: ["Pandas", "Matplotlib", "Data Cleaning"] },
      { slug: "data-visualization", pathSlug: "data-analytics", title: "Data Visualization & Storytelling", description: "Design charts and dashboards that communicate insights to stakeholders.", lessons: 10, hours: 7, xp: 280, locked: true, skills: ["Chart Design", "Storytelling", "Canva/Figma"] },
      { slug: "financial-modelling", pathSlug: "data-analytics", title: "Financial Modelling in Excel", description: "Build 3-statement models, DCF, and LBO models used in investment banking.", lessons: 12, hours: 10, xp: 380, locked: true, skills: ["3-Statement Model", "DCF", "Scenario Analysis"] },
 
      // Corporate Finance
      { slug: "financial-statements", pathSlug: "corporate-finance", title: "Financial Statements Analysis", description: "Read and interpret income statements, balance sheets and cash flow statements.", lessons: 10, hours: 7, xp: 300, locked: false, skills: ["Income Statement", "Balance Sheet", "Cash Flow"] },
      { slug: "dcf-valuation", pathSlug: "corporate-finance", title: "DCF Valuation & Business Valuation", description: "Build discounted cash flow models, WACC calculations and sensitivity analysis.", lessons: 12, hours: 9, xp: 350, locked: false, skills: ["DCF", "WACC", "Terminal Value"] },
      { slug: "fixed-income", pathSlug: "corporate-finance", title: "Fixed Income & Bonds", description: "Bond pricing, duration, yield curves and credit analysis for the CFA exam.", lessons: 10, hours: 8, xp: 300, locked: true, skills: ["Bond Pricing", "Duration", "Yield Curves"] },
      { slug: "equity-analysis", pathSlug: "corporate-finance", title: "Equity Research & Stock Analysis", description: "Comparable company analysis, precedent transactions and equity research reports.", lessons: 12, hours: 9, xp: 350, locked: true, skills: ["Comps", "Equity Research", "P/E Ratios"] },
      { slug: "portfolio-management", pathSlug: "corporate-finance", title: "Portfolio Management & Risk", description: "Modern Portfolio Theory, CAPM, Sharpe ratio and asset allocation strategies.", lessons: 10, hours: 8, xp: 320, locked: true, skills: ["MPT", "CAPM", "Risk Management"] },
 
      // GMAT
      { slug: "gmat-quant", pathSlug: "gmat-prep", title: "GMAT Quantitative Reasoning", description: "Problem solving and data sufficiency for GMAT Quant from Q40 to Q51.", lessons: 20, hours: 16, xp: 500, locked: false, skills: ["Problem Solving", "Data Sufficiency", "Number Properties"] },
      { slug: "gmat-verbal", pathSlug: "gmat-prep", title: "GMAT Verbal: CR, SC, RC", description: "Critical Reasoning, Sentence Correction, and Reading Comprehension mastery.", lessons: 18, hours: 14, xp: 450, locked: false, skills: ["Critical Reasoning", "Sentence Correction", "RC"] },
      { slug: "gmat-data-insights", pathSlug: "gmat-prep", title: "Data Insights (DI) Section", description: "Master the new DI section including Multi-Source Reasoning and Table Analysis.", lessons: 10, hours: 8, xp: 300, locked: false, skills: ["Data Sufficiency", "Multi-Source Reasoning", "Graphics"] },
      { slug: "gmat-awa", pathSlug: "gmat-prep", title: "AWA Essay Writing", description: "Score 5+ on the AWA with structured templates and argument analysis practice.", lessons: 8, hours: 5, xp: 200, locked: true, skills: ["Essay Templates", "Argument Analysis", "Transitions"] },
 
      // Career
      { slug: "cv-linkedin", pathSlug: "career-readiness", title: "CV, Cover Letter & LinkedIn", description: "Craft ATS-optimized CVs and compelling cover letters that get shortlisted.", lessons: 8, hours: 5, xp: 200, locked: false, skills: ["CV Writing", "LinkedIn SEO", "Cover Letter"] },
      { slug: "case-interviews", pathSlug: "career-readiness", title: "Case Interview Masterclass", description: "Crack McKinsey, BCG, Bain case interviews with structured frameworks.", lessons: 14, hours: 10, xp: 380, locked: false, skills: ["Case Frameworks", "MECE", "Presentation"] },
      { slug: "behavioral-interviews", pathSlug: "career-readiness", title: "Behavioral & HR Interviews", description: "STAR method answers for leadership, teamwork, failure and conflict questions.", lessons: 10, hours: 6, xp: 250, locked: true, skills: ["STAR Method", "Leadership", "Conflict Resolution"] },
      { slug: "networking-strategy", pathSlug: "career-readiness", title: "Networking & Personal Branding", description: "Build a professional network, cold email templates and negotiation playbooks.", lessons: 8, hours: 5, xp: 200, locked: true, skills: ["Cold Outreach", "Informational Interviews", "Salary Negotiation"] },
    ];
 
    for (const course of courses) {
      try {
        const existing = await db.listDocuments(DB_ID, "courses", [Query.equal("slug", course.slug)]);
        if (existing.documents.length > 0) {
          await db.updateDocument(DB_ID, "courses", existing.documents[0].$id, course);
          results.push(`  🔄 Updated Course: ${course.title}`);
        } else {
          await db.createDocument(DB_ID, "courses", "unique()", course);
          results.push(`  ✅ Created Course: ${course.title}`);
        }
      } catch (e: any) {
        results.push(`  ❌ Course ${course.title}: ${e.message}`);
      }
    }
 
    // ─── Tasks ───────────────────────────────────────────────────
    const tasks = [
      { title: "Complete 1 Verbal Reasoning lesson", xp: 50, category: "learning" },
      { title: "Practice 20 GRE Vocabulary words", xp: 30, category: "learning" },
      { title: "Take an Excel Mock Test", xp: 100, category: "test" },
      { title: "Post in the Community Forum", xp: 20, category: "social" },
      { title: "Watch 1 GMAT Quant video", xp: 40, category: "learning" },
    ];
    for (const task of tasks) {
      try {
        const existing = await db.listDocuments(DB_ID, "tasks", [Query.equal("title", task.title)]);
        if (existing.documents.length > 0) {
          await db.updateDocument(DB_ID, "tasks", existing.documents[0].$id, task);
          results.push(`  🔄 Updated Task: ${task.title}`);
        } else {
          await db.createDocument(DB_ID, "tasks", "unique()", task);
          results.push(`  ✅ Created Task: ${task.title}`);
        }
      } catch (e: any) {
        results.push(`  ❌ Task ${task.title}: ${e.message}`);
      }
    }
 
    // ─── Events ──────────────────────────────────────────────────
    const events = [
      { title: "Excel Workshop — BAUBC Chapter", date: "Jul 18", time: "3:00 PM", type: "Workshop", location: "Zoom", description: "Live Excel session covering VLOOKUP, Pivot Tables and dashboard design." },
      { title: "Mock Test Marathon", date: "Jul 20", time: "10:00 AM", type: "Competition", location: "Online", description: "Compete against peers across 3 mock tests in one session. Top 3 win prizes." },
      { title: "GMAT Study Group", date: "Jul 22", time: "7:00 PM", type: "Study Session", location: "Discord", description: "Community-led GMAT Quant problem-solving session." },
      { title: "Career Panel: IBA Alumni", date: "Jul 25", time: "5:00 PM", type: "Webinar", location: "Zoom", description: "IBA alumni from McKinsey, Unilever and Standard Chartered share their journeys." },
      { title: "AWA Essay Review Session", date: "Aug 01", time: "6:00 PM", type: "Workshop", location: "Google Meet", description: "Submit your AWA essays for expert feedback and improvement tips." },
    ];
    for (const ev of events) {
      try {
        const existing = await db.listDocuments(DB_ID, "events", [Query.equal("title", ev.title)]);
        if (existing.documents.length > 0) {
          await db.updateDocument(DB_ID, "events", existing.documents[0].$id, ev);
          results.push(`  🔄 Updated Event: ${ev.title}`);
        } else {
          await db.createDocument(DB_ID, "events", "unique()", ev);
          results.push(`  ✅ Created Event: ${ev.title}`);
        }
      } catch (e: any) {
        results.push(`  ❌ Event ${ev.title}: ${e.message}`);
      }
    }
 
    // ─── Mock Tests ──────────────────────────────────────────────
    const mockTests = [
      { title: "GRE Verbal Reasoning — Set A", category: "GRE", difficulty: "Medium", questions: 40, duration: 60, xp: 200, description: "Text Completion, Sentence Equivalence and Reading Comprehension.", locked: false },
      { title: "GMAT Quantitative — Full Section", category: "GMAT", difficulty: "Hard", questions: 31, duration: 62, xp: 250, description: "Problem Solving and Data Sufficiency questions at GMAT difficulty.", locked: false },
      { title: "GMAT Verbal — Full Section", category: "GMAT", difficulty: "Hard", questions: 36, duration: 65, xp: 250, description: "Critical Reasoning, Reading Comprehension and Sentence Correction.", locked: false },
      { title: "Excel Aptitude Test — Banking", category: "Excel", difficulty: "Medium", questions: 30, duration: 45, xp: 180, description: "Applied Excel questions for banking and finance interviews.", locked: false },
      { title: "GMAT Data Insights — Full Section", category: "GMAT", difficulty: "Hard", questions: 20, duration: 45, xp: 200, description: "Multi-Source Reasoning, Table Analysis, and Graphics Interpretation.", locked: true },
      { title: "Corporate Finance Fundamentals", category: "Finance", difficulty: "Medium", questions: 50, duration: 75, xp: 300, description: "Financial statements, DCF, ratios and investment analysis.", locked: true },
      { title: "GRE Quantitative Reasoning — Set A", category: "GRE", difficulty: "Medium", questions: 40, duration: 70, xp: 200, description: "Arithmetic, Algebra, Geometry and Data Analysis for GRE.", locked: true },
      { title: "IELTS Academic Reading Mock", category: "IELTS", difficulty: "Medium", questions: 40, duration: 60, xp: 200, description: "Full IELTS Academic Reading paper with answer explanations.", locked: true },
    ];
    for (const test of mockTests) {
      try {
        const existing = await db.listDocuments(DB_ID, "mock_tests", [Query.equal("title", test.title)]);
        if (existing.documents.length > 0) {
          await db.updateDocument(DB_ID, "mock_tests", existing.documents[0].$id, test);
          results.push(`  🔄 Updated Mock Test: ${test.title}`);
        } else {
          await db.createDocument(DB_ID, "mock_tests", "unique()", test);
          results.push(`  ✅ Created Mock Test: ${test.title}`);
        }
      } catch (e: any) {
        results.push(`  ❌ Mock Test ${test.title}: ${e.message}`);
      }
    }
 
    // ─── Workshops ───────────────────────────────────────────────
    const workshops = [
      { title: "Excel for Finance Professionals", host: "Shadman Sakib, CFA", date: "Jul 18, 2025", time: "3:00 PM", duration: "2 hours", level: "Intermediate", description: "VLOOKUP, Pivot Tables, financial model templates and live Q&A.", registered: false, spots: 40 },
      { title: "GMAT 700+ Strategy Session", host: "Rasha Binte Karim", date: "Jul 22, 2025", time: "5:00 PM", duration: "1.5 hours", level: "Advanced", description: "Quant shortcuts, Verbal pacing strategies and official prep resources.", registered: false, spots: 25 },
      { title: "Case Interview Bootcamp", host: "Tahmid Farhan, McKinsey", date: "Jul 26, 2025", time: "4:00 PM", duration: "3 hours", level: "All Levels", description: "Live case cracking with frameworks, feedback and practice pairs.", registered: false, spots: 20 },
      { title: "Power BI Dashboard Design", host: "Nusrat Jahan", date: "Aug 02, 2025", time: "6:00 PM", duration: "2 hours", level: "Beginner", description: "Build your first interactive Power BI dashboard from scratch.", registered: false, spots: 50 },
      { title: "AWA Masterclass: Score 5+", host: "Dr. Arif Rahman", date: "Aug 08, 2025", time: "7:00 PM", duration: "1.5 hours", level: "Intermediate", description: "Templates, transitions, sample essays and timed practice for AWA.", registered: false, spots: 30 },
    ];
    for (const ws of workshops) {
      try {
        const existing = await db.listDocuments(DB_ID, "workshops", [Query.equal("title", ws.title)]);
        if (existing.documents.length > 0) {
          await db.updateDocument(DB_ID, "workshops", existing.documents[0].$id, ws);
          results.push(`  🔄 Updated Workshop: ${ws.title}`);
        } else {
          await db.createDocument(DB_ID, "workshops", "unique()", ws);
          results.push(`  ✅ Created Workshop: ${ws.title}`);
        }
      } catch (e: any) {
        results.push(`  ❌ Workshop ${ws.title}: ${e.message}`);
      }
    }
 
    // ─── Community Posts ─────────────────────────────────────────
    const communityPosts = [
      { authorName: "Farhan Ahmed", authorRole: "GMAT 720 Scorer", content: "Just scored 720 on GMAT after 3 months on INSYT! The Data Insights module was 🔥. The practice questions are almost identical to the real exam. Huge thanks to the community!", space: "GMAT", likes: 47 },
      { authorName: "Nusrat Jahan", authorRole: "Excel Enthusiast", content: "Pro tip: Use XLOOKUP instead of VLOOKUP for banking model templates — it handles left lookups and returns arrays natively. Here's a quick formula: =XLOOKUP(A2, data!A:A, data!B:B, \"Not Found\")", space: "Excel", likes: 38 },
      { authorName: "Rafiul Islam", authorRole: "IBA MBA Aspirant", content: "For GRE Verbal — the biggest hack is learning word roots. Once you know 'bene' means good, you can figure out benevolent, benefactor, beneficent without memorizing them separately. Works for 60% of GRE words!", space: "GRE", likes: 31 },
      { authorName: "Sabrina Islam", authorRole: "Finance Student", content: "Anyone else finding the DCF module incredibly practical? I built a full 3-statement model for a BD telecom company as a class project and my professor was impressed. The Excel templates here are industry-grade.", space: "Excel", likes: 25 },
      { authorName: "Mehedi Hasan", authorRole: "Data Analyst Trainee", content: "Power BI tip: Use the RANKX function in DAX to create dynamic rankings that update automatically when your data refreshes. Game-changer for monthly sales reports!", space: "Power BI", likes: 19 },
    ];
    for (const post of communityPosts) {
      try {
        const existing = await db.listDocuments(DB_ID, "community_posts", [Query.equal("authorName", post.authorName)]);
        if (existing.documents.length > 0) {
          await db.updateDocument(DB_ID, "community_posts", existing.documents[0].$id, post);
          results.push(`  🔄 Updated Post by: ${post.authorName}`);
        } else {
          await db.createDocument(DB_ID, "community_posts", "unique()", post);
          results.push(`  ✅ Created Post by: ${post.authorName}`);
        }
      } catch (e: any) {
        results.push(`  ❌ Post ${post.authorName}: ${e.message}`);
      }
    }
 
    results.push("=== SETUP COMPLETE ===");
    return NextResponse.json({ success: true, results });

  } catch (error: any) {
    console.error("Setup Error:", error);
    return NextResponse.json({ error: error.message, results }, { status: 500 });
  }
}
