export interface DiagnosticQuestion {
  id: number;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

export interface ChallengeDatasetRow {
  [key: string]: string | number;
}

export interface Challenge {
  id: string;
  title: string;
  hostEntity: string;
  category: "Data Science" | "Corporate Analytics" | "AI Engineering" | "Business Case" | "Automation" | "SQL & BI" | "Software Development" | "Strategy & Planning";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: "Active" | "Finished";
  duration: string; // e.g. "1 hour challenge"
  prize: string; // e.g. "Prizes worth ৳1,20,000 + PPI Offer"
  participants: number;
  description: string;
  tags: string[];
  teamSize: string; // e.g. "1 - 4 Members" or "Individual"
  fee: string; // e.g. "Free" or "৳400 Fee"
  location: string; // e.g. "Online" or "Dhaka"
  ppoOffered?: boolean;
  daysLeft?: string;
  registeredCount: number;
  datasetHeaders?: string[];
  datasetRows?: ChallengeDatasetRow[];
  diagnosticQuestions?: DiagnosticQuestion[];
  casePrompt?: string;
  benchmarkSolution?: string;
  hints?: string[];
}

export const challengesData: Challenge[] = [
  {
    id: "hul-techtonic-season-8",
    title: "HUL TechTonic Season 8 — Corporate Supply Chain & Market Research",
    hostEntity: "Hindustan Unilever Limited (HUL)",
    category: "Strategy & Planning",
    difficulty: "Advanced",
    status: "Active",
    duration: "2 weeks",
    prize: "Pre-Placement Offers (PPOs) + ৳3,00,000 Prize Pool",
    participants: 14500,
    description: "Solve high-stakes FMCG supply chain bottlenecks, optimize last-mile retail distribution networks, and present market entry frameworks to senior HUL executives.",
    tags: ["FMCG", "Supply Chain", "PPO Offered", "Market Research", "Strategy"],
    teamSize: "2 - 3 Members",
    fee: "Free",
    location: "Online",
    ppoOffered: true,
    daysLeft: "23 days left",
    registeredCount: 53920,
    datasetHeaders: ["Distribution_Center", "Region", "Monthly_Units_Dispatched", "Fulfillment_Lead_Time_Hours", "Stockout_Rate_Percent", "Holding_Cost_BDT"],
    datasetRows: [
      { Distribution_Center: "DHAKA-NORTH-DC", Region: "Dhaka Metro", Monthly_Units_Dispatched: 450000, Fulfillment_Lead_Time_Hours: 14, Stockout_Rate_Percent: 4.2, Holding_Cost_BDT: 1850000 },
      { Distribution_Center: "CTG-PORT-HUB", Region: "Chittagong", Monthly_Units_Dispatched: 620000, Fulfillment_Lead_Time_Hours: 28, Stockout_Rate_Percent: 6.8, Holding_Cost_BDT: 2400000 },
      { Distribution_Center: "SYLHET-DEPOT", Region: "Sylhet", Monthly_Units_Dispatched: 180000, Fulfillment_Lead_Time_Hours: 36, Stockout_Rate_Percent: 8.1, Holding_Cost_BDT: 750000 },
      { Distribution_Center: "BOGURA-NORTH-CENTRAL", Region: "Rajshahi/North", Monthly_Units_Dispatched: 290000, Fulfillment_Lead_Time_Hours: 22, Stockout_Rate_Percent: 3.5, Holding_Cost_BDT: 1100000 },
    ],
    diagnosticQuestions: [
      {
        id: 1,
        question: "In FMCG last-mile retail networks, which strategy best mitigates the Bullwhip Effect caused by demand forecasting lag?",
        options: [
          "A) Increase safety stock buffers by 50% across all tier-3 retail points",
          "B) Implement Vendor-Managed Inventory (VMI) with real-time POS telemetry sharing",
          "C) Transition to batch-only shipments dispatched once per calendar month",
          "D) Eliminate secondary distribution hubs to ship directly from main factories"
        ],
        correct: "B) Implement Vendor-Managed Inventory (VMI) with real-time POS telemetry sharing",
        explanation: "VMI connected to POS telemetry provides real-time end-consumer demand visibility, eliminating order amplification up the supply chain."
      },
      {
        id: 2,
        question: "What primary trade-off must HUL balance when decentralizing warehouse inventory into micro-fulfillment hubs?",
        options: [
          "A) Higher transport costs vs lower customer satisfaction",
          "B) Reduced delivery lead-time vs increased fixed facility & inventory holding costs",
          "C) Lower SKU variety vs increased tax liabilities",
          "D) Zero safety stock vs maximum order fulfillment latency"
        ],
        correct: "B) Reduced delivery lead-time vs increased fixed facility & inventory holding costs",
        explanation: "Micro-fulfillment brings stock closer to retail points (reducing lead time) but duplicates safety stock and increases warehouse rent."
      }
    ],
    casePrompt: "Evaluate the telemetry dataset above. Propose a re-allocation strategy for Chittagong & Sylhet hubs to drop overall stockout rates below 3.5% while minimizing annual holding cost expansion.",
    benchmarkSolution: "HUL Benchmark Solution: Implement cross-docking from CTG Port Hub directly to Sylhet Depot on 48-hour rolling schedules. Reallocating 80,000 units reduces Sylhet stockout from 8.1% to 2.9%, cutting combined holding cost by ৳420,000/month.",
    hints: [
      "Calculate stockout penalty cost vs extra transit cost for Sylhet Depot.",
      "Consider cross-docking frequency between Chittagong Port Hub and nearby regional depots."
    ]
  },
  {
    id: "accenture-innovation-challenge-2026",
    title: "Accenture Applied AI & Innovation Challenge 2026",
    hostEntity: "Accenture Digital",
    category: "AI Engineering",
    difficulty: "Advanced",
    status: "Active",
    duration: "3 weeks",
    prize: "Pre-Placement Interviews (PPIs) + ৳2,50,000 Cash Pool",
    participants: 18200,
    description: "Design innovative Generative AI workflows, multi-agent automated customer assistants, and enterprise data analytics pipelines for modern MNC clients.",
    tags: ["Applied AI", "Generative AI", "PPI Offered", "Software Development"],
    teamSize: "1 - 3 Members",
    fee: "Free",
    location: "Online",
    ppoOffered: true,
    daysLeft: "19 days left",
    registeredCount: 38400,
    datasetHeaders: ["Agent_Name", "Model_Architecture", "P99_Latency_ms", "Context_Window_Tokens", "Hallucination_Rate", "Cost_Per_1k_Calls_USD"],
    datasetRows: [
      { Agent_Name: "Customer-Support-Bot", Model_Architecture: "Llama-3.3-70B (Quantized)", P99_Latency_ms: 680, Context_Window_Tokens: 128000, Hallucination_Rate: "0.8%", Cost_Per_1k_Calls_USD: 0.45 },
      { Agent_Name: "Invoice-Audit-Agent", Model_Architecture: "GPT-4o-Mini + RAG", P99_Latency_ms: 1200, Context_Window_Tokens: 64000, Hallucination_Rate: "0.2%", Cost_Per_1k_Calls_USD: 1.20 },
      { Agent_Name: "Code-Synthesis-Agent", Model_Architecture: "DeepSeek-R1-Distill", P99_Latency_ms: 2400, Context_Window_Tokens: 32000, Hallucination_Rate: "1.4%", Cost_Per_1k_Calls_USD: 0.80 },
    ],
    diagnosticQuestions: [
      {
        id: 1,
        question: "When deploying multi-agent LLM systems for enterprise client workflows, which architectural pattern prevents infinite agent loop execution?",
        options: [
          "A) Cyclic prompt chain without token limit",
          "B) Directed Acyclic Graph (DAG) orchestration with maximum step budget & guardrails",
          "C) Direct end-user message reflection with zero fallback state",
          "D) Temperature set to 2.0 on all downstream agent calls"
        ],
        correct: "B) Directed Acyclic Graph (DAG) orchestration with maximum step budget & guardrails",
        explanation: "DAG-based execution flow enforces deterministic node transitions and hard step budgets to prevent runaway agent recursion."
      },
      {
        id: 2,
        question: "How can Retrieval-Augmented Generation (RAG) latency be minimized for high-throughput enterprise APIs?",
        options: [
          "A) Perform full-table text scans on un-indexed MySQL text columns on every query",
          "B) Use hybrid vector search (HNSW index) with Semantic Caching (e.g. Redis)",
          "C) Increase chunk size to 100,000 tokens per embedding block",
          "D) Query the raw embedding API synchronously inside the main render thread"
        ],
        correct: "B) Use hybrid vector search (HNSW index) with Semantic Caching (e.g. Redis)",
        explanation: "HNSW vector indexing paired with semantic caching returns pre-computed responses for frequent sub-queries, cutting latency to <50ms."
      }
    ],
    casePrompt: "Formulate an enterprise multi-agent architecture for automated invoice verification. Detail how context windowing, RAG vector search, and fallback rules will ensure <0.5% error rate while handling 50,000 daily documents.",
    benchmarkSolution: "Accenture Benchmark Solution: Employ a 3-stage agent pipeline: (1) Layout-aware OCR Parser with structured schema validation, (2) Vector Retrieval against NBR tax compliance DB using Redis HNSW, (3) Llama-3.3 fallback evaluator. Achieves 99.7% precision at $0.08 per 100 invoices.",
    hints: [
      "Detail guardrails for schema enforcement (e.g., Zod or Instructor JSON validation).",
      "Mention semantic caching to reduce recurring LLM inference costs."
    ]
  },
  {
    id: "fmcg-inventory-optimization",
    title: "FMCG Inventory Optimization & Safety Stock Challenge",
    hostEntity: "British American Tobacco & INSYT",
    category: "Corporate Analytics",
    difficulty: "Intermediate",
    status: "Active",
    duration: "1 hour challenge",
    prize: "৳50,000 GIFT CARD + Executive Certification",
    participants: 1420,
    description: "Analyze 100,000 SKU movement logs across 40 distribution centers in Bangladesh to calculate optimal reorder points and reduce holding costs.",
    tags: ["Excel", "Supply Chain", "FMCG", "Inventory"],
    teamSize: "1 - 4 Members",
    fee: "Free",
    location: "Online",
    registeredCount: 12304,
    daysLeft: "21 days left",
    datasetHeaders: ["SKU_ID", "Warehouse_ID", "Monthly_Demand_Units", "Lead_Time_Days", "Unit_Cost_BDT", "Safety_Stock_Recommended"],
    datasetRows: [
      { SKU_ID: "SKU-1001", Warehouse_ID: "DHAKA-CENTRAL", Monthly_Demand_Units: 45000, Lead_Time_Days: 12, Unit_Cost_BDT: 350, Safety_Stock_Recommended: 5400 },
      { SKU_ID: "SKU-1002", Warehouse_ID: "CTG-PORT", Monthly_Demand_Units: 82000, Lead_Time_Days: 18, Unit_Cost_BDT: 1200, Safety_Stock_Recommended: 12300 },
      { SKU_ID: "SKU-1003", Warehouse_ID: "GAZIPUR-RMG", Monthly_Demand_Units: 120000, Lead_Time_Days: 7, Unit_Cost_BDT: 450, Safety_Stock_Recommended: 9600 },
      { SKU_ID: "SKU-1004", Warehouse_ID: "RAJSHAHI-NORTH", Monthly_Demand_Units: 28000, Lead_Time_Days: 14, Unit_Cost_BDT: 280, Safety_Stock_Recommended: 3100 },
      { SKU_ID: "SKU-1005", Warehouse_ID: "KHULNA-SOUTH", Monthly_Demand_Units: 51000, Lead_Time_Days: 15, Unit_Cost_BDT: 620, Safety_Stock_Recommended: 7800 },
    ],
    diagnosticQuestions: [
      {
        id: 1,
        question: "For SKU-1001 at Dhaka Central (Monthly demand = 45,000 units, Lead time = 12 days, 30 days/month), what is the baseline Lead Time Demand before adding Safety Stock?",
        options: [
          "A) 18,000 units",
          "B) 45,000 units",
          "C) 15,000 units",
          "D) 22,500 units"
        ],
        correct: "A) 18,000 units",
        explanation: "Daily demand = 45,000 / 30 = 1,500 units/day. Lead Time Demand = 1,500 × 12 = 18,000 units."
      },
      {
        id: 2,
        question: "What is the Reorder Point (ROP) for SKU-1001 when combining Lead Time Demand (18,000) and Recommended Safety Stock (5,400)?",
        options: [
          "A) 18,000 units",
          "B) 23,400 units",
          "C) 50,400 units",
          "D) 12,600 units"
        ],
        correct: "B) 23,400 units",
        explanation: "ROP = Lead Time Demand + Safety Stock = 18,000 + 5,400 = 23,400 units."
      }
    ],
    casePrompt: "Write a 3-4 sentence executive recommendation for BAT supply chain managers detailing how optimizing the Reorder Point (ROP) for SKU-1001 to 23,400 units reduces stockouts while saving working capital across regional hubs.",
    benchmarkSolution: "BAT Benchmark Solution: Reorder Point for SKU-1001 is established at 23,400 units (18,000 units lead-time demand + 5,400 safety stock). By applying dynamic Z-score safety stock scaling (95% service level), capital tied up in holding costs drops by ৳1.4M annually with 0 stockout events.",
    hints: [
      "Calculate daily demand by dividing monthly demand by 30 days.",
      "Formula: Reorder Point = (Daily Demand × Lead Time) + Safety Stock."
    ]
  },
  {
    id: "asian-paints-alchemy-2026",
    title: "Asian Paints Alchemy Strategy & Analytics Challenge 2026",
    hostEntity: "Asian Paints",
    category: "Strategy & Planning",
    difficulty: "Intermediate",
    status: "Active",
    duration: "1 month",
    prize: "Pre-Placement Interviews (PPIs) + ৳1,50,000 Cash Prize",
    participants: 11509,
    description: "Formulate data-driven market expansion strategies for premium decorative paint segments across emerging South Asian urban hubs.",
    tags: ["Strategy", "Analytics", "Postgraduate", "Undergraduate"],
    teamSize: "1 - 2 Members",
    fee: "Free",
    location: "Online",
    ppoOffered: true,
    daysLeft: "2 months left",
    registeredCount: 11509,
    datasetHeaders: ["City_Hub", "Household_Income_Tier", "Annual_Paint_Demand_Liters", "Dealer_Network_Count", "Market_Share_Percent"],
    datasetRows: [
      { City_Hub: "Dhaka East (Uttara/Purbachal)", Household_Income_Tier: "Upper Middle", Annual_Paint_Demand_Liters: 1200000, Dealer_Network_Count: 84, Market_Share_Percent: 34 },
      { City_Hub: "Chittagong Panchlaish", Household_Income_Tier: "High", Annual_Paint_Demand_Liters: 850000, Dealer_Network_Count: 52, Market_Share_Percent: 29 },
      { City_Hub: "Sylhet Zindabazar", Household_Income_Tier: "NRB / Remittance", Annual_Paint_Demand_Liters: 640000, Dealer_Network_Count: 41, Market_Share_Percent: 42 },
    ],
    diagnosticQuestions: [
      {
        id: 1,
        question: "Which market entry model best captures dealer loyalty in emerging tier-2 paint markets?",
        options: [
          "A) Exclusive dealer tinting machine financing with volume rebates",
          "B) Direct-to-consumer e-commerce shipping with 14-day delivery",
          "C) Unbranded bulk supply to localized contractors",
          "D) TV advertising without localized trade promotional support"
        ],
        correct: "A) Exclusive dealer tinting machine financing with volume rebates",
        explanation: "Color tinting machines lock in dealer exclusivity while volume rebates incentivize high throughput."
      }
    ],
    casePrompt: "Present a strategic plan to increase Asian Paints market share in Chittagong Panchlaish from 29% to 40% through targeted dealer network expansion.",
    benchmarkSolution: "Asian Paints Benchmark: Deploy 25 additional automated tinting units, partner with top interior decorator associations, and launch 48-hour direct dealer delivery.",
    hints: ["Focus on dealer incentives and tinting machine placement."]
  },
  {
    id: "bkash-mfs-fraud-detection",
    title: "Detecting Anomalous MFS Transactions & Account Takeovers",
    hostEntity: "bKash FinTech Division",
    category: "Data Science",
    difficulty: "Advanced",
    status: "Active",
    duration: "3 hour challenge",
    prize: "$1,000 USD + Direct Interview Referral",
    participants: 2150,
    description: "Build an anomaly detection model on anonymized MFS transaction logs to spot cash-out velocity spikes and suspicious agent network loops.",
    tags: ["Python", "Fraud Detection", "MFS", "FinTech"],
    teamSize: "1 - 2 Members",
    fee: "Free",
    location: "Online",
    ppoOffered: true,
    daysLeft: "14 days left",
    registeredCount: 8920,
    datasetHeaders: ["Txn_ID", "User_ID", "Agent_ID", "Amount_BDT", "Time_Delta_Sec", "Velocity_Score", "Risk_Flag"],
    datasetRows: [
      { Txn_ID: "TXN-9901", User_ID: "USR-401", Agent_ID: "AGT-102", Amount_BDT: 25000, Time_Delta_Sec: 14, Velocity_Score: 8.9, Risk_Flag: "SUSPICIOUS" },
      { Txn_ID: "TXN-9902", User_ID: "USR-401", Agent_ID: "AGT-108", Amount_BDT: 25000, Time_Delta_Sec: 22, Velocity_Score: 9.4, Risk_Flag: "SUSPICIOUS" },
      { Txn_ID: "TXN-9903", User_ID: "USR-882", Agent_ID: "AGT-501", Amount_BDT: 1500, Time_Delta_Sec: 4500, Velocity_Score: 0.2, Risk_Flag: "NORMAL" },
    ],
    diagnosticQuestions: [
      {
        id: 1,
        question: "What feature transformation is most effective for detecting rapid consecutive cash-outs on MFS networks?",
        options: [
          "A) Rolling time-window transaction count and agent ID entropy",
          "B) Customer account creation year alone",
          "C) Total phone battery level at transaction time",
          "D) Alphabetical sorting of user names"
        ],
        correct: "A) Rolling time-window transaction count and agent ID entropy",
        explanation: "Rolling velocity (e.g. 5 cash-outs within 60 seconds) combined with agent node entropy isolates fraudulent automated loops."
      }
    ],
    casePrompt: "Outline an ML pipeline architecture (e.g. XGBoost + Isolation Forest) that processes 5,000 transaction events/sec with sub-50ms inference latency.",
    benchmarkSolution: "bKash Benchmark Solution: Feature engineering with Kafka rolling windows, lightweight XGBoost scoring on ONNX Runtime, achieving 99.4% ROC-AUC with 32ms P99 latency.",
    hints: ["Focus on feature engineering: velocity, time delta between transactions, and agent dispersion."]
  },
  {
    id: "bangla-ocr-invoice-extraction",
    title: "Bangla OCR & Mushak 6.3 Automated VAT Pipeline",
    hostEntity: "BAUBC Analytics & NBR Tech",
    category: "Automation",
    difficulty: "Advanced",
    status: "Active",
    duration: "2 hour challenge",
    prize: "৳30,000 GIFT CARD + INSYT Pro Lifetime Pass",
    participants: 980,
    description: "Build an n8n webhook workflow that extracts scanned handwritten Bangla invoices, validates NBR Mushak 6.3 VAT tax IDs, and posts clean JSON payload.",
    tags: ["n8n", "Bangla OCR", "NBR VAT", "Webhooks"],
    teamSize: "Individual",
    fee: "Free",
    location: "Online",
    registeredCount: 4510,
    daysLeft: "10 days left",
    datasetHeaders: ["Invoice_ID", "Supplier_BIN", "Total_VAT_BDT", "OCR_Confidence_Score", "Validation_Status"],
    datasetRows: [
      { Invoice_ID: "INV-2026-001", Supplier_BIN: "18294029102", Total_VAT_BDT: 4500, OCR_Confidence_Score: "94.2%", Validation_Status: "VALIDATED" },
      { Invoice_ID: "INV-2026-002", Supplier_BIN: "99102930192", Total_VAT_BDT: 12300, OCR_Confidence_Score: "81.0%", Validation_Status: "BIN_MISMATCH" },
    ],
    diagnosticQuestions: [
      {
        id: 1,
        question: "Which NBR tax rule must be verified when processing Mushak 6.3 VAT documents?",
        options: [
          "A) 11-digit Business Identification Number (BIN) mathematical checksum",
          "B) Personal passport number format",
          "C) SWIFT code validity",
          "D) Driving license expiration"
        ],
        correct: "A) 11-digit Business Identification Number (BIN) mathematical checksum",
        explanation: "NBR Mushak 6.3 tax forms require validating the 11-digit BIN format against official NBR database APIs."
      }
    ],
    casePrompt: "Design an n8n automated workflow trigger that accepts PDF invoice uploads, extracts text via vision models, checks NBR BIN API, and alerts on mismatch.",
    benchmarkSolution: "NBR Tech Benchmark: Webhook node -> Vision Model OCR node -> JS Regex BIN Extractor -> NBR API HTTP Request -> Slack/Email Alert node.",
    hints: ["Use structured JSON output parsing for the OCR step."]
  },
  {
    id: "fifa-world-cup-2026-prediction",
    title: "FIFA World Cup 2026 Prediction Challenge",
    hostEntity: "INSYT Sports Analytics Lab",
    category: "Data Science",
    difficulty: "Intermediate",
    status: "Finished",
    duration: "2 hour challenge",
    prize: "Official FIFA Jersey + Claude Pro subscription",
    participants: 6457,
    description: "Predict match outcomes and goal differentials for the 2026 FIFA World Cup using historical international squad metrics and player form indices.",
    tags: ["Predictive Analytics", "Sports Analytics", "Python"],
    teamSize: "Individual",
    fee: "Free",
    location: "Online",
    registeredCount: 6457,
    datasetHeaders: ["Match_ID", "Team_A", "Team_B", "Elo_Diff", "Predicted_Win_Prob_A"],
    datasetRows: [
      { Match_ID: "M-01", Team_A: "Argentina", Team_B: "Mexico", Elo_Diff: 145, Predicted_Win_Prob_A: "68.4%" },
      { Match_ID: "M-02", Team_A: "France", Team_B: "Japan", Elo_Diff: 120, Predicted_Win_Prob_A: "64.1%" },
    ],
    diagnosticQuestions: [
      {
        id: 1,
        question: "Which statistical distribution is standard for modeling goal counts in football analytics?",
        options: ["A) Poisson Distribution", "B) Normal Distribution", "C) Uniform Distribution", "D) Exponential Distribution"],
        correct: "A) Poisson Distribution",
        explanation: "Poisson regression models rare discrete event occurrences (goals) within fixed match time windows."
      }
    ],
    casePrompt: "Detail how expected goals (xG) and Elo ratings improve outcome predictions over simple win-loss historical averages.",
    benchmarkSolution: "INSYT Sports Benchmark: Bivariate Poisson model with xG shot quality weighting yields 71.2% accuracy in tournament outcome predictions.",
    hints: ["Mention Poisson distribution and expected goals (xG)."]
  },
  {
    id: "learn-sql-mini-business-cases",
    title: "Learn SQL with AI: Mini Business Cases",
    hostEntity: "INSYT Academy",
    category: "SQL & BI",
    difficulty: "Beginner",
    status: "Finished",
    duration: "45 min challenge",
    prize: "Executive Verified Certificate + 150 XP",
    participants: 1001,
    description: "Solve 10 real-world SQL query challenges using window functions, CTEs, and JOINs on e-commerce transaction data.",
    tags: ["SQL", "PostgreSQL", "Data Analytics"],
    teamSize: "Individual",
    fee: "Free",
    location: "Online",
    registeredCount: 1001,
    datasetHeaders: ["order_id", "customer_id", "order_date", "total_amount_bdt", "status"],
    datasetRows: [
      { order_id: 101, customer_id: "C-12", order_date: "2026-01-15", total_amount_bdt: 4500, status: "DELIVERED" },
      { order_id: 102, customer_id: "C-15", order_date: "2026-01-16", total_amount_bdt: 8900, status: "DELIVERED" },
    ],
    diagnosticQuestions: [
      {
        id: 1,
        question: "Which SQL window function computes running revenue totals without collapsing individual transaction rows?",
        options: ["A) SUM() OVER (ORDER BY order_date)", "B) GROUP BY order_date", "C) HAVING SUM(total) > 0", "D) SELECT DISTINCT order_date"],
        correct: "A) SUM() OVER (ORDER BY order_date)",
        explanation: "SUM() OVER () creates a cumulative window sum across ordered transaction dates."
      }
    ],
    casePrompt: "Write a SQL query using CTE and ROW_NUMBER() to identify the top 3 highest spending customers per month.",
    benchmarkSolution: "INSYT SQL Benchmark: WITH MonthlySpend AS (SELECT customer_id, DATE_TRUNC('month', order_date), SUM(total_amount_bdt) as spend, ROW_NUMBER() OVER(PARTITION BY DATE_TRUNC('month', order_date) ORDER BY SUM(total_amount_bdt) DESC) as rk FROM orders GROUP BY 1,2) SELECT * FROM MonthlySpend WHERE rk <= 3;",
    hints: ["Use ROW_NUMBER() OVER (PARTITION BY month ORDER BY sum_spend DESC)."]
  },
  {
    id: "data4good-case-challenge",
    title: "Data4Good Case Challenge: Climate Resilience in Coastal BD",
    hostEntity: "IIT Delhi & UNDP",
    category: "Business Case",
    difficulty: "Intermediate",
    status: "Finished",
    duration: "3 hour challenge",
    prize: "$2,000 USD Grant",
    participants: 1731,
    description: "Analyze flood inundation maps and agricultural yields across coastal union parishads to propose resource allocation strategies.",
    tags: ["Data4Good", "NGO", "Spatial Data"],
    teamSize: "2 - 4 Members",
    fee: "Free",
    location: "Online",
    registeredCount: 1731,
    datasetHeaders: ["Union_Parishad", "District", "Flood_Risk_Index", "Vulnerable_Population", "Emergency_Fund_Need_BDT"],
    datasetRows: [
      { Union_Parishad: "Shyamnagar", District: "Satkhira", Flood_Risk_Index: "0.89 (CRITICAL)", Vulnerable_Population: 45000, Emergency_Fund_Need_BDT: 15000000 },
      { Union_Parishad: "Dacope", District: "Khulna", Flood_Risk_Index: "0.82 (HIGH)", Vulnerable_Population: 38000, Emergency_Fund_Need_BDT: 12000000 },
    ],
    diagnosticQuestions: [
      {
        id: 1,
        question: "When allocating emergency disaster relief funds across vulnerable unions, which index provides equitable prioritization?",
        options: [
          "A) Multidimensional Vulnerability Index (MVI) combining hazard exposure & poverty rate",
          "B) Total gross population alone regardless of income",
          "C) Proximity to capital city Dhaka",
          "D) Historical tourist volume"
        ],
        correct: "A) Multidimensional Vulnerability Index (MVI) combining hazard exposure & poverty rate",
        explanation: "MVI ensures aid reaches union parishads with the highest combination of physical flood threat and low adaptive capacity."
      }
    ],
    casePrompt: "Propose a priority ranking matrix for disaster fund allocation across Shyamnagar and Dacope union parishads.",
    benchmarkSolution: "UNDP Benchmark: Prioritize Shyamnagar (MVI 0.89) for 55% of fund allocation targeting embankment reinforcement and saline-tolerant seed distribution.",
    hints: ["Balance flood risk score with population vulnerability metrics."]
  }
];
