import { NextResponse } from "next/server";
import { Client, Databases } from "node-appwrite";

// Note: Ensure APPWRITE_API_KEY has sufficient scopes: collections.write, documents.write, databases.read
export async function POST(req: Request) {
  try {
    const adminSecret = req.headers.get("x-admin-secret");
    const expectedSecret = process.env.ADMIN_SECRET_KEY;

    if (!expectedSecret || adminSecret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized access to database seed endpoint" }, { status: 401 });
    }

    const reqBody = await req.json().catch(() => ({}));
    const apiKey = reqBody.apiKey || process.env.APPWRITE_API_KEY;
    const projectId = reqBody.projectId || process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "6a55c66500032e142d85";
    const endpoint = reqBody.endpoint || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
    const databaseId = reqBody.databaseId || "6a56075800013fce1aa1";

    if (!apiKey) {
      return NextResponse.json({ error: "API Key required for seed endpoint" }, { status: 400 });
    }

    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey);

    const databases = new Databases(client);

    const collections = [
      { id: "profiles", name: "Profiles" },
      { id: "tasks", name: "Tasks" },
      { id: "events", name: "Events" },
      { id: "paths", name: "Paths" },
      { id: "courses", name: "Courses" },
    ];

    const results = [];

    // Create Collections (this might throw if they already exist, we will catch and ignore)
    for (const coll of collections) {
      try {
        await databases.createCollection(databaseId, coll.id, coll.name);
        results.push(`Created collection: ${coll.name}`);
      } catch (err: any) {
        if (err.code === 409) {
          results.push(`Collection exists: ${coll.name}`);
        } else {
          results.push(`Failed to create ${coll.name}: ${err.message}`);
        }
      }
    }

    // Delay to let Appwrite process the collection creation before adding attributes
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create Attributes
    const attrs = [
      // Profiles
      { type: "string", coll: "profiles", key: "name", req: true, max: 255 },
      { type: "integer", coll: "profiles", key: "xp", req: true },
      { type: "integer", coll: "profiles", key: "level", req: true },
      { type: "integer", coll: "profiles", key: "streak", req: true },
      { type: "string", coll: "profiles", key: "email", req: true, max: 255 },

      // Tasks
      { type: "string", coll: "tasks", key: "title", req: true, max: 255 },
      { type: "integer", coll: "tasks", key: "xp", req: true },

      // Events
      { type: "string", coll: "events", key: "title", req: true, max: 255 },
      { type: "string", coll: "events", key: "date", req: true, max: 255 },
      { type: "string", coll: "events", key: "time", req: true, max: 255 },
      { type: "string", coll: "events", key: "type", req: true, max: 255 },

      // Paths
      { type: "string", coll: "paths", key: "slug", req: true, max: 255 },
      { type: "string", coll: "paths", key: "title", req: true, max: 255 },
      { type: "string", coll: "paths", key: "description", req: true, max: 1000 },
      { type: "integer", coll: "paths", key: "modules", req: true },
      { type: "integer", coll: "paths", key: "hours", req: true },
      { type: "integer", coll: "paths", key: "students", req: true },
      { type: "float", coll: "paths", key: "rating", req: true },
      { type: "string", coll: "paths", key: "icon", req: true, max: 255 },
      { type: "string", coll: "paths", key: "gradient", req: true, max: 255 },
      { type: "stringArray", coll: "paths", key: "topics", req: true },

      // Courses
      { type: "string", coll: "courses", key: "slug", req: true, max: 255 },
      { type: "string", coll: "courses", key: "pathSlug", req: true, max: 255 },
      { type: "string", coll: "courses", key: "title", req: true, max: 255 },
      { type: "string", coll: "courses", key: "description", req: true, max: 1000 },
      { type: "integer", coll: "courses", key: "lessons", req: true },
      { type: "integer", coll: "courses", key: "hours", req: true },
      { type: "integer", coll: "courses", key: "xp", req: true },
      { type: "boolean", coll: "courses", key: "locked", req: true },
      { type: "stringArray", coll: "courses", key: "skills", req: true },
    ];

    for (const attr of attrs) {
      try {
        if (attr.type === "string") {
          await databases.createStringAttribute(databaseId, attr.coll, attr.key, attr.max!, attr.req);
        } else if (attr.type === "integer") {
          await databases.createIntegerAttribute(databaseId, attr.coll, attr.key, attr.req);
        } else if (attr.type === "float") {
          await databases.createFloatAttribute(databaseId, attr.coll, attr.key, attr.req);
        } else if (attr.type === "boolean") {
          await databases.createBooleanAttribute(databaseId, attr.coll, attr.key, attr.req);
        } else if (attr.type === "stringArray") {
          await databases.createStringAttribute(databaseId, attr.coll, attr.key, 255, attr.req, undefined, true);
        }
        results.push(`Created attribute: ${attr.coll}.${attr.key}`);
      } catch (err: any) {
        if (err.code === 409) {
          results.push(`Attribute exists: ${attr.coll}.${attr.key}`);
        } else {
          results.push(`Failed to create attr ${attr.coll}.${attr.key}: ${err.message}`);
        }
      }
    }

    // Delay again for attributes to propagate
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Seed Data
    const seedPaths = [
      {
        slug: "corporate-mto",
        title: "Corporate Job / MTO Masterclass",
        description: "Crack Management Trainee assessments, refine your CV for ATS screening, and master behavioral, technical, and consulting case interviews.",
        modules: 4, hours: 23, students: 52100, rating: 5.0,
        icon: "Briefcase", gradient: "from-blue-600 to-indigo-800",
        topics: ["SHL Tests", "Psychometric", "Situational Judgment", "ATS CV", "STAR Method"],
      }
    ];

    for (const path of seedPaths) {
      try {
        await databases.createDocument(databaseId, "paths", "unique()", path);
        results.push(`Seeded path: ${path.title}`);
      } catch (err: any) {
        results.push(`Failed to seed path ${path.title}: ${err.message}`);
      }
    }

    const seedCourses = [
      {
        slug: "recruit-assessments",
        pathSlug: "corporate-mto",
        title: "Application Strategy & Assessment Tests",
        description: "SHL numerical reasoning, situational judgment tests (SJT), and employer expectations for top MNC recruitment drives.",
        lessons: 8, hours: 6, xp: 350, locked: false,
        skills: ["SHL Tests", "Psychometric", "Situational Judgment", "ATS CV"],
      },
      {
        slug: "recruit-behavioral",
        pathSlug: "corporate-mto",
        title: "Behavioral & HR Interview Mastery",
        description: "STAR framework storytelling, CAR structures, and templates for answering tough behavioral questions.",
        lessons: 7, hours: 5, xp: 350, locked: false,
        skills: ["STAR Method", "HR Interviews", "Behavioral Q&A"],
      }
    ];

    for (const course of seedCourses) {
      try {
        await databases.createDocument(databaseId, "courses", "unique()", course);
        results.push(`Seeded course: ${course.title}`);
      } catch (err: any) {
        results.push(`Failed to seed course ${course.title}: ${err.message}`);
      }
    }

    // Seed initial Tasks & Events
    const seedTasks = [
      { title: "Complete Banking Module 3 Quiz", xp: 50 },
      { title: "Practice Excel Shortcuts Drill", xp: 30 },
      { title: "Take a Mock Test (Banking)", xp: 100 },
    ];
    for (const task of seedTasks) {
      try {
        await databases.createDocument(databaseId, "tasks", "unique()", task);
      } catch (err) {}
    }

    const seedEvents = [
      { title: "Excel Workshop — BAUBC", date: "Jul 18", time: "3:00 PM", type: "Workshop" },
      { title: "Mock Test Marathon", date: "Jul 20", time: "10:00 AM", type: "Competition" },
    ];
    for (const ev of seedEvents) {
      try {
        await databases.createDocument(databaseId, "events", "unique()", ev);
      } catch (err) {}
    }

    results.push("Seeded mock tasks and events.");

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
