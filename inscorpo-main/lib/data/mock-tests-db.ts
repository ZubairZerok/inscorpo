export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: "Quant" | "Verbal" | "Analytical" | "Finance" | "Excel" | "General Knowledge";
}

export interface MockTestDetail {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  durationMins: number;
  negativeMarking: number; // e.g. 0.25 or 0
  xpReward: number;
  description: string;
  questions: Question[];
}

export const MOCK_TESTS_DATABASE: Record<string, MockTestDetail> = {
  "bb-ad-full-mock": {
    id: "bb-ad-full-mock",
    title: "Bangladesh Bank AD Full Length Mock Test",
    category: "Banking",
    difficulty: "Advanced",
    durationMins: 15,
    negativeMarking: 0.25,
    xpReward: 250,
    description: "Official pattern test covering Monetary Policy, CRR/SLR regulations, Quantitative Aptitude, and Financial Sector Economics.",
    questions: [
      {
        id: 1,
        question: "If a commercial bank in Bangladesh has total demand and time liabilities (TDTL) of ৳500 crore and the CRR is 4.0%, how much cash must be kept on deposit with Bangladesh Bank?",
        options: ["৳12 crore", "৳20 crore", "৳25 crore", "৳50 crore"],
        correct: 1,
        explanation: "Cash Reserve Ratio (CRR) = TDTL × CRR rate. ৳500 crore × 0.04 = ৳20 crore.",
        category: "Finance"
      },
      {
        id: 2,
        question: "Which monetary policy tool directly reduces liquidity in the banking system by selling government securities?",
        options: ["Repo Rate reduction", "Open Market Operations (OMO)", "Lowering Statutory Liquidity Ratio", "Export Facilitation Fund expansion"],
        correct: 1,
        explanation: "Open Market Operations (OMO) involving the sale of government bills/bonds absorbs excess liquidity from commercial banks.",
        category: "Finance"
      },
      {
        id: 3,
        question: "A project requires an initial outlay of ৳1,000,000 and generates cash flows of ৳400,000 in Year 1, ৳500,000 in Year 2, and ৳300,000 in Year 3. What is the payback period?",
        options: ["2.0 years", "2.33 years", "2.5 years", "3.0 years"],
        correct: 1,
        explanation: "After 2 years, cumulative cash flow is ৳400,000 + ৳500,000 = ৳900,000. Remaining needed = ৳100,000. Payback = 2 + (100,000 / 300,000) = 2.33 years.",
        category: "Quant"
      },
      {
        id: 4,
        question: "Under the Basel III capital requirements enforced by Bangladesh Bank, what is the minimum Capital to Risk-weighted Assets Ratio (CRAR)?",
        options: ["8.0%", "10.0%", "12.5%", "15.0%"],
        correct: 1,
        explanation: "Bangladesh Bank mandates a minimum CRAR of 10.0% of total Risk-Weighted Assets (RWA) under Basel III guidelines.",
        category: "Finance"
      },
      {
        id: 5,
        question: "What is the simplified compound interest earned on ৳50,000 at 8% per annum compounded annually for 2 years?",
        options: ["৳8,000", "৳8,320", "৳8,500", "৳9,200"],
        correct: 1,
        explanation: "Amount = 50,000 × (1.08)^2 = 50,000 × 1.1664 = ৳58,320. Interest = 58,320 - 50,000 = ৳8,320.",
        category: "Quant"
      }
    ]
  },

  "mt-assessment-cognitive": {
    id: "mt-assessment-cognitive",
    title: "Corporate Management Trainee (MTO) Cognitive Aptitude Test",
    category: "Corporate",
    difficulty: "Advanced",
    durationMins: 12,
    negativeMarking: 0.25,
    xpReward: 300,
    description: "High-speed assessment modeled after Unilever, BAT, and Grameenphone MTO initial screening tests (Numerical reasoning, logical deduction & business case analytics).",
    questions: [
      {
        id: 1,
        question: "A company's quarterly revenue increased by 15% from Q1 to Q2, then decreased by 10% in Q3. If Q1 revenue was $2.0 Million, what was the revenue in Q3?",
        options: ["$2.07 Million", "$2.10 Million", "$2.20 Million", "$2.30 Million"],
        correct: 0,
        explanation: "Q2 Revenue = 2.0 × 1.15 = $2.30M. Q3 Revenue = 2.30 × 0.90 = $2.07 Million.",
        category: "Quant"
      },
      {
        id: 2,
        question: "Complete the numerical pattern: 4, 9, 19, 39, 79, ?",
        options: ["119", "139", "159", "179"],
        correct: 2,
        explanation: "Pattern rule: Each term is (previous × 2) + 1. (79 × 2) + 1 = 158 + 1 = 159.",
        category: "Analytical"
      },
      {
        id: 3,
        question: "If 6 FMCG brand managers can create 12 marketing campaigns in 4 days, how many campaigns can 9 brand managers create in 6 days?",
        options: ["18 campaigns", "24 campaigns", "27 campaigns", "36 campaigns"],
        correct: 2,
        explanation: "Rate = 12 / (6 × 4) = 0.5 campaigns per manager per day. Total = 9 × 6 × 0.5 = 27 campaigns.",
        category: "Quant"
      },
      {
        id: 4,
        question: "Identify the word that is MOST nearly opposite in meaning to 'PRUDENT':",
        options: ["Cautious", "Reckless", "Judicious", "Frugal"],
        correct: 1,
        explanation: "Prudent means wise and careful. Reckless means careless and rash, making it the exact antonym.",
        category: "Verbal"
      },
      {
        id: 5,
        question: "If ALL FMCG products require quality control, and Product X is a laundry detergent, which statement MUST be true?",
        options: [
          "Product X is guaranteed to be a market leader.",
          "Product X requires quality control.",
          "Product X has a higher margin than food products.",
          "Product X does not need regulatory clearance."
        ],
        correct: 1,
        explanation: "Since Product X is an FMCG product and ALL FMCG products require quality control, Product X MUST require quality control.",
        category: "Analytical"
      }
    ]
  },

  "gre-quant-adaptive": {
    id: "gre-quant-adaptive",
    title: "GRE Quantitative Section Practice Test",
    category: "GRE",
    difficulty: "Advanced",
    durationMins: 15,
    negativeMarking: 0,
    xpReward: 200,
    description: "Adaptive Quantitative Reasoning test covering Problem Solving, Quantitative Comparisons, Algebra, and Coordinate Geometry.",
    questions: [
      {
        id: 1,
        question: "If 3x + 7 = 22 and 4y - 5 = 15, what is the value of (x + y)^2?",
        options: ["64", "81", "100", "121"],
        correct: 2,
        explanation: "3x = 15 => x = 5. 4y = 20 => y = 5. (x + y)^2 = (5 + 5)^2 = 10^2 = 100.",
        category: "Quant"
      },
      {
        id: 2,
        question: "Quantity A: The area of a circle with radius 6.\nQuantity B: The area of a square with perimeter 24.",
        options: [
          "Quantity A is greater.",
          "Quantity B is greater.",
          "The two quantities are equal.",
          "The relationship cannot be determined."
        ],
        correct: 0,
        explanation: "Quantity A = π × (6^2) = 36π ≈ 113.1. Quantity B: Side = 24/4 = 6. Area = 6^2 = 36. Thus Quantity A (113.1) is greater than Quantity B (36).",
        category: "Quant"
      },
      {
        id: 3,
        question: "In a class of 40 students, 25 study Economics and 20 study Finance. If 10 students study both, how many students study NEITHER subject?",
        options: ["5", "10", "15", "20"],
        correct: 0,
        explanation: "Students in at least one subject = 25 + 20 - 10 = 35. Neither = Total - 35 = 40 - 35 = 5.",
        category: "Quant"
      },
      {
        id: 4,
        question: "What is the arithmetic mean (average) of the first 10 positive even integers?",
        options: ["10", "11", "12", "14"],
        correct: 1,
        explanation: "First 10 even integers: 2, 4, 6, ..., 20. Sum = 10 × 11 = 110. Average = 110 / 10 = 11.",
        category: "Quant"
      }
    ]
  },

  "gmat-data-insights": {
    id: "gmat-data-insights",
    title: "GMAT Focus Edition Data Insights Mock",
    category: "GMAT",
    difficulty: "Advanced",
    durationMins: 15,
    negativeMarking: 0,
    xpReward: 250,
    description: "Evaluates multi-source reasoning, table analysis, graph interpretation, and two-part problem solving for 700+ percentile aspirants.",
    questions: [
      {
        id: 1,
        question: "Company A reported revenue of $80M in 2024 with a operating margin of 25%. Company B reported revenue of $120M with an operating margin of 15%. Which company generated higher absolute operating profit?",
        options: [
          "Company A ($20M)",
          "Company B ($18M)",
          "Both generated equal operating profit",
          "Cannot be determined"
        ],
        correct: 0,
        explanation: "Company A Operating Profit = $80M × 0.25 = $20M. Company B Operating Profit = $120M × 0.15 = $18M. Company A generated $2M higher profit.",
        category: "Finance"
      },
      {
        id: 2,
        question: "If a portfolio contains 60% equities and 40% fixed income bonds, and equity returns are +12% while bond returns are +4%, what is the weighted portfolio return?",
        options: ["8.0%", "8.8%", "9.2%", "10.0%"],
        correct: 1,
        explanation: "Weighted Return = (0.60 × 12%) + (0.40 × 4%) = 7.2% + 1.6% = 8.8%.",
        category: "Finance"
      },
      {
        id: 3,
        question: "Which of the following data conditions is SUFFICIENT to calculate the compound annual growth rate (CAGR) of a company's sales?",
        options: [
          "Knowing the total sales in Year 1 only.",
          "Knowing the sales in Year 1, sales in Year 5, and total number of elapsed years.",
          "Knowing the annual average profit margin.",
          "Knowing the dividend yield over 5 years."
        ],
        correct: 1,
        explanation: "CAGR = (Ending Value / Beginning Value)^(1 / n) - 1. Knowing initial value, final value, and number of years 'n' provides all required terms.",
        category: "Finance"
      }
    ]
  },

  "excel-financial-master": {
    id: "excel-financial-master",
    title: "Excel Formulas & Financial Analytics Speed Test",
    category: "Excel",
    difficulty: "Intermediate",
    durationMins: 10,
    negativeMarking: 0.25,
    xpReward: 200,
    description: "Test your mastery of lookup formulas (VLOOKUP, INDEX/MATCH, XLOOKUP), financial functions (NPV, IRR), and nested IF statements.",
    questions: [
      {
        id: 1,
        question: "Which Excel formula correctly retrieves the value in Column C where the lookup value in Cell A2 matches Column A?",
        options: [
          "=VLOOKUP(A2, A:C, 3, FALSE)",
          "=VLOOKUP(A2, A:C, 2, TRUE)",
          "=INDEX(A:A, MATCH(A2, C:C, 0))",
          "=LOOKUP(A2, C:C, A:A)"
        ],
        correct: 0,
        explanation: "=VLOOKUP(A2, A:C, 3, FALSE) looks up A2 in the 1st column of A:C and returns the value from the 3rd column (Column C) with exact match.",
        category: "Excel"
      },
      {
        id: 2,
        question: "In financial modeling, what does the formula '=NPV(0.10, B2:B6) + B1' calculate if B1 is initial investment (negative cash flow)?",
        options: [
          "Internal Rate of Return (IRR)",
          "Net Present Value at a 10% discount rate",
          "Modified Duration of a Bond",
          "Weighted Average Cost of Capital"
        ],
        correct: 1,
        explanation: "=NPV(rate, future_cash_flows) + initial_outlay calculates the true Net Present Value (NPV) of a project discounted at 10%.",
        category: "Excel"
      },
      {
        id: 3,
        question: "Which shortcut key combination opens the 'Format Cells' dialog box in Microsoft Excel on Windows?",
        options: ["Ctrl + F", "Ctrl + 1", "Alt + F4", "Ctrl + Shift + F"],
        correct: 1,
        explanation: "Ctrl + 1 is the standard global keyboard shortcut to launch the Format Cells dialog window in Excel.",
        category: "Excel"
      }
    ]
  }
};
