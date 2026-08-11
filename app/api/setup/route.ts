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
    await stringAttr("certificates", "courseTitle");    // ─── Paths ───────────────────────────────────────────────────
    const paths = [
      {
        slug: "academic-english",
        title: "Academic & Business English Mastery",
        description: "Target elite verbal reasoning logic, academic syntax, writing templates, and vocabulary for Corporate English.",
        modules: 5, hours: 40, students: 1892, rating: 4.9,
        icon: "GraduationCap",
        gradient: "from-violet-600 to-purple-700",
        topics: ["Corporate English", "Analytical Writing", "Business Presentations", "Cold Outreach"],
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
        slug: "business-comm",
        title: "Business Communication & Slide Pitching",
        description: "Comprehensive corporate communication preparation covering McKinsey slide layouts, memo writing, and cold email outreach.",
        modules: 8, hours: 40, students: 2300, rating: 4.8,
        icon: "Presentation",
        gradient: "from-rose-600 to-pink-700",
        topics: ["PowerPoint Design", "Executive Summaries", "Cold Emailing", "Slide Pitching"],
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
      { slug: "verbal-reasoning", pathSlug: "academic-english", title: "Verbal Reasoning & Logical Structures", description: "Master sentence context, logical pivots, synonyms, and inference logic for Corporate English.", lessons: 12, hours: 8, xp: 300, locked: false, skills: ["Verbal Logic", "Inference", "Critical Reading"] },
      { slug: "academic-writing", pathSlug: "academic-english", title: "Academic Writing & Executive Essays", description: "Draft structured essays, outline logical arguments, and check cohesion.", lessons: 10, hours: 7, xp: 280, locked: false, skills: ["Essay Writing", "Argument Analysis", "Executive Templates"] },
      { slug: "corporate-english", pathSlug: "academic-english", title: "Corporate English Communication", description: "Professional emails, presentations, and negotiation language for the workplace.", lessons: 8, hours: 6, xp: 250, locked: true, skills: ["Business Writing", "Presentations", "Negotiation"] },

      // Data Analytics
      { slug: "excel-advanced", pathSlug: "data-analytics", title: "Excel Advanced Formulas & Pivot", description: "VLOOKUP, INDEX-MATCH, pivot tables, dashboards and automation with macros.", lessons: 16, hours: 10, xp: 400, locked: false, skills: ["VLOOKUP", "Pivot Tables", "Dashboard Design"] },
      { slug: "power-bi", pathSlug: "data-analytics", title: "Power BI for Business Intelligence", description: "Build interactive BI dashboards connecting to Excel, SQL and web sources.", lessons: 14, hours: 10, xp: 380, locked: false, skills: ["Power BI", "DAX", "Data Modeling"] },
      { slug: "sql-fundamentals", pathSlug: "data-analytics", title: "SQL for Data Analysis", description: "Query databases, join tables and aggregate data using SQL for business analytics.", lessons: 12, hours: 8, xp: 320, locked: false, skills: ["SELECT", "JOINs", "Aggregation"] },

      // Corporate Finance
      { slug: "financial-statements", pathSlug: "corporate-finance", title: "Financial Statements Analysis", description: "Read and interpret income statements, balance sheets and cash flow statements.", lessons: 10, hours: 7, xp: 300, locked: false, skills: ["Income Statement", "Balance Sheet", "Cash Flow"] },
      { slug: "dcf-valuation", pathSlug: "corporate-finance", title: "DCF Valuation & Business Valuation", description: "Build discounted cash flow models, WACC calculations and sensitivity analysis.", lessons: 12, hours: 9, xp: 350, locked: false, skills: ["DCF", "WACC", "Terminal Value"] },

      // Career
      { slug: "cv-linkedin", pathSlug: "career-readiness", title: "CV, Cover Letter & LinkedIn", description: "Craft ATS-optimized CVs and compelling cover letters that get shortlisted.", lessons: 8, hours: 5, xp: 200, locked: false, skills: ["CV Writing", "LinkedIn SEO", "Cover Letter"] },
      { slug: "case-interviews", pathSlug: "career-readiness", title: "Case Interview Masterclass", description: "Crack McKinsey, BCG, Bain case interviews with structured frameworks.", lessons: 14, hours: 10, xp: 380, locked: false, skills: ["Case Frameworks", "MECE", "Presentation"] },
      { slug: "behavioral-interviews", pathSlug: "career-readiness", title: "Behavioral & HR Interviews", description: "STAR method answers for leadership, teamwork, failure and conflict questions.", lessons: 10, hours: 6, xp: 250, locked: true, skills: ["STAR Method", "Leadership", "Conflict Resolution"] },
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
      { title: "Take an Excel Mock Test", xp: 100, category: "test" },
      { title: "Post in the Community Forum", xp: 20, category: "social" },
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
      { title: "Career Panel: IBA Alumni", date: "Jul 25", time: "5:00 PM", type: "Webinar", location: "Zoom", description: "IBA alumni from McKinsey, Unilever and Standard Chartered share their journeys." },
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
      { title: "Bangladesh Bank AD Full Length Mock Test", category: "Banking", difficulty: "Advanced", questions: 30, duration: 60, xp: 250, description: "Monetary policy, CRR/SLR regulations, and financial economics.", locked: false },
      { title: "Corporate Management Trainee (MTO) Cognitive Test", category: "Corporate", difficulty: "Advanced", questions: 30, duration: 45, xp: 300, description: "Numerical reasoning, logical deduction, and case analytics.", locked: false },
      { title: "Excel Aptitude Test — Banking", category: "Excel", difficulty: "Medium", questions: 30, duration: 45, xp: 180, description: "Applied Excel questions for banking and finance interviews.", locked: false },
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
      { title: "Case Interview Bootcamp", host: "Tahmid Farhan, McKinsey", date: "Jul 26, 2025", time: "4:00 PM", duration: "3 hours", level: "All Levels", description: "Live case cracking with frameworks, feedback and practice pairs.", registered: false, spots: 20 },
      { title: "Power BI Dashboard Design", host: "Nusrat Jahan", date: "Aug 02, 2025", time: "6:00 PM", duration: "2 hours", level: "Beginner", description: "Build your first interactive Power BI dashboard from scratch.", registered: false, spots: 50 },
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
      { authorName: "Farhan Ahmed", authorRole: "Unilever MTO Officer", content: "Just cleared the Unilever Assessment Center after 3 months on INSYT! The STAR interview framework & case study modules were 🔥. Huge thanks to the community!", space: "Corporate", likes: 47 },
      { authorName: "Nusrat Jahan", authorRole: "Excel Enthusiast", content: "Pro tip: Use XLOOKUP instead of VLOOKUP for banking model templates — it handles left lookups and returns arrays natively. Here's a quick formula: =XLOOKUP(A2, data!A:A, data!B:B, \"Not Found\")", space: "Excel", likes: 38 },
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
