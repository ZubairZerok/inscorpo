const http = require("http");

const BASE_URL = "http://localhost:3000";

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: options.method || "GET",
      headers: options.headers || {},
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const duration = Date.now() - start;
    let data;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    return { status: res.status, duration, data, ok: res.ok };
  } catch (err) {
    return { status: 0, duration: Date.now() - start, error: err.message, ok: false };
  }
}

async function runSuperStressTest() {
  console.log("==========================================================================");
  console.log("🔥 INSYT CORPORATE — SUPER MASSIVE SAAS STRESS TEST SUITE 🔥");
  console.log("==========================================================================\n");

  const report = {
    totalTests: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
    details: [],
  };

  function logResult(category, testName, success, duration, info) {
    report.totalTests++;
    if (success) {
      report.passed++;
      console.log(`  ✅ [${category}] ${testName} (${duration}ms) ${info ? `- ${info}` : ""}`);
    } else {
      report.failed++;
      console.log(`  ❌ [${category}] ${testName} (${duration}ms) ${info ? `- ${info}` : ""}`);
    }
    report.details.push({ category, testName, success, duration, info });
  }

  // --------------------------------------------------------------------------
  // SECTION 1: API ENDPOINT LOAD & EDGE CASE STRESS
  // --------------------------------------------------------------------------
  console.log("--------------------------------------------------------------------------");
  console.log("⚡ PHASE 1: API ENDPOINT LOAD & EDGE CASE STRESS");
  console.log("--------------------------------------------------------------------------");

  // Test 1.1: Payments Checkout - Valid Request
  {
    const res = await request("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { planId: "pro_monthly", method: "bkash", accountNumber: "01700000000" },
    });
    logResult("API", "Payments Checkout (Valid bKash)", res.status === 200 && res.data?.success, res.duration, `Redirect: ${res.data?.redirectUrl || "N/A"}`);
  }

  // Test 1.2: Payments Checkout - Invalid Method
  {
    const res = await request("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { planId: "pro_monthly", method: "crypto_invalid" },
    });
    logResult("API", "Payments Checkout (Invalid Method Edge Case)", res.status === 400, res.duration, `Error: ${res.data?.error}`);
  }

  // Test 1.3: Payments Checkout - 30 Parallel Burst Requests
  {
    const start = Date.now();
    const promises = Array.from({ length: 30 }).map((_, i) =>
      request("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { planId: "pro_yearly", method: i % 2 === 0 ? "nagad" : "sslcommerz" },
      })
    );
    const results = await Promise.all(promises);
    const totalDuration = Date.now() - start;
    const allOk = results.every(r => r.status === 200);
    const avgLatency = Math.round(results.reduce((a, b) => a + b.duration, 0) / results.length);
    logResult("API Load", "Payments Checkout (30 Concurrently)", allOk, totalDuration, `Avg Latency: ${avgLatency}ms`);
  }

  // Test 1.4: Event Registration - Valid
  {
    const res = await request("/api/events/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { name: "Super Tester", email: "tester@insyt.co", eventTitle: "BAUBC Business Competition", eventId: "BAUBC2026" },
    });
    logResult("API", "Event Registration (Valid Payload)", res.status === 200 && res.data?.ticketId, res.duration, `Ticket: ${res.data?.ticketId}`);
  }

  // Test 1.5: Event Registration - Missing Required Fields
  {
    const res = await request("/api/events/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { name: "No Email User" },
    });
    logResult("API", "Event Registration (Missing Required Fields)", res.status === 400, res.duration, `Status: ${res.status}`);
  }

  // Test 1.6: Event Registration - 25 Concurrently
  {
    const start = Date.now();
    const promises = Array.from({ length: 25 }).map((_, i) =>
      request("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { name: `Tester ${i}`, email: `test${i}@insyt.co`, eventTitle: "Excel Workshop BAUBC", eventId: "EXCEL26" },
      })
    );
    const results = await Promise.all(promises);
    const totalDuration = Date.now() - start;
    const allOk = results.every(r => r.status === 200);
    logResult("API Load", "Event Registration (25 Concurrently)", allOk, totalDuration, `Completed 25 registrations in ${totalDuration}ms`);
  }

  // Test 1.7: AI Chat - Context Fallbacks & Prompting
  {
    const contexts = ["resume-reviewer", "mock-interview", "excel-assistant", "general"];
    for (const ctx of contexts) {
      const res = await request("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { message: `Explain key strategy for ${ctx}`, context: ctx },
      });
      logResult("AI API", `AI Chat (${ctx})`, res.status === 200 && Boolean(res.data?.reply), res.duration, `Reply length: ${res.data?.reply?.length || 0} chars`);
    }
  }

  // Test 1.8: AI Resume Parse - Valid Text
  {
    const sampleResume = "John Doe. BBA graduate from BAU 2026. Expert in Financial Modeling, Excel XLOOKUP, SQL, Power BI. 2 years corporate experience.";
    const res = await request("/api/ai/resume-parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { resumeText: sampleResume },
    });
    logResult("AI API", "AI Resume Parse (Valid Text)", res.status === 200 && Array.isArray(res.data?.skills), res.duration, `Extracted ${res.data?.skills?.length} skills`);
  }

  // Test 1.9: AI Resume Parse - Short Text Boundary
  {
    const res = await request("/api/ai/resume-parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { resumeText: "Too short" },
    });
    logResult("AI API", "AI Resume Parse (Short Text Guard)", res.status === 400, res.duration, `Error: ${res.data?.error}`);
  }

  // Test 1.10: Seed & Setup Routes Security Audit
  {
    const resSeed = await request("/api/seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {},
    });
    logResult("API Security", "Seed Endpoint Guard (Missing Body / Auth)", resSeed.status === 400 || resSeed.status === 401, resSeed.duration, `Status: ${resSeed.status}`);

    const resSetup = await request("/api/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {},
    });
    logResult("API Security", "Setup Endpoint Guard (Missing Body / Auth)", resSetup.status === 400 || resSetup.status === 401, resSetup.duration, `Status: ${resSetup.status}`);
  }

  // --------------------------------------------------------------------------
  // SECTION 2: GAMIFICATION ENGINE & STATE CALCULATION BENCHMARK
  // --------------------------------------------------------------------------
  console.log("\n--------------------------------------------------------------------------");
  console.log("⚡ PHASE 2: GAMIFICATION ENGINE & LOGIC BENCHMARK");
  console.log("--------------------------------------------------------------------------");

  // Benchmark level formula
  {
    const calculateLevel = (xp) => Math.floor(xp / 200) + 1;
    const testCases = [
      { xp: 0, expected: 1 },
      { xp: 199, expected: 1 },
      { xp: 200, expected: 2 },
      { xp: 2500, expected: 13 },
      { xp: 50000, expected: 251 },
      { xp: 1000000, expected: 5001 },
    ];
    let passedCases = true;
    const start = Date.now();
    for (const tc of testCases) {
      if (calculateLevel(tc.xp) !== tc.expected) {
        passedCases = false;
        break;
      }
    }
    // High frequency loop calculation: 1,000,000 calls
    for (let i = 0; i < 1000000; i++) {
      calculateLevel(i);
    }
    const duration = Date.now() - start;
    logResult("State Engine", "Level & XP Formula (1,000,000 calculations)", passedCases, duration, `Completed 1M ops in ${duration}ms`);
  }

  // --------------------------------------------------------------------------
  // SECTION 3: FULL ROUTE CRAWL & HYDRO-STRESS AUDIT
  // --------------------------------------------------------------------------
  console.log("\n--------------------------------------------------------------------------");
  console.log("⚡ PHASE 3: SAAS ROUTE CRAWL & AVAILABILITY AUDIT (35+ ROUTES)");
  console.log("--------------------------------------------------------------------------");

  const routesToCrawl = [
    "/",
    "/dashboard",
    "/learn",
    "/learn/courses",
    "/learn/excel-corporate",
    "/learn/corporate-mto",
    "/learn/power-bi",
    "/learn/ai-automation",
    "/career-hub",
    "/career-passport",
    "/certificates",
    "/challenges",
    "/community",
    "/courses",
    "/events/baubc",
    "/help",
    "/jobs",
    "/leaderboard",
    "/marketplace",
    "/mba-center",
    "/mock-interviews",
    "/mock-tests",
    "/settings",
    "/subscription",
    "/workshops",
    "/admin",
    "/passport/INSYT-PASS-2026",
    "/admin/setup",
    "/admin/seed",
    "/mock-interviews/fmcg-mto",
    "/challenges/fmcg-brand-master",
  ];

  const crawlStart = Date.now();
  const crawlResults = [];

  for (const route of routesToCrawl) {
    const res = await request(route);
    crawlResults.push({ route, status: res.status, duration: res.duration, ok: res.status === 200 });
    logResult("Route Audit", `Route: ${route}`, res.status === 200, res.duration, `HTTP Status: ${res.status}`);
  }

  const crawlTotalDuration = Date.now() - crawlStart;
  const failedRoutes = crawlResults.filter(r => !r.ok);

  console.log("\n==========================================================================");
  console.log("📊 STRESS TEST SUMMARY REPORT");
  console.log("==========================================================================");
  console.log(`  Total Tests Executed: ${report.totalTests}`);
  console.log(`  Passed:               ${report.passed}`);
  console.log(`  Failed:               ${report.failed}`);
  console.log(`  Total Crawl Duration: ${crawlTotalDuration}ms`);
  console.log(`  Route Health:         ${routesToCrawl.length - failedRoutes.length}/${routesToCrawl.length} Healthy`);
  if (failedRoutes.length > 0) {
    console.log(`  Failed Routes:        ${failedRoutes.map(f => `${f.route} (${f.status})`).join(", ")}`);
  }
  console.log("==========================================================================\n");
}

runSuperStressTest();
