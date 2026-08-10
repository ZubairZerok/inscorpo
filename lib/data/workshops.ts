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
  hostOrg: string; // e.g., "BAU Business Club (BAUBC) x INSYT"
  instructor: {
    name: string;
    role: string;
    company: string;
    avatar: string;
    bio: string;
  };
  venue: string; // e.g. "Zoom Executive Room & BAU Campus Auditorium"
  description: string;
  agenda: { time: string; topic: string; details: string }[];
  learningOutcomes: string[];
  credentialName: string; // e.g. "Verified BAUBC Corporate Financial Analytics Credential"
  examQuestions: WorkshopQuestion[];
}

export const WORKSHOPS_DATA: WorkshopDetail[] = [
  {
    id: "mto-assessment-masterclass",
    title: "MTO Assessment Center & Case Solving Masterclass 2026",
    tagline: "Master SHL numerical tests, McKinsey MECE frameworks, and Group Discussion dynamics for top FMCG & Bank recruitment.",
    category: "MTO & Corporate",
    level: "Advanced",
    date: "Saturday, August 15, 2026",
    time: "7:30 PM – 9:30 PM (BST)",
    duration: "2.0 Hours",
    status: "upcoming",
    spotsRemaining: 18,
    totalCapacity: 150,
    xpReward: 150,
    examXpReward: 200,
    hostOrg: "BAU Business Club (BAUBC) x INSYT Corporate",
    instructor: {
      name: "Tanzim Hasan",
      role: "Ex-MTO & Brand Manager",
      company: "Unilever Bangladesh",
      avatar: "TH",
      bio: "Tanzim secured top rank in Unilever BizMaestros and led brand strategy across 4 division markets in South Asia.",
    },
    venue: "Live Zoom Executive Suite + BAU Central Auditorium",
    description: "An intensive 2-hour bootcamp designed for final-year university students and fresh graduates preparing for Management Trainee Officer (MTO) recruitment rounds across BAT, Unilever, BRAC Bank, and Grameenphone.",
    agenda: [
      { time: "7:30 PM", topic: "SHL & Psychometric Numerical Test Speed Hacks", details: "Shortcut formulas for ratio, growth rate, and matrix interpretation." },
      { time: "8:00 PM", topic: "Group Discussion (GD) Dominance Tactics", details: "How to introduce, structure consensus, and avoid candidate traps." },
      { time: "8:45 PM", topic: "McKinsey MECE Frameworks for Business Cases", details: "Structuring profitability and market entry cases live on screen." },
      { time: "9:15 PM", topic: "Live Q&A & BAUBC Credential Issuance Guidelines", details: "Direct candidate evaluation Q&A." },
    ],
    learningOutcomes: [
      "Solve SHL numerical reasoning questions in under 45 seconds per item",
      "Structure complex business problems using MECE issue trees",
      "Lead Group Discussions (GD) without interrupting or overdominating",
      "Format executive slide decks for Assessment Center final presentations",
    ],
    credentialName: "BAUBC Verified MTO & Case Solving Executive Certificate",
    examQuestions: [
      {
        id: 1,
        question: "What does MECE stand for in corporate case solving?",
        options: [
          "Most Efficient Case Evaluation",
          "Mutually Exclusive, Collectively Exhaustive",
          "Management Executive Corporate Excellence",
          "Main Entry Communication Strategy",
        ],
        correctAnswer: 1,
        explanation: "MECE ensures that problem components do not overlap (mutually exclusive) and cover all possibilities (collectively exhaustive).",
      },
      {
        id: 2,
        question: "During a Group Discussion (GD) round, what is the best strategy if another candidate speaks over you?",
        options: [
          "Raise your voice to overpower them immediately",
          "Remain quiet and do not speak for the rest of the GD",
          "Wait for a 2-second pause, acknowledge their point briefly, and synthesize the group's consensus",
          "Argue with the evaluator about fairness",
        ],
        correctAnswer: 2,
        explanation: "Evaluators look for active listening, professional synthesis, and structured collaboration over loud arguments.",
      },
      {
        id: 3,
        question: "If a company's revenue increased from ৳80 Crore to ৳112 Crore in one year, what is the percentage growth?",
        options: ["30%", "35%", "40%", "42%"],
        correctAnswer: 2,
        explanation: "Growth = (112 - 80) / 80 = 32 / 80 = 0.40 = 40%.",
      },
      {
        id: 4,
        question: "Which matrix framework is most suitable for evaluating a product line's market share vs. market growth rate?",
        options: ["SWOT Analysis", "BCG Growth-Share Matrix", "Porter's 5 Forces", "Ansoff Matrix"],
        correctAnswer: 1,
        explanation: "The BCG Matrix categorizes products into Stars, Cash Cows, Question Marks, and Dogs based on growth and market share.",
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
