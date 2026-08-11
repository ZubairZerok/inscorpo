"use client";

import { use, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Play, FileText, Bookmark, MessageSquare,
  Sparkles, CheckCircle2, ChevronRight, Download, Send, Check, AlertCircle,
  Table, HelpCircle, Terminal, Calculator, Layers, Code, Zap
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/components/providers/user-context";

interface PageProps {
  params: Promise<{ pathSlug: string; courseSlug: string; lessonSlug: string }>;
}

// Extensive database of specific GOATED lesson details for GMAT & Excel
const dynamicLessons: Record<string, {
  title: string;
  xpReward: number;
  duration: string;
  videoUrl: string;
  notes: string;
  quiz: {
    question: string;
    options: string[];
    correctIdx: number;
    explanation: string;
  };
  hasSimulator?: "lookup" | "npv" | "solver" | "email" | "resume" | "star" | "forces" | "formula";
}> = {
  // GMAT & GRE Lessons
  "divisibility-remainders": {
    title: "Factors, Multiples, and Remainder Theorem",
    xpReward: 60,
    duration: "25m",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    notes: `### Factors, Multiples & Remainder Theorem

#### Executive Overview & GMAT Strategy
Quantitative reasoning on top-tier standardized tests evaluates your ability to recognize structural number properties rather than perform brute-force arithmetic.

#### Core Mathematical Theorems:
1. **Divisibility Definition**: An integer $n$ is divisible by $d$ if there exists an integer $k$ such that:
   $$n = k \\times d$$
2. **The Quotient-Remainder Formula**: For any integer $n$ divided by positive divisor $d$:
   $$n = q \\cdot d + r \\quad \\text{where } 0 \\le r < d$$
3. **Remainder Addition Property**:
   $$\\text{Rem}\\left(\\frac{A + B}{d}\\right) = \\text{Rem}\\left(\\frac{\\text{Rem}(A/d) + \\text{Rem}(B/d)}{d}\\right)$$
4. **Prime Factorization Rule**: The number of factors of $N = p_1^{a} \\cdot p_2^{b} \\cdot p_3^{c}$ is given by:
   $$\\text{Total Factors} = (a+1)(b+1)(c+1)$$

#### High-Score Test Shortcuts:
* If $x$ divided by 9 leaves remainder $r$, then the sum of digits of $x$ divided by 9 also leaves remainder $r$.
* Remainder problems involving large exponents ($x^n \\bmod d$) should be solved using pattern recognition or modular cycles.`,
    quiz: {
      question: "If integer x is divided by 9, the remainder is 5. What is the remainder when 3x + 4 is divided by 9?",
      options: [
        "1",
        "3",
        "4",
        "7"
      ],
      correctIdx: 0,
      explanation: "Let x = 9k + 5. Then 3x + 4 = 3(9k + 5) + 4 = 27k + 15 + 4 = 27k + 19. Expressing 19 in terms of multiples of 9: 19 = 9(2) + 1. Therefore, the remainder is 1."
    },
    hasSimulator: "formula"
  },

  // Excel Fundamentals
  "excel-orientation": {
    title: "Excel Course Orientation & Setup Guide",
    xpReward: 50,
    duration: "15m",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    notes: `### Excel Course Orientation & Corporate Setup Guide

#### Executive Summary & Corporate Context
In investment banking, management consulting, and FMCG corporate analytics, financial modeling speed and precision dictate career velocity. This masterclass trains you to work mouse-free using industry-standard keyboard shortcut systems.

#### Core Setup Standards for Corporate Analysts:
1. **Gridlines Display**: Ensure Gridlines are enabled under \`View -> Show -> Gridlines\` for raw data, but hidden for presentation executive decks.
2. **Formula Auto-Calculation**: Set Calculation Options to \`Automatic\` under \`Formulas -> Calculation Options\`.
3. **Quick Access Toolbar (QAT)**: Customize the top bar with \`Save\`, \`Undo\`, \`Redo\`, \`Paste Special Values\`, and \`Font Color\`.

#### Best Practices Checklist:
* **Color Coding Standards**: Blue text = Hardcoded inputs, Black text = Formulas & calculations, Green text = Links to other sheets, Red text = External links/warnings.
* **Never Hardcode in Formulas**: Separate assumptions (inputs) into dedicated input cells rather than writing numbers inside formulas (e.g. use \`=A1*(1+B1)\` instead of \`=A1*1.05\`).`,
    quiz: {
      question: "According to financial modeling standards, what cell text color should be used for hardcoded input numbers?",
      options: [
        "Black font",
        "Blue font",
        "Green font",
        "Red font"
      ],
      correctIdx: 1,
      explanation: "Standard corporate financial modeling guidelines mandate Blue font for hardcoded input values and Black font for calculated formulas."
    },
    hasSimulator: "formula"
  },

  "keyboard-shortcuts": {
    title: "High-Frequency Executive Keyboard Shortcuts",
    xpReward: 70,
    duration: "25m",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    notes: `### High-Frequency Executive Keyboard Shortcuts

#### The Mouse-Free Productivity Philosophy
Top analysts work 3x faster by eliminating mouse dependency. Memorize these key combinations to navigate spreadsheets at elite speeds.

#### Essential Shortcut Cheat Sheet:
* **Navigation & Selection**:
  * \`Ctrl + Arrow Keys\`: Jump to the edge of the data region.
  * \`Ctrl + Shift + Arrow Keys\`: Select range to the edge of data.
  * \`Ctrl + Home / End\`: Jump to cell A1 or the last used cell.
* **Editing & Formatting**:
  * \`F4\`: Toggle absolute/relative cell references (\`$A$1\`, \`A$1\`, \`$A1\`, \`A1\`) OR repeat last action.
  * \`Ctrl + 1\`: Open Format Cells dialog box.
  * \`Alt + H + O + I\`: Auto-fit column widths.
  * \`Alt + = \`: AutoSum selected numbers.
  * \`Ctrl + Shift + 1\`: Format as Number (\`#,##0.00\`).
  * \`Ctrl + Shift + 4\`: Format as Currency (\`$#,##0.00\`).

#### Pro Tip:
Use the \`Alt\` ribbon navigation key. Pressing \`Alt\` highlights key tips across the ribbon menu, allowing access to any Excel command without touching the mouse.`,
    quiz: {
      question: "Which function key toggles cell reference locking (absolute vs relative, e.g. $A$1) inside the formula bar?",
      options: [
        "F2",
        "F4",
        "F8",
        "F12"
      ],
      correctIdx: 1,
      explanation: "Pressing F4 while editing a cell reference cycles through absolute ($A$1), row-locked (A$1), column-locked ($A1), and relative (A1) modes."
    },
    hasSimulator: "formula"
  },

  // Excel Formulas & Data Cleaning
  "lookup-functions": {
    title: "XLOOKUP vs VLOOKUP/INDEX-MATCH",
    xpReward: 80,
    duration: "25m",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    notes: `### XLOOKUP Syntax & Advanced Array Mapping

#### Executive Overview
Microsoft introduced \`XLOOKUP\` to solve the critical vulnerabilities of legacy \`VLOOKUP\` and replace multi-nested \`INDEX-MATCH\` functions.

#### Syntactical Signature:
\`\`\`excel
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])
\`\`\`

#### Comparative Advantages:
1. **Leftward Lookups**: Searches left or right without requiring the lookup column to be the leftmost array column.
2. **Default Exact Match**: Defaults to exact match (\`match_mode = 0\`), eliminating accidental approximate matching errors.
3. **Native Error Handling**: Includes built-in \`[if_not_found]\` parameter, removing the need to wrap formulas in \`IFERROR()\`.
4. **Dynamic Array Return**: Returns an entire row or multi-column array when paired with multiple return columns.

#### Real-World Corporate Example:
\`\`\`excel
=XLOOKUP(E2, Employees[ID], Employees[Salary], "Employee Not Found", 0)
\`\`\``,
    quiz: {
      question: "Which array parameter represents the target database column from which values are extracted in XLOOKUP?",
      options: [
        "lookup_value",
        "lookup_array",
        "return_array",
        "match_mode"
      ],
      correctIdx: 2,
      explanation: "The return_array parameter defines the target dataset column or range containing the values to return."
    },
    hasSimulator: "lookup"
  },

  "summary-functions": {
    title: "SUMIFS, COUNTIFS & Conditional Summaries",
    xpReward: 75,
    duration: "30m",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    notes: `### SUMIFS, COUNTIFS & Multi-Criteria Analytics

#### Corporate Application
Executive dashboards require aggregating metrics based on dynamic filters (e.g. Total Revenue for Region='North' AND Category='Electronics' AND Date >= Q1).

#### Formula Syntax Signatures:
* **SUMIFS**:
  \`\`\`excel
  =SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)
  \`\`\`
* **COUNTIFS**:
  \`\`\`excel
  =COUNTIFS(criteria_range1, criteria1, [criteria_range2, criteria2], ...)
  \`\`\`

#### Key Syntactical Rule:
In \`SUMIFS\`, the \`sum_range\` comes **FIRST**, whereas in legacy single-criterion \`SUMIF\`, the sum range comes last. Always use \`SUMIFS\` for consistency.

#### Logical Operators in Criteria:
* Greater than $50,000: \`">50000"\`
* Date range filter: \`">="&DATE(2026,1,1)\`
* Wildcard matching: \`"North*"\` (matches North, Northeast, Northwest)`,
    quiz: {
      question: "In the SUMIFS function, what is the position of the sum_range parameter?",
      options: [
        "The very first argument",
        "The very last argument",
        "Directly after criteria_range1",
        "Inside an array bracket"
      ],
      correctIdx: 0,
      explanation: "Unlike single-criterion SUMIF, SUMIFS requires sum_range as its first parameter before any criteria ranges are listed."
    },
    hasSimulator: "formula"
  },

  // Financial Modeling
  "npv-irr-models": {
    title: "NPV & IRR Investment Case Modeling",
    xpReward: 90,
    duration: "40m",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    notes: `### Net Present Value (NPV) & Internal Rate of Return (IRR)

#### Executive Overview & DCF Modeling
Capital budgeting decisions evaluate whether projected future cash flows justify initial capital outlays based on the Weighted Average Cost of Capital (WACC).

#### Core Financial Formulas:
* **Net Present Value (NPV)**:
  $$NPV = \\sum_{t=1}^{n} \\frac{CF_t}{(1+r)^t} - \\text{Initial Investment}$$
  * Excel Formula: \`=NPV(rate, CF1, CF2, CF3) - Initial_Outflow\`
* **Internal Rate of Return (IRR)**:
  The discount rate $r$ that sets $NPV = 0$.
  * Excel Formula: \`=IRR(values_range)\`

#### Decision Rules:
* **If NPV > 0**: Project adds shareholder value $\\rightarrow$ **ACCEPT**.
* **If IRR > WACC**: Return exceeds cost of capital $\\rightarrow$ **ACCEPT**.`,
    quiz: {
      question: "If the calculated NPV of a capital expansion project is positive at a 10% WACC discount rate, what does this indicate about the IRR?",
      options: [
        "The IRR is less than 10%.",
        "The IRR is exactly equal to 10%.",
        "The IRR is greater than 10%.",
        "The IRR cannot be determined."
      ],
      correctIdx: 2,
      explanation: "A positive NPV means the investment yield exceeds the discount rate. Therefore, the rate of return where NPV equals zero (the IRR) must be greater than 10%."
    },
    hasSimulator: "npv"
  },

  // Optimization
  "goal-seek-solver": {
    title: "Using Solver to Optimize Product Mixes",
    xpReward: 95,
    duration: "30m",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    notes: `### Excel Solver & Linear Optimization Modeling

#### Executive Overview
Excel Solver uses linear programming algorithms (Simplex LP) to maximize profit or minimize costs subject to operational resource constraints.

#### Optimization Setup Framework:
1. **Objective Cell**: Target metric cell to Maximize, Minimize, or set to a target value (e.g. Total Profit).
2. **Variable Cells (By Changing Variable Cells)**: Production quantities or resource allocation inputs.
3. **Constraints**: Operational boundary equations (e.g. Total Labor Hours $\\le$ 120, Machine Time $\\le$ 80 hours).

#### Solver Engine Selection:
* **Simplex LP**: Used for linear models where variables increase proportionally.
* **GRG Nonlinear**: Used for smooth nonlinear equations.
* **Evolutionary**: Used for complex non-smooth functions with IF statements.`,
    quiz: {
      question: "Which Excel Solver parameter defines the decision variables that Excel alters to optimize the objective function?",
      options: [
        "Objective Cell",
        "Variable Cells (By Changing Variable Cells)",
        "Constraint Parameters",
        "Engine Sensitivity"
      ],
      correctIdx: 1,
      explanation: "The variable cells ('By Changing Variable Cells') represent the decision parameters that Solver adjusts to achieve optimal results."
    },
    hasSimulator: "solver"
  },

  // Executive Communication
  "email-templates-generator": {
    title: "Building Executive & Cold Networking Templates",
    xpReward: 85,
    duration: "30m",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    notes: `### Structured Business Email Formulations

#### Executive Communication Strategy
Busy corporate executives receive 100+ emails daily. High-impact emails must adhere to strict brevity rules and low-friction calls to action.

#### 3-Step Structural Framework:
1. **Action-Oriented Subject Line**: Clear, concise, and explicit (e.g., \`Meeting Request: Q3 Analytics Alignment (15 Min)\`).
2. **First 2 Sentences**: Establish relevance immediately. Answer 'Why me?' and 'Why now?'.
3. **Specific Low-Friction CTA**: Propose specific dates/times or binary choices rather than open-ended questions like 'When are you free?'.`,
    quiz: {
      question: "Which of the following represents the most professional and low-friction email subject line?",
      options: [
        "Urgent: Read this right now",
        "Introduction and questions",
        "Meeting Proposal: Q3 Analytics Alignment (July 15, 15 Min)",
        "Hello from a student"
      ],
      correctIdx: 2,
      explanation: "A high-impact subject line clearly states the objective, context, date, and time commitment to minimize friction."
    },
    hasSimulator: "email"
  },

  "achievement-quantifier": {
    title: "Writing Quantifiable Achievement Bullet Points",
    xpReward: 90,
    duration: "25m",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    notes: `### Quantifying Resume Bullets & Google XYZ Formula

#### ATS & Executive Recruiter Standards
Recruiters and ATS parsers rank candidates based on clear evidence of business impact rather than passive job descriptions.

#### The Google XYZ Formula:
> "Accomplished **[X]**, as measured by **[Y]**, by doing **[Z]**."

#### Bad vs. Good Examples:
* **Bad**: *"Responsible for updating sales data in Excel."*
* **Good (XYZ Format)**: *"Engineered an automated Excel P&L model, accelerating monthly financial closing by 35% and saving 12 hours of manual labor per reporting cycle."*`,
    quiz: {
      question: "Which of the following resume bullets strictly follows the Google XYZ impact formula?",
      options: [
        "Responsible for handling client calls and managing records.",
        "Increased regional sales revenue by 22% ($180k) in Q3 by optimizing Google Ads targeting parameters.",
        "Helped the team with weekly presentation decks.",
        "Managed database files and organized office travel."
      ],
      correctIdx: 1,
      explanation: "This bullet specifies X (sales increased by 22%), Y (measured by $180k in Q3), and Z (optimizing Google Ads targeting parameters)."
    },
    hasSimulator: "resume"
  },

  "star-story-builder": {
    title: "Structuring STAR Behavioral Interview Stories",
    xpReward: 95,
    duration: "25m",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    notes: `### The STAR Behavioral Interview Framework

#### Structure & Time Allocation
Behavioral interview questions ("Tell me about a time when...") evaluate past actions to predict future performance. Use the STAR method to structure your response.

#### STAR Breakdown & Target Time Ratios:
1. **Situation (15%)**: Concise context (Who, What, Where, When).
2. **Task (15%)**: The explicit problem or goal to be solved.
3. **Action (60%)**: The specific steps **YOU** took. Use 'I' statements, detail problem-solving logic, and highlight leadership.
4. **Result (10%)**: Quantifiable business metrics outcome.`,
    quiz: {
      question: "Which section of the STAR interview framework should consume approximately 60% of your total response time?",
      options: [
        "Situation",
        "Task",
        "Action",
        "Result"
      ],
      correctIdx: 2,
      explanation: "The Action phase demonstrates your personal competencies, decision logic, and problem-solving actions, forming the core of the response."
    },
    hasSimulator: "star"
  },

  "five-forces-builder": {
    title: "Applying Porter's Five Forces Framework Models",
    xpReward: 90,
    duration: "30m",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    notes: `### Porter's Five Forces Strategic Framework

#### Executive Summary & Consulting Application
Michael Porter's framework analyzes an industry's structural attractiveness and long-term return on capital.

#### The Five Competitive Forces:
1. **Threat of New Entrants**: Barrier heights (capital requirements, scale economies, IP).
2. **Bargaining Power of Buyers**: Buyer concentration, switching costs, price sensitivity.
3. **Bargaining Power of Suppliers**: Supplier concentration, availability of inputs.
4. **Threat of Substitutes**: Relative price-performance of alternative product categories.
5. **Competitive Rivalry**: Number of industry players, fixed cost structures, exit barriers.`,
    quiz: {
      question: "Which of the following factors increases the Bargaining Power of Buyers?",
      options: [
        "High switching costs to switch to competing products.",
        "Undifferentiated, standardized products with zero switching costs.",
        "Highly fragmented buyers purchasing small quantities.",
        "Supplier threat of forward integration."
      ],
      correctIdx: 1,
      explanation: "When products are standardized and switching costs are zero, buyers can easily switch suppliers, increasing their bargaining leverage."
    },
    hasSimulator: "forces"
  }
};

export default function LessonPlayerPage(props: PageProps) {
  const { state, addXP, addNotification, updateCourseProgress, recordStudyMinutes } = useUser();
  const params = use(props.params);
  const pathSlug = params?.pathSlug || "excel-corporate";
  const courseSlug = params?.courseSlug || "excel-fundamentals";
  const lessonSlug = params?.lessonSlug || "lookup-functions";

  // Formatted title for dynamic fallback
  const formattedTitle = lessonSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  // Fetch specific lesson content or build GOATED dynamic fallback
  const lesson = dynamicLessons[lessonSlug] || {
    title: formattedTitle,
    xpReward: 60,
    duration: "25m",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    notes: `### ${formattedTitle} — Executive Masterclass & Debugging Guide

#### Executive Overview & Corporate Context
In modern data-driven corporate roles, mastering **${formattedTitle}** allows analysts to automate reporting workflows, reduce manual error risks, and generate executive insights under tight deadlines.

#### Key Learning Objectives & Core Framework:
1. **Analytical Mastery**: Apply formulas and operational rules for **${formattedTitle}** in real-world business scenarios.
2. **Efficiency Best Practices**: Use industry-standard keyboard shortcuts and structured layout templates.
3. **Verification & Audit**: Test calculations against edge cases to prevent spreadsheet errors.

#### Step-by-Step Implementation Guide:
* **Step 1**: Review the input dataset structure and verify formatting integrity using \`TRIM()\` and \`CLEAN()\`.
* **Step 2**: Construct your calculation formula using absolute reference locks (\`$\`) where necessary (e.g. \`$A$2:\$E$100\`).
* **Step 3**: Audit formula outputs using \`Ctrl + [\` (Trace Precedents) and test edge cases.

#### ⚠️ Corporate Failure Modes & Debugging Playbook:
* **\`#N/A\` Error**: Occurs when lookup values contain hidden trailing spaces or unmatched data types (e.g. Text vs Number). Fix by wrapping in \`TRIM(A2)\` or converting text numbers using \`VALUE()\`.
* **\`#VALUE!\` Error**: Occurs when arithmetic operations are performed on text cells. Wrap formulas in \`IFERROR(formula, 0)\`.
* **\`#REF!\` Error**: Caused by deleted referenced cells or invalid array offsets. Undo immediately with \`Ctrl + Z\`.

#### Corporate Analyst Pro-Tip:
Always maintain a clean separation between **Inputs** (Blue font), **Calculations** (Black font), and **Summary KPI Cards**. Never hardcode numerical constants inside formulas!`,
    quiz: {
      question: `In corporate financial modeling, what is the primary fix for an #N/A lookup error caused by hidden trailing spaces?`,
      options: [
        "Wrap the lookup cell in TRIM(), e.g., TRIM(A2)",
        "Delete the formula and re-type the whole sheet",
        "Change font size to 14pt",
        "Disable auto-calculation options"
      ],
      correctIdx: 0,
      explanation: "Hidden leading/trailing spaces in text inputs are the #1 cause of #N/A lookup mismatches. Wrapping lookup targets in TRIM(A2) strips unwanted whitespace."
    },
    hasSimulator: "formula"
  };

  const [activeTab, setActiveTab] = useState<"video" | "reading" | "simulation" | "quiz">("video");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);
  const [showXPPopup, setShowXPPopup] = useState(false);

  // XLOOKUP Simulator state
  const [lookupVal, setLookupVal] = useState("Emp-02");
  const [lookupResult, setLookupResult] = useState<any>(null);

  // NPV Simulator state
  const [initialInv, setInitialInv] = useState(100000);
  const [discountRate, setDiscountRate] = useState(10);
  const [calcNpv, setCalcNpv] = useState<number | null>(null);

  // Solver Simulator state
  const [unitsA, setUnitsA] = useState(10);
  const [unitsB, setUnitsB] = useState(20);
  const [solverFeedback, setSolverFeedback] = useState("");

  // Formula Console Simulator state (Universal for all lessons!)
  const [userFormula, setUserFormula] = useState("=SUM(E2:E6)");
  const [formulaOutput, setFormulaOutput] = useState<{ result: string; status: "success" | "error"; type: string }>({
    result: "$144,500", status: "success", type: "Currency Aggregate"
  });

  // Email Builder Simulator state
  const [emailType, setEmailType] = useState<"cold" | "complaint" | "update">("cold");
  const [emailIndustry, setEmailIndustry] = useState<"consulting" | "tech" | "banking">("consulting");

  // Resume Bullet Simulator state
  const [resumeBullet, setResumeBullet] = useState("Responsible for managing databases and designing spreadsheets.");
  const [bulletScore, setBulletScore] = useState<number | null>(null);
  const [bulletAdvice, setBulletAdvice] = useState("");

  // STAR Story Builder state
  const [starS, setStarS] = useState("Our client onboarding rate dropped by 12% in Q1.");
  const [starT, setStarT] = useState("I needed to redesign the intake questionnaire pipeline.");
  const [starA, setStarA] = useState("I automated CRM integrations using Zapier, syncing profiles.");
  const [starR, setStarR] = useState("Boosted onboarding conversions by 20% and saved 10 hours weekly.");
  const [starScore, setStarScore] = useState<number | null>(null);
  const [starAdvice, setStarAdvice] = useState("");

  // Porter's Five Forces state
  const [forceEntrants, setForceEntrants] = useState(3);
  const [forceBuyers, setForceBuyers] = useState(4);
  const [forceSuppliers, setForceSuppliers] = useState(2);
  const [forceSubstitutes, setForceSubstitutes] = useState(3);
  const [forceRivalry, setForceRivalry] = useState(4);
  const [forcesScore, setForcesScore] = useState<number | null>(null);
  const [forcesAdvice, setForcesAdvice] = useState("");

  const handleRunLookup = () => {
    const database = [
      { id: "Emp-01", name: "Zubair Ahmed", role: "Financial Analyst", salary: 75000 },
      { id: "Emp-02", name: "Anika Rahman", role: "Product Manager", salary: 92000 },
      { id: "Emp-03", name: "Farhan Kabir", role: "Data Engineer", salary: 85000 }
    ];
    const match = database.find(item => item.id === lookupVal);
    setLookupResult(match || null);
  };

  const handleRunNpv = () => {
    const cashflows = [30000, 40000, 50000];
    let presentValueSum = 0;
    cashflows.forEach((cf, idx) => {
      presentValueSum += cf / Math.pow(1 + discountRate / 100, idx + 1);
    });
    setCalcNpv(Math.round(presentValueSum - initialInv));
  };

  const handleRunFormulaConsole = (formulaInput?: string) => {
    const input = formulaInput || userFormula;
    const clean = input.trim().toUpperCase();
    
    if (clean.startsWith("=SUM")) {
      setFormulaOutput({ result: "$144,500", status: "success", type: "Currency Aggregate (SUM)" });
    } else if (clean.startsWith("=AVERAGE")) {
      setFormulaOutput({ result: "270 Units", status: "success", type: "Numerical Mean (AVERAGE)" });
    } else if (clean.startsWith("=XLOOKUP") || clean.startsWith("=VLOOKUP")) {
      setFormulaOutput({ result: "Anika Rahman (Product Manager)", status: "success", type: "Lookup Array Match" });
    } else if (clean.startsWith("=IF")) {
      setFormulaOutput({ result: '"Target Exceeded"', status: "success", type: "Boolean Condition Evaluation" });
    } else if (clean.startsWith("=MAX")) {
      setFormulaOutput({ result: "$52,500 (Laptop Pro)", status: "success", type: "Maximum Value Search" });
    } else if (clean.startsWith("=COUNT")) {
      setFormulaOutput({ result: "5 Rows", status: "success", type: "Count Evaluation" });
    } else {
      setFormulaOutput({ result: `=EVAL(${input}) → Calculated Value: 42.50`, status: "success", type: "General Cell Calculation" });
    }
  };

  useEffect(() => {
    handleRunLookup();
    handleRunNpv();
    handleRunFormulaConsole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookupVal, initialInv, discountRate]);

  const handleRunSolver = () => {
    const laborUsed = unitsA * 3 + unitsB * 2;
    if (laborUsed > 120) {
      setSolverFeedback(`Error: Labor constraint violated! Used ${laborUsed} hours (Max limit is 120). Reduce production quantities.`);
    } else {
      const profit = unitsA * 45 + unitsB * 35;
      setSolverFeedback(`Success! Solved optimal production. Profit generated: $${profit}. Total labor hours used: ${laborUsed}/120.`);
    }
  };

  const handleAnalyzeBullet = () => {
    const text = resumeBullet.toLowerCase();
    let score = 40;
    const actionVerbs = ["redesigned", "engineered", "implemented", "managed", "directed", "accelerated", "optimized"];
    if (actionVerbs.some(verb => text.includes(verb))) score += 20;
    if (/[0-9]/.test(text)) score += 20;
    if (text.includes("by") || text.includes("as measured") || text.includes("resulting") || text.includes("saving")) score += 20;

    setBulletScore(score);
    setBulletAdvice(score >= 80 ? "All-Star Bullet! Outstanding use of action verbs, quantifiable metrics, and business outcomes." : "Add specific metrics (% or $) and Google XYZ structure.");
  };

  const handleAnalyzeStar = () => {
    let score = 50;
    if (starS.trim().length > 15) score += 10;
    if (starT.trim().length > 15) score += 10;
    if (starA.trim().length > 25) score += 15;
    if (/[0-9]/.test(starR)) score += 15;
    setStarScore(Math.min(score, 100));
    setStarAdvice(score >= 80 ? "Outstanding STAR response! Structured and recruiter-approved." : "Add more specific action steps and quantifiable metrics.");
  };

  const handleAnalyzeForces = () => {
    const avgScore = (forceEntrants + forceBuyers + forceSuppliers + forceSubstitutes + forceRivalry) / 5;
    const attractiveness = Math.round((5 - avgScore) * 20);
    setForcesScore(attractiveness);
    setForcesAdvice(attractiveness >= 70 ? "Highly Attractive Market! High entry barriers and low substitute threats." : "Moderate/Challenging Market structure.");
  };

  const handleQuizSubmit = () => {
    if (selectedAnswer === null) return;
    setQuizSubmitted(true);
    const isCorrect = selectedAnswer === lesson.quiz.correctIdx;
    setQuizSuccess(isCorrect);
    if (isCorrect && !quizSuccess) {
      addXP(lesson.xpReward, `Completed lesson: ${lesson.title}`);
      addNotification({
        type: "achievement",
        title: "Lesson Completed 🎉",
        message: `You earned ${lesson.xpReward} XP for completing ${lesson.title}.`
      });

      const currentCourse = state.courseProgress.find((c) => c.id === courseSlug);
      const currentProgress = currentCourse ? currentCourse.progress : 0;
      const nextProgress = Math.min(currentProgress + 25, 100);
      updateCourseProgress(courseSlug, nextProgress);

      const lessonMinutes = parseInt(lesson.duration) || 20;
      recordStudyMinutes(lessonMinutes);

      setShowXPPopup(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/learn/${pathSlug}/${courseSlug}`}
          className="inline-flex items-center gap-2 text-xs font-extrabold transition-colors text-corp-text-secondary hover:text-[#10b981]"
        >
          <ArrowLeft size={14} /> Back to Course Syllabus
        </Link>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/40">
          <Sparkles size={13} className="text-amber-400" />
          +{lesson.xpReward} XP Reward
        </span>
      </div>

      {/* Lesson Banner */}
      <div className="p-6 rounded-xl space-y-2 shadow-[5px_5px_0px_0px_rgba(16,185,129,0.25)] border-2 border-[#10b981]/50" style={{ background: "var(--corp-surface)" }}>
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight font-mono uppercase" style={{ color: "var(--corp-text)" }}>
          {lesson.title}
        </h1>
        <p className="text-xs font-extrabold text-corp-text-secondary font-mono">
          Estimated duration: {lesson.duration} · Track: {pathSlug === "excel-corporate" ? "Excel for Corporate Careers" : pathSlug}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b-2 border-corp-border">
        {(["video", "reading", "simulation", "quiz"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-xs font-extrabold capitalize relative transition-all duration-200`}
            style={{ color: activeTab === tab ? "#10b981" : "var(--corp-text-tertiary)" }}
          >
            {tab === "simulation" ? "Interactive Simulator ⚡" : tab}
            {activeTab === tab && (
              <motion.div
                layoutId="lesson-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#10b981]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[400px]">
        {/* 1. Video Tab */}
        {activeTab === "video" && (
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border" style={{ borderColor: "var(--corp-border)" }}>
              <video src={lesson.videoUrl} controls className="w-full h-full object-cover" />
            </div>
            <p className="text-xs italic text-center" style={{ color: "var(--corp-text-tertiary)" }}>
              Watch the full tutorial video, then complete the reading and interactive simulator tabs below.
            </p>
          </div>
        )}

        {/* 2. GOATED Reading Tab */}
        {activeTab === "reading" && (
          <div className="p-6 md:p-8 rounded-3xl space-y-6 leading-relaxed shadow-sm border" style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)", color: "var(--corp-text)" }}>
            <div className="prose dark:prose-invert max-w-none text-xs md:text-sm whitespace-pre-line leading-relaxed">
              {lesson.notes}
            </div>

            <div className="pt-4 border-t flex flex-col sm:flex-row justify-between gap-3" style={{ borderColor: "var(--corp-border)" }}>
              <button
                onClick={() => {
                  const csvData = "Employee_ID,Name,Department,Region,Q1_Revenue,Q2_Revenue,Rating\nEmp-01,Zubair Ahmed,Finance,North,75000,82000,4.9\nEmp-02,Anika Rahman,Product,South,92000,98000,5.0\nEmp-03,Farhan Kabir,Analytics,East,85000,91000,4.8\nEmp-04,Nusrat Jahan,Operations,West,68000,74000,4.7";
                  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `INSYT_Practice_Dataset_${lessonSlug}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
                style={{ background: "var(--corp-bg-secondary)", color: "var(--corp-text-secondary)" }}
              >
                <Download size={14} /> Download Practice Dataset (.csv)
              </button>
              <button className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-corp-accent text-white hover:bg-corp-accent-hover transition-colors">
                <Bookmark size={14} /> Save to Bookmarks
              </button>
            </div>
          </div>
        )}

        {/* 3. Interactive Simulator Tab (NO MORE "No Simulator" BLOCK!) */}
        {activeTab === "simulation" && (
          <div className="space-y-4">

            {/* Custom XLOOKUP Simulator */}
            {lesson.hasSimulator === "lookup" && (
              <div className="p-6 rounded-2xl space-y-4 border" style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}>
                <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
                  <Calculator size={16} className="text-corp-accent" /> Interactive XLOOKUP Array Simulator
                </h3>
                <p className="text-xs" style={{ color: "var(--corp-text-secondary)" }}>
                  Select an Employee ID to evaluate the XLOOKUP function execution in real-time.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Emp-01", "Emp-02", "Emp-03"].map((id) => (
                    <button key={id} onClick={() => setLookupVal(id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${lookupVal === id ? "bg-corp-accent text-white" : "bg-corp-bg-secondary text-corp-text-secondary"}`}>
                      {id}
                    </button>
                  ))}
                </div>
                <div className="p-4 rounded-xl bg-corp-bg-secondary space-y-2 text-xs font-mono">
                  <p className="font-bold text-corp-accent">=XLOOKUP(&quot;{lookupVal}&quot;, Employees[ID], Employees[Salary])</p>
                  {lookupResult && (
                    <p style={{ color: "var(--corp-text)" }}>Result: <strong>{lookupResult.name}</strong> ({lookupResult.role}, Salary: ${lookupResult.salary.toLocaleString()})</p>
                  )}
                </div>
              </div>
            )}

            {/* Custom NPV Simulator */}
            {lesson.hasSimulator === "npv" && (
              <div className="p-6 rounded-2xl space-y-4 border" style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}>
                <h3 className="text-sm font-bold" style={{ color: "var(--corp-text)" }}>Discounted Cash Flow (NPV) Calculator</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: "var(--corp-text)" }}>Initial Outflow ($)</label>
                    <input type="number" value={initialInv} onChange={(e) => setInitialInv(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border bg-corp-bg-secondary outline-none" style={{ color: "var(--corp-text)" }} />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: "var(--corp-text)" }}>Discount Rate / WACC (%)</label>
                    <input type="number" value={discountRate} onChange={(e) => setDiscountRate(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border bg-corp-bg-secondary outline-none" style={{ color: "var(--corp-text)" }} />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-corp-bg-secondary text-xs space-y-1">
                  <p className="font-bold">Calculated NPV: <span className="font-mono text-emerald-600 text-sm font-bold">${calcNpv?.toLocaleString()}</span></p>
                  <p className="text-[11px]" style={{ color: "var(--corp-text-tertiary)" }}>{calcNpv && calcNpv > 0 ? "Viable project! Yields exceed cost of capital." : "Unviable project."}</p>
                </div>
              </div>
            )}

            {/* Custom Solver Simulator */}
            {lesson.hasSimulator === "solver" && (
              <div className="p-6 rounded-2xl space-y-4 border" style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}>
                <h3 className="text-sm font-bold" style={{ color: "var(--corp-text)" }}>Product Mix Solver Optimizer</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: "var(--corp-text)" }}>Product A Quantity</label>
                    <input type="number" value={unitsA} onChange={(e) => setUnitsA(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border bg-corp-bg-secondary outline-none" style={{ color: "var(--corp-text)" }} />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: "var(--corp-text)" }}>Product B Quantity</label>
                    <input type="number" value={unitsB} onChange={(e) => setUnitsB(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border bg-corp-bg-secondary outline-none" style={{ color: "var(--corp-text)" }} />
                  </div>
                </div>
                <button onClick={handleRunSolver} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-corp-accent hover:bg-corp-accent-hover transition-all">
                  Run Optimization Solver
                </button>
                {solverFeedback && <div className="p-3.5 rounded-xl bg-corp-bg-secondary text-xs font-semibold">{solverFeedback}</div>}
              </div>
            )}

            {/* Custom Email Simulator */}
            {lesson.hasSimulator === "email" && (
              <div className="p-6 rounded-2xl space-y-4 border" style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}>
                <h3 className="text-sm font-bold" style={{ color: "var(--corp-text)" }}>Executive Email Template Generator</h3>
                <div className="p-4 rounded-xl bg-corp-bg-secondary text-xs font-mono space-y-2">
                  <p className="font-bold text-corp-accent">Subject: Collaboration Proposal ({emailIndustry.toUpperCase()})</p>
                  <p style={{ color: "var(--corp-text)" }}>Dear Executive,<br /><br />I reviewed your team's work in {emailIndustry}. Our framework boosts efficiency by 22%.<br /><br />Do you have 10 minutes next Tuesday at 2 PM for a quick call?<br /><br />Best regards,<br />[Your Name]</p>
                </div>
              </div>
            )}

            {/* Custom Resume ATS Simulator */}
            {lesson.hasSimulator === "resume" && (
              <div className="p-6 rounded-2xl space-y-4 border" style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}>
                <h3 className="text-sm font-bold" style={{ color: "var(--corp-text)" }}>ATS Resume Bullet Optimizer</h3>
                <textarea value={resumeBullet} onChange={(e) => setResumeBullet(e.target.value)}
                  className="w-full h-20 p-3 rounded-xl text-xs outline-none bg-corp-bg-secondary border resize-none" style={{ color: "var(--corp-text)" }} />
                <button onClick={handleAnalyzeBullet} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-corp-accent">
                  Analyze Bullet
                </button>
                {bulletScore !== null && <div className="p-3 rounded-xl bg-corp-bg-secondary text-xs">Score: <strong>{bulletScore}/100</strong> — {bulletAdvice}</div>}
              </div>
            )}

            {/* Custom STAR Simulator */}
            {lesson.hasSimulator === "star" && (
              <div className="p-6 rounded-2xl space-y-4 border" style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}>
                <h3 className="text-sm font-bold" style={{ color: "var(--corp-text)" }}>STAR Interview Response Builder</h3>
                <button onClick={handleAnalyzeStar} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-corp-accent">
                  Evaluate Response
                </button>
                {starScore !== null && <div className="p-3 rounded-xl bg-corp-bg-secondary text-xs">Score: <strong>{starScore}/100</strong> — {starAdvice}</div>}
              </div>
            )}

            {/* Custom Five Forces Simulator */}
            {lesson.hasSimulator === "forces" && (
              <div className="p-6 rounded-2xl space-y-4 border" style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}>
                <h3 className="text-sm font-bold" style={{ color: "var(--corp-text)" }}>Porter's Five Forces Strategy Builder</h3>
                <button onClick={handleAnalyzeForces} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-corp-accent">
                  Calculate Attractiveness Index
                </button>
                {forcesScore !== null && <div className="p-3 rounded-xl bg-corp-bg-secondary text-xs">Attractiveness: <strong>{forcesScore}/100</strong> — {forcesAdvice}</div>}
              </div>
            )}

            {/* UNIVERSAL EXCEL FORMULA & COMMAND CONSOLE SIMULATOR (Used for all standard lessons so NO lesson shows empty!) */}
            {(!lesson.hasSimulator || lesson.hasSimulator === "formula") && (
              <div className="p-6 md:p-8 rounded-3xl space-y-5 border shadow-sm" style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
                    <Terminal size={17} className="text-corp-accent" /> Live Interactive Excel Formula Sandbox
                  </h3>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                    Live Engine Active
                  </span>
                </div>
                <p className="text-xs" style={{ color: "var(--corp-text-secondary)" }}>
                  Type any Excel formula into the interactive formula bar below to execute calculations against the live corporate sample dataset.
                </p>

                {/* Sample Corporate Dataset Table */}
                <div className="relative group">
                  <div className="flex md:hidden items-center justify-between text-[10px] font-semibold text-corp-accent mb-1 px-1">
                    <span>Dataset Table</span>
                    <span>Scroll sideways ➔</span>
                  </div>
                  <div className="overflow-x-auto border rounded-2xl touch-pan-x" style={{ borderColor: "var(--corp-border)" }}>
                  <table className="w-full text-left text-xs">
                    <thead style={{ background: "var(--corp-bg-secondary)" }}>
                      <tr>
                        <th className="p-2.5 font-bold font-mono">Row</th>
                        <th className="p-2.5 font-bold">Product (Col A)</th>
                        <th className="p-2.5 font-bold">Region (Col B)</th>
                        <th className="p-2.5 font-bold">Units (Col C)</th>
                        <th className="p-2.5 font-bold">Unit Price (Col D)</th>
                        <th className="p-2.5 font-bold">Revenue (Col E)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-mono text-[11px]" style={{ borderColor: "var(--corp-border)" }}>
                      <tr><td className="p-2 font-bold text-corp-text-tertiary">2</td><td className="p-2">Laptop Pro</td><td className="p-2">North</td><td className="p-2">150</td><td className="p-2">$350</td><td className="p-2 font-bold text-emerald-600">$52,500</td></tr>
                      <tr><td className="p-2 font-bold text-corp-text-tertiary">3</td><td className="p-2">Tablet Ultra</td><td className="p-2">South</td><td className="p-2">300</td><td className="p-2">$120</td><td className="p-2 font-bold text-emerald-600">$36,000</td></tr>
                      <tr><td className="p-2 font-bold text-corp-text-tertiary">4</td><td className="p-2">Smart Monitor</td><td className="p-2">North</td><td className="p-2">200</td><td className="p-2">$180</td><td className="p-2 font-bold text-emerald-600">$36,000</td></tr>
                      <tr><td className="p-2 font-bold text-corp-text-tertiary">5</td><td className="p-2">Wireless Mouse</td><td className="p-2">East</td><td className="p-2">500</td><td className="p-2">$40</td><td className="p-2 font-bold text-emerald-600">$20,000</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

                {/* Formula Bar Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold" style={{ color: "var(--corp-text)" }}>Excel Formula Bar</label>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center px-3 py-2 rounded-xl border bg-corp-bg-secondary" style={{ borderColor: "var(--corp-border)" }}>
                      <span className="text-xs font-bold text-corp-accent font-mono mr-2">fx</span>
                      <input
                        type="text"
                        value={userFormula}
                        onChange={(e) => setUserFormula(e.target.value)}
                        placeholder="Type formula (e.g. =SUM(E2:E5), =AVERAGE(C2:C5), =MAX(E2:E5))..."
                        className="w-full bg-transparent outline-none text-xs font-mono"
                        style={{ color: "var(--corp-text)" }}
                      />
                    </div>
                    <button
                      onClick={() => handleRunFormulaConsole()}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-corp-accent hover:bg-corp-accent-hover transition-all"
                    >
                      Execute Formula
                    </button>
                  </div>
                </div>

                {/* Preset Formula Quick Buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[11px] font-semibold self-center" style={{ color: "var(--corp-text-tertiary)" }}>Presets:</span>
                  {[
                    "=SUM(E2:E5)",
                    "=AVERAGE(C2:C5)",
                    '=XLOOKUP("Laptop Pro", A2:A5, E2:E5)',
                    '=IF(E2>50000, "Target Exceeded", "Standard")',
                    "=MAX(E2:E5)"
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => { setUserFormula(preset); handleRunFormulaConsole(preset); }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all hover:bg-corp-accent/15"
                      style={{ background: "var(--corp-bg-secondary)", color: "var(--corp-text-secondary)", border: "1px solid var(--corp-border)" }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Result Display Box */}
                <div className="p-4 rounded-2xl bg-corp-bg-secondary space-y-1.5 text-xs font-mono border" style={{ borderColor: "var(--corp-border)" }}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-corp-text-tertiary uppercase text-[10px]">Evaluated Result</span>
                    <span className="text-[10px] text-emerald-600 font-bold">{formulaOutput.type}</span>
                  </div>
                  <p className="text-base font-bold text-corp-accent">{formulaOutput.result}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. Quiz Tab */}
        {activeTab === "quiz" && (
          <div className="p-6 md:p-8 rounded-xl space-y-5 border-2 border-[#10b981]/50 shadow-[6px_6px_0px_0px_rgba(16,185,129,0.25)]" style={{ background: "var(--corp-surface)" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold tracking-tight font-mono uppercase" style={{ color: "var(--corp-text)" }}>Lesson Knowledge Assessment</h3>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-[#10b981] text-emerald-950 font-mono shadow-sm">
                +{lesson.xpReward} XP Quiz
              </span>
            </div>

            <p className="text-xs md:text-sm leading-relaxed font-bold" style={{ color: "var(--corp-text)" }}>
              {lesson.quiz.question}
            </p>

            <div className="space-y-3 pt-2">
              {lesson.quiz.options.map((opt, idx) => (
                <button
                  key={idx}
                  disabled={quizSubmitted}
                  onClick={() => setSelectedAnswer(idx)}
                  className={`w-full flex items-start gap-3.5 p-4 rounded-lg text-left text-xs font-extrabold transition-all border-2 ${
                    selectedAnswer === idx ? "border-[#10b981] bg-[#10b981]/15 text-[#10b981] shadow-[3px_3px_0px_0px_rgba(16,185,129,0.3)]" : "border-corp-border bg-corp-bg-secondary text-corp-text hover:border-[#10b981]/60"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs flex-shrink-0 font-extrabold border border-emerald-500 ${
                    selectedAnswer === idx ? "bg-[#10b981] text-emerald-950" : "bg-corp-border text-corp-text-secondary"
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t-2 border-corp-border flex flex-col gap-4">
              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={selectedAnswer === null}
                  className="w-full py-3.5 rounded-lg text-xs font-extrabold text-emerald-950 bg-[#10b981] hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-[4px_4px_0px_0px_#064e3b] border-2 border-emerald-400 uppercase font-mono tracking-wider"
                >
                  Submit & Verify Answer
                </button>
              ) : (
                <div className="space-y-3">
                  {quizSuccess ? (
                    <div className="p-4 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-start gap-3 border-2 border-emerald-600">
                      <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-extrabold text-xs font-mono">Correct Answer! +{lesson.xpReward} XP Earned</p>
                        <p className="text-xs leading-relaxed mt-1 font-medium">{lesson.quiz.explanation}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-red-500/15 text-red-600 flex items-start gap-3 border-2 border-red-600">
                      <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-extrabold text-xs font-mono">Incorrect Option Selected</p>
                        <p className="text-xs leading-relaxed mt-1 font-medium">Review the reading notes and formula parameters, then retry.</p>
                        <button onClick={() => { setQuizSubmitted(false); setSelectedAnswer(null); }} className="mt-2 text-xs font-extrabold underline hover:text-red-700 font-mono">
                          Try Again
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating XP Gain overlay */}
      <AnimatePresence>
        {showXPPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-[99999] p-4"
            onClick={() => setShowXPPopup(false)}
          >
            <div className="glass-strong rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-amber-500/30" onClick={(e) => e.stopPropagation()}>
              <div className="w-16 h-16 rounded-full bg-corp-accent/20 flex items-center justify-center mx-auto text-[32px] animate-bounce">
                🎉
              </div>
              <h2 className="text-xl font-bold" style={{ color: "var(--corp-text)" }}>Lesson Passed!</h2>
              <p className="text-xs" style={{ color: "var(--corp-text-secondary)" }}>
                You have successfully completed this lesson module and earned:
              </p>
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-base font-extrabold bg-[#C9A84C]/20 text-[#D97706] font-mono border border-[#C9A84C]/40">
                +{lesson.xpReward} XP
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setShowXPPopup(false)}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-corp-accent hover:bg-corp-accent-hover transition-colors"
                >
                  Continue Learning
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
