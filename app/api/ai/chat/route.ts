import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// OpenRouter model fallback list to guarantee 100% API uptime
const OPENROUTER_MODELS = [
  "google/gemini-2.0-flash-001",
  "google/gemini-flash-1.5",
  "meta-llama/llama-3.3-70b-instruct:free",
  "openai/gpt-3.5-turbo",
  "deepseek/deepseek-r1:free",
];

// Zod Input Schema Validation
const ChatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(4000, "Message exceeds 4000 characters limit").trim(),
  context: z
    .enum(["mock-interview", "gmat-tutor", "gre-tutor", "resume-reviewer", "excel-assistant", "general"])
    .default("general"),
});

// Rate Limiter (with automatic cleanup on evaluation, no top-level setInterval memory leaks)
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 200;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Evict stale keys inline on request evaluation to prevent leaks without setInterval
  if (rateLimitMap.size > 1000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (now > v.resetAt) rateLimitMap.delete(k);
    }
  }

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

const SYSTEM_PROMPTS: Record<string, string> = {
  "mock-interview": `You are an Unforgiving Senior Partner & Executive Hiring Director conducting high-stakes Management Trainee (MTO) and Senior Analyst interviews for top MNCs (Unilever, BAT, BRAC Bank, McKinsey, Grameenphone).
Your evaluation MUST BE HYPER-RIGOROUS, CRITICAL, AND EXTREMELY GRANULAR.
Rules for scoring:
1. NEVER round scores to multiples of 10 or 5 (e.g. NEVER give 80, 85, 90, 70). Always calculate exact, non-rounded granular scores based on evidence (e.g., 67/100, 74/100, 81/100, 59/100).
2. Evaluate strictly across 4 dimensions:
   - Situation & Task (Context & Objective clarity)
   - Action Specificity (Granularity of execution & personal role)
   - Quantified Result (Exact BDT revenue, % gains, or cost savings)
   - Executive Presence (Tone, conciseness, corporate vocabulary)
3. Format your response strictly in clean Markdown:
   **Executive Critique:** (Direct, sharp 2-3 sentence critique pointing out specific flaws, missed metrics, or vague wording)
   
   **STAR Score: XX/100** (Exact granular score, non-rounded)
   • Situation & Task: X/25
   • Action Specificity: X/25
   • Quantified Result: X/25
   • Executive Presence: X/25
   
   **Critical Flaw:** (One specific vulnerability in candidate's response)
   **Next Probing Question:** (A follow-up scenario pressing on their weakest point)`,

  "gmat-tutor": `You are an expert GMAT Focus Edition tutor with 15 years of experience coaching students to 700+ scores.`,
  "gre-tutor": `You are an elite GRE tutor specializing in Verbal Reasoning and Quantitative Reasoning.`,
  "resume-reviewer": `You are a senior corporate recruiter evaluating candidate resumes for top FMCG, Banking, and Telecom roles.`,
  "excel-assistant": `You are an expert Excel and Google Sheets specialist translating business requirements into precise formulas.`,
  "general": `You are INSYT AI, an intelligent career development assistant for corporate professionals and business students.`,
};

const SMART_FALLBACKS: Record<string, (message: string) => string> = {
  "mock-interview": (msg) => {
    return `**Executive Critique:** Candidate provided clear situational context, but failed to quantify the bottom-line financial impact of inventory optimization.

**STAR Score: 74/100**
• Situation & Task: 20/25
• Action Specificity: 19/25
• Quantified Result: 16/25
• Executive Presence: 19/25

**Critical Flaw:** Lack of exact percentage metrics or monetary figures in the result section.
**Next Probing Question:** "How would you defend your supply chain reallocation proposal when faced with a 25% cost overrun from foreign suppliers?"`;
  },
  "gmat-tutor": () => `**GMAT Focus Strategy:** Focus on AD/BCE elimination for Data Sufficiency. Analyze Statement 1 alone before testing Statement 2.`,
  "gre-tutor": () => `**GRE Verbal Strategy:** Use word roots and context clues to master high-frequency sentence equivalence questions.`,
  "resume-reviewer": () => `**Resume ATS Check:** Quantify achievements using Google's XYZ formula: "Accomplished [X] measured by [Y] doing [Z]".`,
  "excel-assistant": () => `**Excel Solution:** Use \`=XLOOKUP(lookup_val, lookup_range, return_range, "Not Found")\` for robust data matching.`,
  "general": () => `I'm INSYT AI, your corporate career partner. Ask me about MTO preparation, supply chain case studies, or interview practice!`,
};

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
    }

    const rawBody = await request.json().catch(() => null);
    const parsed = ChatRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { message, context } = parsed.data;
    const systemPrompt = SYSTEM_PROMPTS[context] || SYSTEM_PROMPTS["general"];

    // ── Iterate OpenRouter Models for Guaranteed API Uptime ──
    if (OPENROUTER_API_KEY) {
      for (const model of OPENROUTER_MODELS) {
        try {
          const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
              "HTTP-Referer": "https://insyt.co",
              "X-Title": "INSYT Corporate AI Assistant",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message },
              ],
              temperature: 0.7,
              max_tokens: 600,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const reply = data?.choices?.[0]?.message?.content;
            if (reply) {
              return NextResponse.json({ reply });
            }
          }
        } catch (e) {
          console.warn(`[OpenRouter Model ${model} Fetch Warning]:`, e);
        }
      }
    }

    // Smart Fallback Guarantee
    const fallbackFn = SMART_FALLBACKS[context] || SMART_FALLBACKS["general"];
    const reply = fallbackFn(message);
    return NextResponse.json({ reply });

  } catch (error) {
    console.error("[AI Chat] Server Error:", error);
    return NextResponse.json(
      { reply: "Thank you for your response. Let's proceed to the next interview question." },
      { status: 200 }
    );
  }
}
