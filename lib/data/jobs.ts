export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  experienceLevel: string;
  deadline: string;
  logo: string;
  department: string;
  postedDate: string;
  applied?: boolean;
  description: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
  stages: { step: number; title: string; desc: string }[];
}

export const jobsData: JobListing[] = [
  {
    id: "aarong-qa-chemist",
    title: "Quality Assurance Officer / Plant Chemist",
    company: "Aarong Dairy",
    location: "Gazipur Plant, Bangladesh",
    salary: "৳32,000 - ৳45,000 / mo",
    type: "Full-time (Executive Level)",
    experienceLevel: "1-3 Years",
    deadline: "Aug 20, 2026",
    logo: "🧪",
    department: "Quality Assurance & Food Safety",
    postedDate: "Aug 01, 2026",
    description: "Responsible for raw milk adulteration testing, CIP verification, pasteurization monitoring, and ISO 22000 / HACCP food safety compliance across dairy processing lines.",
    responsibilities: [
      "Perform chemical and microbiological analysis on raw milk and processed dairy batches.",
      "Enforce ISO 22000 & FSSC 22000 food safety standards across pasteurization and packaging units.",
      "Conduct raw milk adulteration detection and CIP (Clean-in-Place) verification.",
      "Issue final batch quality sign-offs prior to cold-chain dispatch."
    ],
    requirements: [
      "B.Sc / M.Sc in Food Engineering, Food Technology, Applied Chemistry, Dairy Science, or Biotechnology.",
      "Demonstrated familiarity with HACCP principles, lab titrations, and spectrophotometry.",
      "1-3 years of laboratory experience in food/beverage or FMCG manufacturing."
    ],
    perks: [
      "BRAC Enterprise employee benefits and healthcare coverage",
      "Subsidized Gazipur plant dining and festival bonuses",
      "Direct technical training on Tetra Pak quality systems"
    ],
    stages: [
      { step: 1, title: "INSYT Academic & Lab Skill Screening", desc: "Shortlisting based on Chemistry / Food Tech credentials." },
      { step: 2, title: "Practical Lab Assessment & Written Test", desc: "Chemical analysis and HACCP case evaluation." },
      { step: 3, title: "Plant Quality Head & HR Viva", desc: "Final technical viva at Gazipur Dairy Processing Facility." }
    ]
  },
  {
    id: "aarong-milk-collection-supervisor",
    title: "Milk Collection & Chilling Center Supervisor",
    company: "Aarong Dairy",
    location: "Pabna / Sirajganj Chilling Centers",
    salary: "৳22,000 - ৳30,000 / mo",
    type: "Full-time (Field Operations)",
    experienceLevel: "1-2 Years",
    deadline: "Aug 18, 2026",
    logo: "🥛",
    department: "Procurement & Field Operations",
    postedDate: "Jul 28, 2026",
    description: "Manage direct farmer milk procurement, lactometer fat testing, bulk chilling operations, and cold-chain transport logistics from rural farm sheds.",
    responsibilities: [
      "Operate bulk milk chilling units and manage milk collection center hygiene.",
      "Execute rapid lactometer and Gerber fat tests to verify milk purity.",
      "Manage farmer cooperatives and reconcile digital payout disbursements.",
      "Coordinate insulated tanker route logistics for raw milk transit to Gazipur plant."
    ],
    requirements: [
      "B.Sc in Agriculture, Animal Husbandry, DVM, Diploma in Livestock, or Graduate in any discipline.",
      "1-2 years experience in agricultural procurement, rural extension, or dairy operations.",
      "Strong interpersonal skills for farmer mobilization and cooperative building."
    ],
    perks: [
      "Field transport allowance and mobile bill reimbursement",
      "BRAC social enterprise career progression pathway",
      "Performance incentives based on raw milk quality compliance"
    ],
    stages: [
      { step: 1, title: "Field Experience Review", desc: "Evaluation of rural extension and procurement background." },
      { step: 2, title: "Milk Testing & Operations Assessment", desc: "Practical test on milk fat testing and record-keeping." },
      { step: 3, title: "Regional Procurement Manager Viva", desc: "Final interview with Dairy Procurement Lead." }
    ]
  },
  {
    id: "aarong-business-data-analyst",
    title: "Business Data Analyst / MIS Executive",
    company: "Aarong Dairy",
    location: "Dhaka (Head Office), Bangladesh",
    salary: "৳35,000 - ৳55,000 / mo",
    type: "Full-time (Analytics Track)",
    experienceLevel: "2-4 Years",
    deadline: "Aug 25, 2026",
    logo: "📊",
    department: "Data & Business Intelligence",
    postedDate: "Aug 02, 2026",
    description: "Bridge rural milk procurement trends with corporate FMCG sales forecasting. Build Power BI dashboards, SQL queries, and Python analytics models for executive decision making.",
    responsibilities: [
      "Develop executive dashboards tracking milk procurement yield and distributor sales variance.",
      "Execute SQL queries on enterprise ERP databases to track plant wastage and inventory turnover.",
      "Build predictive forecasting models for seasonal dairy demand fluctuations.",
      "Present commercial optimization insights to Head of Business Operations."
    ],
    requirements: [
      "B.Sc in Computer Science, Statistics, Economics, Agricultural Economics, or BBA in Business Analytics.",
      "2-4 years experience with Power BI / Tableau, SQL, and Advanced Excel (VBA/XLOOKUP).",
      "Strong background in econometric modeling and quantitative business reporting."
    ],
    perks: [
      "Hybrid corporate office work policy in Gulshan/Mohakhali HQ",
      "Direct exposure to BRAC Enterprise Executive Committee",
      "Professional development budget for Python and SQL certifications"
    ],
    stages: [
      { step: 1, title: "SQL & Analytics Screening Test", desc: "60-minute practical data modeling & Power BI test." },
      { step: 2, title: "Commercial Case Study Presentation", desc: "Analyze raw milk supply vs sales variance dataset." },
      { step: 3, title: "Head of Analytics & HR Director Interview", desc: "Final executive panel interview." }
    ]
  },
  {
    id: "aarong-assistant-manager-erp",
    title: "Assistant Manager, Enterprise Web Application (ERP)",
    company: "Aarong Dairy",
    location: "Dhaka, Bangladesh",
    salary: "৳50,000 - ৳70,000 / mo",
    type: "Full-time (Enterprise Tech)",
    experienceLevel: "2-4 Years",
    deadline: "Aug 22, 2026",
    logo: "💻",
    department: "Enterprise Technology & Systems",
    postedDate: "Aug 05, 2026",
    description: "Lead Odoo ERP customization, business process analysis, and system integration across dairy procurement, inventory, sales distribution, and financial reporting.",
    responsibilities: [
      "Convert stakeholder business requirements into functional software SRS documents.",
      "Customize and integrate Odoo ERP modules for factory store and sales distribution.",
      "Conduct UAT (User Acceptance Testing), load testing, and system security audits.",
      "Design executive management reporting dashboards and automated workflows."
    ],
    requirements: [
      "B.Sc in Computer Science or Software Engineering from a recognized university.",
      "2-4 years experience in ERP implementation (Odoo / SAP / Python / .NET / PHP).",
      "Familiarity with FMCG manufacturing, inventory (FIFO/FEFO), and supply chain workflows."
    ],
    perks: [
      "Key enterprise tech leadership role across BRAC Enterprises",
      "Comprehensive medical insurance and provident fund benefits",
      "Accelerated promotion path to Enterprise Solutions Manager"
    ],
    stages: [
      { step: 1, title: "ERP & Technical System Design Test", desc: "Evaluation of SRS writing and Odoo/Python skills." },
      { step: 2, title: "Architecture & Business Process Interview", desc: "Technical viva with Head of Enterprise Tech." },
      { step: 3, title: "C-Suite Technology Board Interview", desc: "Final interview with Group CIO." }
    ]
  },
  {
    id: "aarong-associate-store-officer",
    title: "Associate Officer, Store & Inventory",
    company: "Aarong Dairy",
    location: "Gazipur Factory, Bangladesh",
    salary: "৳28,000 - ৳38,000 / mo",
    type: "Full-time",
    experienceLevel: "1-3 Years",
    deadline: "Aug 15, 2026",
    logo: "📦",
    department: "Store & Supply Chain",
    postedDate: "Jul 30, 2026",
    description: "Supervise receipt, storage, and dispatch of finished dairy goods adhering to GSDP, GMP, ISO guidelines, and FEFO / FIFO stock rotation standards.",
    responsibilities: [
      "Manage ERP inventory records for raw materials, packaging, and finished dairy products.",
      "Enforce FEFO (First-Expired, First-Out) and FIFO principles to minimize spoilage.",
      "Conduct weekly cycle counts, stock reconciliation, and warehouse safety audits.",
      "Supervise warehouse assistants in loading/unloading insulated distribution trucks."
    ],
    requirements: [
      "Graduation in any discipline (BBA, B.Sc, or Supply Chain Diploma preferred).",
      "1-3 years experience in store management, ERP inventory software, and warehouse safety.",
      "Good understanding of food safety hygiene (GMP/ISO) and Excel reporting."
    ],
    perks: [
      "Factory lunch and Gazipur transport facility",
      "Festival bonuses, gratuity, and group health insurance",
      "Clear career trajectory into Supply Chain Executive"
    ],
    stages: [
      { step: 1, title: "Inventory & ERP Aptitude Test", desc: "Evaluation of Excel formulas and FEFO/FIFO logic." },
      { step: 2, title: "Warehouse Manager & HR Viva", desc: "Interview at Gazipur Processing Factory." }
    ]
  },
  {
    id: "aarong-territory-sales-manager",
    title: "Territory Sales Manager (TSM)",
    company: "Aarong Dairy",
    location: "Regional Hubs, Bangladesh",
    salary: "৳35,000 - ৳50,000 / mo",
    type: "Full-time (Commercial Track)",
    experienceLevel: "2-4 Years",
    deadline: "Aug 14, 2026",
    logo: "📈",
    department: "Sales & Distribution",
    postedDate: "Jul 26, 2026",
    description: "Drive primary and secondary cold-chain FMCG sales targets, expand refrigerated retail display coverage, and manage regional distributor networks.",
    responsibilities: [
      "Achieve monthly territory sales budgets for liquid milk, yogurt, butter, and ghee.",
      "Expand cold-chain retail outlet coverage and monitor dealer safety stock.",
      "Manage field sales representatives (SRs) and resolve distributor market issues.",
      "Control product returns and execute trade marketing visual merchandising."
    ],
    requirements: [
      "Bachelor's degree or BBA/MBA in Marketing or Business Administration.",
      "2-4 years experience in FMCG channel sales, preferably cold-chain food products.",
      "Proven leadership in distributor management and sales target achievement."
    ],
    perks: [
      "Attractive monthly sales incentive and TA/DA allowance",
      "Corporate mobile allowance and laptop support",
      "Fast-track promotion to Area Sales Manager"
    ],
    stages: [
      { step: 1, title: "Sales & Commercial Screening", desc: "Evaluation of territory sales track record." },
      { step: 2, title: "Territory Business Case Viva", desc: "Presentation of 90-day market expansion plan." },
      { step: 3, title: "National Sales Head Interview", desc: "Final interview with Sales Operations Lead." }
    ]
  },
  {
    id: "aarong-rnd-specialist",
    title: "Research & Development (R&D) Specialist",
    company: "Aarong Dairy",
    location: "Gazipur R&D Center, Bangladesh",
    salary: "৳45,000 - ৳65,000 / mo",
    type: "Full-time (R&D Track)",
    experienceLevel: "3-5 Years",
    deadline: "Aug 28, 2026",
    logo: "🧬",
    department: "Research & Development",
    postedDate: "Aug 03, 2026",
    description: "Lead novel dairy product formulation, probiotic yogurt cultures, flavored milk stabilization, and pilot plant scale-up trials compliant with BFSA/BSTI standards.",
    responsibilities: [
      "Formulate innovative functional dairy recipes, probiotic beverages, and low-fat products.",
      "Conduct sensory panel evaluations, rheology testing, and shelf-life acceleration trials.",
      "Scale up laboratory pilot recipes to full-scale commercial manufacturing lines.",
      "Ensure all new formulations comply with BFSA (Bangladesh Food Safety Authority) regulations."
    ],
    requirements: [
      "M.Sc / Ph.D in Food Science, Dairy Technology, or Applied Chemistry.",
      "3-5 years experience in dairy culture development, food formulation, or FMCG R&D.",
      "Deep understanding of hydrocolloids, food emulsifiers, and sensory analysis."
    ],
    perks: [
      "State-of-the-art BRAC Dairy R&D laboratory access",
      "Support for scientific journal publishing and international food tech conferences",
      "Executive compensation package and healthcare benefits"
    ],
    stages: [
      { step: 1, title: "Scientific Portfolio Review", desc: "Evaluation of R&D formulation publications and patents." },
      { step: 2, title: "Pilot Recipe Technical Defense", desc: "Presentation of sensory trial and stabilization methodology." },
      { step: 3, title: "R&D Director & Managing Director Viva", desc: "Final executive panel interview." }
    ]
  },
  {
    id: "aarong-livestock-extension-officer",
    title: "Livestock Extension Officer / Veterinary Doctor",
    company: "Aarong Dairy",
    location: "Northern Districts (Bogra, Rangpur), Bangladesh",
    salary: "৳35,000 - ৳50,000 / mo",
    type: "Full-time (Extension)",
    experienceLevel: "1-3 Years",
    deadline: "Aug 24, 2026",
    logo: "🐄",
    department: "Veterinary Services & Field Extension",
    postedDate: "Aug 04, 2026",
    description: "Enhance smallholder dairy cattle productivity, execute artificial insemination programs, manage mastitis prevention, and train micro-farmers.",
    responsibilities: [
      "Diagnose cattle diseases, manage vaccination schedules, and formulate cost-effective feed.",
      "Conduct farmer training workshops on hygienic milk production and animal welfare.",
      "Implement breed improvement programs and artificial insemination across milk sheds.",
      "Reduce mastitis incidence in cooperative farms to ensure low somatic cell count milk."
    ],
    requirements: [
      "Doctor of Veterinary Medicine (DVM) or B.Sc in Animal Husbandry.",
      "1-3 years experience in cattle health, dairy extension, or livestock development.",
      "Strong passion for rural empowerment and micro-farmer economic development."
    ],
    perks: [
      "Motorcycle allowance and field travel subsidies",
      "Direct integration with BRAC Ultra-Poor Graduation and Agribusiness programs",
      "Comprehensive medical and life insurance coverage"
    ],
    stages: [
      { step: 1, title: "Veterinary Credential Verification", desc: "Review of DVM registration and field extension work." },
      { step: 2, title: "Practical Livestock Case Examination", desc: "Diagnosis and extension training simulation." },
      { step: 3, title: "Head of Veterinary Services Viva", desc: "Final interview with Livestock Operations Director." }
    ]
  },
  {
    id: "aarong-distribution-incharge",
    title: "Distribution Incharge",
    company: "Aarong Dairy",
    location: "Sales Centers, Bangladesh",
    salary: "৳30,000 - ৳42,000 / mo",
    type: "Full-time",
    experienceLevel: "Fresh Graduate / 0-2 Years",
    deadline: "Aug 22, 2026",
    logo: "🚛",
    department: "Sales & Finance Operations",
    postedDate: "Aug 09, 2026",
    description: "Control daily product distribution, sales proceeds collection, bank deposits, inventory stock reconciliation, and cash book management.",
    responsibilities: [
      "Receive products from factory cold vehicles and inspect leakage or shortage.",
      "Distribute products to sales representatives according to daily market demand.",
      "Collect daily sales value, manage credit receivables, and deposit funds to bank.",
      "Maintain cash book, DCR, and inventory registers in Excel and ERP software."
    ],
    requirements: [
      "Graduation or Post-Graduation in Accounting or Finance.",
      "Minimum 2nd class/division in all academic examinations.",
      "Proficiency in MS Excel, ERP accounting software, and cash management."
    ],
    perks: [
      "Sales center management allowance and festival bonuses",
      "BRAC Enterprise career growth into Branch Operations Manager",
      "Group medical insurance coverage"
    ],
    stages: [
      { step: 1, title: "Accounting & Excel Aptitude Test", desc: "45-minute test on cash book entries and Excel formulas." },
      { step: 2, title: "Operations & Audit Viva", desc: "Interview with Distribution Head & Internal Audit Lead." }
    ]
  },
  {
    id: "aarong-supply-chain-executive",
    title: "Supply Chain & Logistics Executive",
    company: "Aarong Dairy",
    location: "Dhaka / Gazipur, Bangladesh",
    salary: "৳32,000 - ৳48,000 / mo",
    type: "Full-time",
    experienceLevel: "2-4 Years",
    deadline: "Aug 19, 2026",
    logo: "⛓️",
    department: "Supply Chain & Distribution",
    postedDate: "Jul 29, 2026",
    description: "Optimize temperature-controlled fleet logistics, perishable inventory rotation (FEFO), and chilling-center-to-factory transportation efficiency.",
    responsibilities: [
      "Manage cold-chain logistics routing from 20+ chilling centers to Gazipur processing plant.",
      "Optimize refrigerated transport fleet scheduling using GPS tracking and SAP SCM.",
      "Ensure FEFO perishable inventory rotation to reduce transit damage and product returns.",
      "Conduct supplier quality audits for food-grade packaging materials and CIP chemicals."
    ],
    requirements: [
      "B.Sc in Industrial & Production Engineering (IPE) or BBA in Supply Chain Management.",
      "2-4 years experience in FMCG supply chain, cold storage logistics, or fleet tracking.",
      "Familiarity with demand forecasting, SAP/Oracle ERP, and logistics optimization."
    ],
    perks: [
      "Company transport facility between Dhaka office and Gazipur plant",
      "Subsidized lunch, health insurance, and provident fund",
      "Rapid career movement into Supply Chain Lead"
    ],
    stages: [
      { step: 1, title: "Supply Chain & Quantitative Test", desc: "Logistics routing and FEFO inventory calculation test." },
      { step: 2, title: "Supply Chain Director & HR Interview", desc: "Final technical panel interview." }
    ]
  },
  {
    id: "aarong-production-officer",
    title: "Production Officer (Dairy Processing)",
    company: "Aarong Dairy",
    location: "Gazipur Plant, Bangladesh",
    salary: "৳30,000 - ৳45,000 / mo",
    type: "Full-time (Executive Level)",
    experienceLevel: "2-4 Years",
    deadline: "Aug 16, 2026",
    logo: "🏭",
    department: "Manufacturing & Production",
    postedDate: "Jul 29, 2026",
    description: "Supervise automated UHT pasteurization lines, yogurt/butter manufacturing automation, OEE tracking, and mass balance production yield calculations.",
    responsibilities: [
      "Supervise shift operations across liquid milk pasteurization, aseptic filling, and yogurt fermenters.",
      "Calculate daily production yield, mass balance, and OEE (Overall Equipment Effectiveness).",
      "Enforce GMP (Good Manufacturing Practices) and sterile line sanitization protocols."
    ],
    requirements: [
      "B.Sc in Food Engineering, Dairy Technology, or Mechanical/Chemical Engineering.",
      "2-4 years experience in FMCG automated food or dairy manufacturing plants."
    ],
    perks: [
      "Gazipur plant housing allowance and dining privileges",
      "Festival bonuses and group insurance coverage"
    ],
    stages: [
      { step: 1, title: "Technical Manufacturing Screening", desc: "Written test on mass balance and pasteurization technology." },
      { step: 2, title: "Plant Production Head Interview", desc: "Technical interview at Gazipur Plant." }
    ]
  },
  {
    id: "aarong-brand-manager",
    title: "Brand Manager / Assistant Brand Manager",
    company: "Aarong Dairy",
    location: "Dhaka HQ, Bangladesh",
    salary: "৳55,000 - ৳85,000 / mo",
    type: "Full-time (Marketing Level)",
    experienceLevel: "3-6 Years",
    deadline: "Aug 27, 2026",
    logo: "📣",
    department: "Marketing & Brand Management",
    postedDate: "Aug 06, 2026",
    description: "Lead ATL/BTL consumer brand marketing campaigns, nutritional positioning strategy, NPD (New Product Development) launches, and packaging redesign.",
    responsibilities: [
      "Develop 360-degree brand strategy for Aarong Dairy liquid milk, yogurt, and cheese lines.",
      "Manage creative agency relationships, media buying budgets, and digital marketing ROI.",
      "Lead market research on consumer nutritional preferences and competitor positioning."
    ],
    requirements: [
      "BBA / MBA in Marketing from a top-tier university.",
      "3-6 years experience in FMCG brand management or creative agency strategy."
    ],
    perks: [
      "Competitive executive salary package with corporate mobile/laptop support",
      "Direct leadership of flagship social-enterprise FMCG brand"
    ],
    stages: [
      { step: 1, title: "Brand Strategy Case Defense", desc: "Presentation of 360-degree brand campaign strategy." },
      { step: 2, title: "Head of Marketing & HR Director Viva", desc: "Final executive panel interview." }
    ]
  }
];

export function convertGovJobToJobListing(govJob: any): JobListing {
  return {
    id: govJob.id,
    title: govJob.title,
    company: `${govJob.organizationAcronym} (${govJob.organizationName})`,
    location: "Govt Research Institute",
    salary: `৳${govJob.salary_scale_bdt} (Grade ${govJob.grade})`,
    type: "Govt Research Circular",
    experienceLevel: govJob.experience || "Per Circular",
    deadline: govJob.applicationDeadline || "Active",
    logo: "🏛️",
    department: govJob.family || "Research & Scientific",
    postedDate: "Govt Circular 2026",
    description: `Official Government Research Job Circular for ${govJob.title} at ${govJob.organizationName}. Category: ${govJob.family}, Grade ${govJob.grade}. Total Vacancies: ${govJob.vacancy}.`,
    responsibilities: [
      `Execute ${govJob.family} tasks and research assignments for ${govJob.organizationAcronym}.`,
      `Apply pre-joining competencies: ${(govJob.before_skills || []).join(", ")}.`,
      `Develop post-joining inferred skills: ${(govJob.after_skills_inferred || []).join(", ")}.`
    ],
    requirements: [
      govJob.requirements,
      `Pre-joining Skills: ${(govJob.before_skills || []).join(", ")}`,
      `Grade ${govJob.grade} under National Pay Scale 2015.`
    ],
    perks: [
      "Government National Pay Scale & Allowances",
      "Institutional Research Infrastructure & Pension Eligibility",
      "Career Growth Pathway in Government Research Cadre"
    ],
    stages: [
      { step: 1, title: "Online Application via Teletalk", desc: govJob.applicationMode || "Teletalk Online Application Portal" },
      { step: 2, title: "Selection & Viva Process", desc: govJob.selectionProcess || "Written, Practical (where applicable), and Oral Examination" }
    ]
  };
}
