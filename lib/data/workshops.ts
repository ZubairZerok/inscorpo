export interface WorkshopQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
}

export interface WorkshopDetail {
  id: string;
  title: string;
  tagline: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  date: string;
  time: string;
  duration: string;
  status: "upcoming" | "live" | "concluded";
  spotsRemaining: number;
  totalCapacity: number;
  xpReward: number;
  examXpReward: number;
  hostOrg: string; // e.g., "BAU Career Club (BAUCC) x INSYT"
  registrationUrl?: string;
  instructor: {
    name: string;
    role: string;
    company: string;
    avatar: string;
    bio: string;
  };
  venue: string;
  description: string;
  agenda: { time: string; topic: string; details: string }[];
  learningOutcomes: string[];
  credentialName: string;
  examQuestions: WorkshopQuestion[];
}

export const WORKSHOPS_DATA: WorkshopDetail[] = [
  {
    id: "cv-writing-linkedin-hacks",
    title: "CV Writing & LinkedIn Hacks!",
    tagline: "Did you know recruiters spend only about 6 seconds glancing at a CV? Master ATS-friendly CV engineering and LinkedIn optimization with Niaz Ahmed.",
    category: "Career & Branding",
    level: "Beginner",
    date: "Saturday, August 15, 2026",
    time: "3:00 PM – 5:00 PM (BST)",
    duration: "2.0 Hours",
    status: "upcoming",
    spotsRemaining: 25,
    totalCapacity: 200,
    xpReward: 150,
    examXpReward: 200,
    hostOrg: "BAU Career Club (BAUCC) x INSYT Corporate",
    registrationUrl: "https://forms.gle/qYevAczJCgUe4KVPA",
    instructor: {
      name: "Niaz Ahmed",
      role: "Founder & CEO",
      company: "Corporate Ask",
      avatar: "NA",
      bio: "Widely known as the best CV Engineer in Bangladesh. Crafted over 50,000 CVs, optimized 30,000 LinkedIn profiles, and authored 17 books on career development. National Young Entrepreneur Award 2017 & COF Inspiration Award 2017 winner.",
    },
    venue: "Live Zoom Interactive Masterclass & BAUCC Hub",
    description: "Did you know recruiters spend only about 6 seconds glancing at a CV? Just like your resume, if your LinkedIn profile fails to create an instant impact, your best skills might go completely unnoticed. BAUCC is bringing you an exclusive session with Niaz Ahmed, Founder & CEO of Corporate Ask, to master ATS-friendly CV building and hidden LinkedIn growth hacks to help you stand out to top recruiters.",
    agenda: [
      { time: "3:00 PM", topic: "Building a Highly Effective ATS Friendly CV", details: "Formatting standards, keyword density, and single-column parsing rules." },
      { time: "3:40 PM", topic: "Hidden Tricks to Optimize Your LinkedIn Profile", details: "Recruiter SEO algorithms, headline formulas, and featured section strategies." },
      { time: "4:20 PM", topic: "Smart Ways to Showcase Your Achievements", details: "Quantifiable STAR metrics, action verbs, and portfolio positioning." },
      { time: "4:50 PM", topic: "Live Q&A & BAUCC Credential Examination", details: "Direct candidate questions with Niaz Ahmed." },
    ],
    learningOutcomes: [
      "How to build a highly effective ATS friendly CV",
      "Hidden tricks to optimize your LinkedIn profile",
      "Smart ways to showcase your achievements",
      "Proven techniques to catch the attention of top recruiters",
    ],
    credentialName: "BAUCC Verified Executive CV & LinkedIn Branding Credential",
    examQuestions: [
      {
        id: 1,
        question: "How long on average do recruiters spend glancing at a CV during initial screening?",
        options: [
          "About 30 seconds",
          "About 6 seconds",
          "About 2 minutes",
          "About 15 seconds",
        ],
        correctAnswer: 1,
        explanation: "Recruiters spend approximately 6 seconds during initial screening scans, making visual structure and instant keyword clarity essential.",
      },
      {
        id: 2,
        question: "What is essential when building an ATS-friendly CV?",
        options: [
          "Using elaborate graphics and multi-column tables",
          "Using clean, parseable text structure with standard section headers",
          "Hiding keyword lists in tiny font sizes",
          "Saving the resume as an image file",
        ],
        correctAnswer: 1,
        explanation: "ATS scanners require clean text parsing, standard section headers (Experience, Education, Skills), and clear single-column layouts.",
      },
      {
        id: 3,
        question: "Which formula is best for describing accomplishments on your CV and LinkedIn?",
        options: [
          "Listing basic daily responsibilities with no numbers",
          "Action Verb + Task Context + Quantifiable Result / Impact",
          "Copying and pasting generic job description bullet points",
          "Writing long paragraphs describing personal characteristics",
        ],
        correctAnswer: 1,
        explanation: "Action Verb + Context + Quantifiable Metric clearly proves your value to recruiters.",
      },
      {
        id: 4,
        question: "What section of a LinkedIn profile has the highest impact on recruiter search algorithm visibility?",
        options: [
          "Profile Banner Photo",
          "Headline and Summary Keywords",
          "Number of Connections",
          "Recommendations Received",
        ],
        correctAnswer: 1,
        explanation: "LinkedIn's recruiter search index prioritizes exact job title keywords and skill terms in your Headline and Summary.",
      },
    ],
  },
  {
    id: "excel-financial-modeling",
    title: "Corporate Financial Modeling & DCF Valuation Bootcamp",
    tagline: "Construct dynamic 3-statement financial models, NPV/IRR schedules, and Sensitivity Analysis in Microsoft Excel.",
    category: "Analytics & Finance",
    level: "Intermediate",
    date: "Wednesday, August 19, 2026",
    time: "8:00 PM – 10:00 PM (BST)",
    duration: "2.0 Hours",
    status: "upcoming",
    spotsRemaining: 24,
    totalCapacity: 200,
    xpReward: 120,
    examXpReward: 180,
    hostOrg: "BAU Business Club (BAUBC) x INSYT Analytics",
    instructor: {
      name: "Samiul Alam, CFA",
      role: "Lead Financial Analyst",
      company: "BRAC Bank PLC",
      avatar: "SA",
      bio: "Samiul manages corporate portfolio modeling and investment valuation across South Asian commercial banking sectors.",
    },
    venue: "Live Interactive MS Teams Lab",
    description: "Hands-on financial modeling workshop where participants build a complete 3-statement model (P&L, Balance Sheet, Cash Flow) with dynamic debt modeling and DCF valuation.",
    agenda: [
      { time: "8:00 PM", topic: "3-Statement Integration Architecture", details: "Linking Net Income, Capex, Depreciation, and Working Capital." },
      { time: "8:40 PM", topic: "Discounted Cash Flow (DCF) & WACC Calculation", details: "Estimating cost of equity, terminal value, and enterprise value." },
      { time: "9:20 PM", topic: "Excel Data Tables & Sensitivity Analysis", details: "Building 2-way sensitivity grids for EBITDA vs. WACC." },
      { time: "9:50 PM", topic: "Assessment Quiz & BAUBC Certification", details: "Testing modeling concepts and issuing digital credentials." },
    ],
    learningOutcomes: [
      "Connect Income Statement, Balance Sheet, and Cash Flow Statement seamlessly",
      "Calculate Weighted Average Cost of Capital (WACC) for Bangladeshi enterprises",
      "Perform Sensitivity Analysis using Excel Data Tables",
      "Model Terminal Value using Gordon Growth and Exit Multiple methods",
    ],
    credentialName: "BAUBC Certified Corporate Financial Modeling Specialist",
    examQuestions: [
      {
        id: 1,
        question: "In financial modeling, where does Depreciation & Amortization flow across statement links?",
        options: [
          "Only on the Income Statement",
          "Added back on Cash Flow from Operations and reduces Net Fixed Assets on Balance Sheet",
          "Subtracted from Cash Flow from Financing",
          "Increases Working Capital on Balance Sheet",
        ],
        correctAnswer: 1,
        explanation: "D&A is a non-cash expense deducted on P&L, added back in CFO, and reduces Net Property, Plant & Equipment on Balance Sheet.",
      },
      {
        id: 2,
        question: "What is the formula for Free Cash Flow to Firm (FCFF)?",
        options: [
          "EBIT × (1 - Tax Rate) + D&A - Capex - Δ Working Capital",
          "Net Income + Dividends - Capex",
          "Gross Profit - Operating Expenses",
          "Revenue - Tax Paid",
        ],
        correctAnswer: 0,
        explanation: "FCFF represents unencumbered cash available to both equity and debt holders: NOPAT + D&A - Capex - ΔNWC.",
      },
      {
        id: 3,
        question: "If an investment requires ৳100,000 upfront and returns ৳120,000 in Year 1, what is the Net Present Value (NPV) at a 10% discount rate?",
        options: ["৳9,091", "৳10,000", "৳12,000", "৳20,000"],
        correctAnswer: 0,
        explanation: "PV of Cash Flow = 120,000 / (1 + 0.10) = 109,090.91. NPV = 109,090.91 - 100,000 = ৳9,091.",
      },
      {
        id: 4,
        question: "Which Excel feature is best suited for generating a 2-variable sensitivity table (e.g. WACC vs. Growth Rate)?",
        options: ["Goal Seek", "Data Table (What-If Analysis)", "Pivot Table", "VLOOKUP"],
        correctAnswer: 1,
        explanation: "Data Tables allow 2-variable sensitivity modeling across matrix inputs automatically.",
      },
    ],
  },
  {
    id: "ai-prompt-engineering-corporate",
    title: "AI Automation & Executive Prompt Engineering for Managers",
    tagline: "Leverage Claude 3.7, ChatGPT, and Python scripts to automate 60% of routine corporate tasks.",
    category: "AI & Productivity",
    level: "Beginner",
    date: "Sunday, August 23, 2026",
    time: "7:00 PM – 9:00 PM (BST)",
    duration: "2.0 Hours",
    status: "upcoming",
    spotsRemaining: 42,
    totalCapacity: 300,
    xpReward: 100,
    examXpReward: 150,
    hostOrg: "BAU Business Club (BAUBC) x INSYT AI Lab",
    instructor: {
      name: "Ayman Rahman",
      role: "Head of AI Product Strategy",
      company: "INSYT Enterprise",
      avatar: "AR",
      bio: "Ayman leads AI integration frameworks for multi-national FMCG supply chain automation.",
    },
    venue: "Live Broadcast Studio & BAU Business Club Hub",
    description: "Learn how to write structured system prompts, automate email summarization, parse unstructured PDF data, and build custom GPT assistants for workplace efficiency.",
    agenda: [
      { time: "7:00 PM", topic: "The Anatomy of Executive System Prompts", details: "Role definition, context framing, output constraints, and few-shot examples." },
      { time: "7:45 PM", topic: "Automating Unstructured PDF & Excel Extraction", details: "Extracting tables and metrics directly into clean CSV format." },
      { time: "8:25 PM", topic: "Building Custom AI Assistants for Teams", details: "Configuring knowledge bases and API triggers for daily operations." },
      { time: "8:50 PM", topic: "Post-Workshop Credential Exam", details: "Complete 4 AI scenario questions for BAUBC Certification." },
    ],
    learningOutcomes: [
      "Master Few-Shot and Chain-of-Thought prompting for zero-hallucination outputs",
      "Automate daily report generation and corporate email drafting",
      "Extract tabular data from complex scanned PDF financial statements",
      "Understand corporate data privacy guidelines for LLM deployment",
    ],
    credentialName: "BAUBC Certified Executive AI Productivity Specialist",
    examQuestions: [
      {
        id: 1,
        question: "What is Few-Shot Prompting in LLM interaction?",
        options: [
          "Asking the AI to answer as quickly as possible",
          "Providing a few concrete input-output examples in the prompt to guide formatting",
          "Sending short 3-word prompts only",
          "Running the prompt multiple times to compare results",
        ],
        correctAnswer: 1,
        explanation: "Few-shot prompting provides contextual demonstration pairs so the model matches your desired output schema exactly.",
      },
      {
        id: 2,
        question: "What is the primary benefit of 'Chain-of-Thought' (CoT) prompting for complex reasoning?",
        options: [
          "It reduces token usage",
          "It forces the LLM to break down logical steps before providing the final answer, improving accuracy",
          "It automatically formats the output into JSON",
          "It prevents the user from typing long queries",
        ],
        correctAnswer: 1,
        explanation: "Chain-of-thought encourages step-by-step reasoning, significantly reducing mathematical and multi-hop logic errors.",
      },
      {
        id: 3,
        question: "Which parameter controls the randomness/creativity of LLM outputs?",
        options: ["Top-P / Temperature", "Context Window", "Learning Rate", "Embedding Dimension"],
        correctAnswer: 0,
        explanation: "Temperature (0.0 to 1.0) controls output determinism — lower for factual data, higher for creative writing.",
      },
      {
        id: 4,
        question: "When processing confidential corporate financial data with public AI models, what is the best practice?",
        options: [
          "Paste all raw customer data directly without changes",
          "Anonymize personally identifiable information (PII) and internal keys before sending to API endpoints",
          "Turn off internet connection on your browser",
          "Use lower temperature settings",
        ],
        correctAnswer: 1,
        explanation: "Data privacy compliance requires stripping or masking PII and proprietary customer records before third-party processing.",
      },
    ],
  },
];

export function getWorkshopById(id: string): WorkshopDetail | undefined {
  return WORKSHOPS_DATA.find((w) => w.id === id);
}
