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
    id: "brac-bank-mtp",
    title: "Management Trainee Officer (MTO)",
    company: "BRAC Bank Limited",
    location: "Dhaka, Bangladesh",
    salary: "৳65,000 - ৳75,000 / mo",
    type: "Full-time (MTO Track)",
    experienceLevel: "Fresh Graduate / 0-1 Year",
    deadline: "Aug 15, 2026",
    logo: "🏦",
    department: "Corporate Banking & Risk",
    postedDate: "Jul 25, 2026",
    description: "BRAC Bank's flagship Management Trainee Program (MTP) prepares top-tier university graduates for accelerated executive leadership across Corporate Banking, Treasury, Credit Risk, and Digital Transformation.",
    responsibilities: [
      "Rotate through Corporate Credit Risk, Retail Operations, Treasury, and Tech Product divisions.",
      "Analyze commercial credit applications, financial statement ratios, and corporate loan portfolios.",
      "Present strategic business optimization cases directly to division heads.",
      "Lead cross-functional fintech initiatives and digital customer onboarding projects."
    ],
    requirements: [
      "BBA / B.Sc in Business, Finance, Economics, Engineering, or Data Analytics from a recognized university.",
      "Minimum CGPA of 3.00 out of 4.00 (or equivalent academic standing).",
      "Strong proficiency in Financial Modeling, Excel (XLOOKUP, Pivot Tables), and Business Analytics.",
      "Exceptional verbal and written business communication in English and Bangla."
    ],
    perks: [
      "Fast-track promotion to Senior Officer / Manager within 18 months",
      "Subsidized executive MBA / CFA certification support",
      "Comprehensive medical coverage and festive bonuses",
      "Direct mentorship from C-Suite executives"
    ],
    stages: [
      { step: 1, title: "INSYT CV & Aptitude Screening", desc: "Shortlisting based on INSYT Career Passport score and analytical CGPA." },
      { step: 2, title: "Analytical & Excel Assessment Test", desc: "60-minute online test covering financial modeling, logical reasoning, and data interpretation." },
      { step: 3, title: "Group Discussion (GD) & Business Case", desc: "Real-world commercial case study breakdown in a 6-candidate panel." },
      { step: 4, title: "C-Suite Board Interview & Offer", desc: "Final executive interview with Deputy Managing Director & HR Head." }
    ]
  },
  {
    id: "sheba-xyz-analytics",
    title: "Junior Business Analyst",
    company: "Sheba.xyz",
    location: "Dhaka, Bangladesh (Hybrid)",
    salary: "৳45,000 - ৳55,000 / mo",
    type: "Full-time",
    experienceLevel: "Entry Level (0-2 Years)",
    deadline: "Aug 10, 2026",
    logo: "📈",
    department: "Business Intelligence & Operations",
    postedDate: "Jul 24, 2026",
    description: "Join Bangladesh's leading service marketplace to drive data-informed operational growth. Work closely with product leads and operations heads to build SQL data pipelines and Power BI executive dashboards.",
    responsibilities: [
      "Build real-time Power BI dashboards tracking daily gross merchandise value (GMV) and service delivery SLAs.",
      "Execute SQL queries on PostgreSQL data warehouse to analyze customer churn and service provider retention.",
      "Conduct cohort analysis and price elasticity experiments across service categories."
    ],
    requirements: [
      "Bachelor's degree in Business, Computer Science, Statistics, or Data Science.",
      "Demonstrated experience with SQL (JOINs, CTEs, Aggregations) and Power BI / Tableau.",
      "Hands-on familiarity with Excel data cleaning, TRIM, and XLOOKUP formulas."
    ],
    perks: [
      "Flexible hybrid work policy (2 days WFH / week)",
      "Employee equity options pool for high performers",
      "Unlimited coffee and catered office lunches",
      "Learning allowance for cloud data certifications"
    ],
    stages: [
      { step: 1, title: "Resume & Portfolio Review", desc: "Reviewing Power BI portfolio projects and SQL assessment scores." },
      { step: 2, title: "Live SQL & Analytics Test", desc: "Practical 45-minute live query test on sample e-commerce dataset." },
      { step: 3, title: "Hiring Manager & Product Interview", desc: "Technical walkthrough of previous business analytics projects." }
    ]
  },
  {
    id: "ific-bank-associate",
    title: "Banking Associate Officer",
    company: "IFIC Bank PLC",
    location: "Chittagong, Bangladesh",
    salary: "৳50,000 / mo",
    type: "Full-time",
    experienceLevel: "Fresh Graduate",
    deadline: "Aug 20, 2026",
    logo: "🏦",
    department: "Retail & Commercial Banking",
    postedDate: "Jul 20, 2026",
    description: "IFIC Bank is hiring Associate Officers for its Chittagong regional hub to handle commercial credit underwriting, trade services, and retail banking operations.",
    responsibilities: [
      "Review commercial loan applications, SME collateral documentation, and audit balance sheets.",
      "Ensure compliance with Bangladesh Bank regulatory circulars and LC trade guidelines.",
      "Maintain corporate customer relationships across regional trade accounts."
    ],
    requirements: [
      "Graduate degree in Business Administration, Finance, Accounting, or Economics.",
      "Basic understanding of banking accounting, loan ratios, and MS Excel.",
      "Willingness to be placed in regional branches within Chittagong zone."
    ],
    perks: [
      "Standard banking pay scale with 3 festive bonuses per year",
      "Contributory Provident Fund (CPF) and Gratuity benefits",
      "Structured 6-week residential training academy"
    ],
    stages: [
      { step: 1, title: "Preliminary Written Exam", desc: "General aptitude, Bangla, English, and basic accounting exam." },
      { step: 2, title: "Viva Voce & Document Verification", desc: "Face-to-face interview with Regional HR Committee." }
    ]
  },
  {
    id: "unilever-mto-finance",
    title: "Unilever Future Leaders Program (UFLP) — Finance MTO",
    company: "Unilever Bangladesh",
    location: "Dhaka, Bangladesh",
    salary: "৳95,000 / mo",
    type: "Full-time (MTO Track)",
    experienceLevel: "Fresh Graduate / <1 Year",
    deadline: "Sep 01, 2026",
    logo: "🌿",
    department: "Corporate Finance & Supply Chain",
    postedDate: "Jul 26, 2026",
    description: "Unilever's premier management trainee program designed to groom future CFOs and business leaders. Includes a 3-month international stint and rotational leadership exposure.",
    responsibilities: [
      "Manage brand P&L forecasting, advertising return on investment (ROI), and pricing models.",
      "Collaborate with supply chain teams on factory cost optimization and inventory reduction.",
      "Present quarterly financial performance reviews to Executive Management Committee."
    ],
    requirements: [
      "Top-tier BBA / MBA / B.Sc graduate with outstanding academic and leadership achievements.",
      "Mastery of corporate financial modeling, DCF valuation, and Power BI visualization.",
      "Proven agility in high-pressure case solving and team leadership."
    ],
    perks: [
      "Market-leading compensation starting at ৳95,000 / month",
      "International business rotation opportunity",
      "Executive health insurance and company transport allowance"
    ],
    stages: [
      { step: 1, title: "Online Gamified Assessment", desc: "Problem-solving games and situational judgment tests." },
      { step: 2, title: "Digital Discovery Center", desc: "Live business case simulation and individual presentation." },
      { step: 3, title: "Final Board Interview", desc: "Interview with Unilever Bangladesh Leadership Team." }
    ]
  },
  {
    id: "grameenphone-gmt-tech",
    title: "Graduate Management Trainee (GMT) — Tech & Commercial",
    company: "Grameenphone Limited (Telenor)",
    location: "Dhaka, Bangladesh (Hybrid)",
    salary: "৳85,000 - ৳95,000 / mo",
    type: "Full-time (GMT Track)",
    experienceLevel: "Fresh Graduate / 0-1 Year",
    deadline: "Aug 25, 2026",
    logo: "📡",
    department: "Technology & Digital Solutions",
    postedDate: "Jul 28, 2026",
    description: "Join the largest telecom network in Bangladesh through Grameenphone's GMT program. Lead digital product transformation, cloud infrastructure, and enterprise data analytics.",
    responsibilities: [
      "Rotate through Cloud Architecture, Data Engineering, Digital Products, and Commercial Strategy.",
      "Analyze network utilization metrics and subscriber lifetime value (LTV) datasets.",
      "Design user journey flows for the MyGP super-app platform."
    ],
    requirements: [
      "Degree in CSE, EEE, Software Engineering, Business Analytics, or MIS.",
      "Proficiency in Python/SQL data analytics or cloud computing fundamentals (AWS/GCP).",
      "Analytical mindset with strong problem-solving skills."
    ],
    perks: [
      "Accelerated career progression to Manager grade within 24 months",
      "Telenor global exchange program eligibility",
      "Comprehensive medical, mobile handset, and transport allowances"
    ],
    stages: [
      { step: 1, title: "Digital Screening & Cognitive Test", desc: "Online logical reasoning and numerical aptitude test." },
      { step: 2, title: "Hackathon & Hack Day Simulation", desc: "24-hour group technology hackathon problem solving." },
      { step: 3, title: "Executive Leadership Viva", desc: "Panel interview with Chief Technology Officer & People Division Head." }
    ]
  },
  {
    id: "pathao-backend-engineer",
    title: "Software Engineer (Backend / Go)",
    company: "Pathao Limited",
    location: "Dhaka, Bangladesh",
    salary: "৳70,000 - ৳90,000 / mo",
    type: "Full-time",
    experienceLevel: "1-3 Years",
    deadline: "Aug 18, 2026",
    logo: "🛵",
    department: "Engineering & Infrastructure",
    postedDate: "Jul 22, 2026",
    description: "Pathao is hiring high-throughput Backend Engineers to scale microservices powering food delivery, ride-hailing, and courier dispatch algorithms handling millions of requests daily.",
    responsibilities: [
      "Design and maintain scalable Go / gRPC microservices deployed on Kubernetes.",
      "Optimize Redis caching layers and PostgreSQL database indexing for low-latency queries.",
      "Implement real-time driver matching and dynamic surge pricing engines."
    ],
    requirements: [
      "B.Sc in Computer Science or Software Engineering.",
      "Hands-on experience with Golang or Node.js/Python microservices architecture.",
      "Familiarity with Kafka, Docker, Kubernetes, and distributed systems design."
    ],
    perks: [
      "Competitive tech pay with semi-annual performance reviews",
      "Catered lunches, snacks, and unlimited Pathao credit per month",
      "Flexible work hours and continuous dev conference support"
    ],
    stages: [
      { step: 1, title: "System Design & Code Assessment", desc: "Online coding challenge covering data structures and algorithms." },
      { step: 2, title: "Technical System Architecture Interview", desc: "Deep dive into concurrency, database locks, and microservices design." },
      { step: 3, title: "Culture Fit & VP Engineering Interview", desc: "Final conversation with Engineering VP and HR Team." }
    ]
  },
  {
    id: "bkash-product-manager",
    title: "Associate Product Manager — Fintech Payments",
    company: "bKash Limited",
    location: "Dhaka, Bangladesh",
    salary: "৳75,000 - ৳85,000 / mo",
    type: "Full-time",
    experienceLevel: "1-2 Years",
    deadline: "Aug 30, 2026",
    logo: "💳",
    department: "Product & Digital Payments",
    postedDate: "Jul 29, 2026",
    description: "Shape the future of digital financial inclusion at bKash. Lead product roadmaps for merchant QR payments, international remittances, and digital micro-loans.",
    responsibilities: [
      "Define product requirements (PRDs), wireframes, and user acceptance criteria for payment APIs.",
      "Collaborate with UX designers, engineering squads, and risk compliance officers.",
      "Track daily active users (DAU), transaction conversion rates, and drop-off analytics."
    ],
    requirements: [
      "Bachelor's degree in Engineering, Business, or Computer Science.",
      "1+ years of experience in product management, fintech, or business analysis.",
      "Familiarity with Agile/Scrum, Figma wireframing, and SQL funnel analytics."
    ],
    perks: [
      "Direct impact on 70M+ fintech users across Bangladesh",
      "3 festive bonuses, gratuity, and provident fund benefits",
      "Executive health insurance for employee and dependents"
    ],
    stages: [
      { step: 1, title: "Product Portfolio Screening", desc: "Evaluation of PRDs, UI wireframes, and business case submissions." },
      { step: 2, title: "Live Product Case Defense", desc: "Presenting a 15-minute fintech growth case to Product VP." },
      { step: 3, title: "Final Board Interview", desc: "Leadership evaluation with Chief Product Officer." }
    ]
  },
  {
    id: "bat-gmt-operations",
    title: "Global Management Trainee (GMT) — Operations",
    company: "British American Tobacco Bangladesh",
    location: "Dhaka / Dhaka Factory, Bangladesh",
    salary: "৳110,000 / mo",
    type: "Full-time (GMT Track)",
    experienceLevel: "Fresh Graduate / <1 Year",
    deadline: "Sep 05, 2026",
    logo: "🏭",
    department: "Operations & Supply Chain",
    postedDate: "Jul 30, 2026",
    description: "BAT's premier Global Management Trainee program offers 18 months of intensive leadership rotation including factory automation, green supply chain, and international assignments.",
    responsibilities: [
      "Manage high-capacity manufacturing lines, Lean Six Sigma projects, and factory yield targets.",
      "Optimize raw material procurement logistics and leaf processing operations.",
      "Lead cross-functional sustainability initiatives targeting net-zero carbon emissions."
    ],
    requirements: [
      "Top-tier B.Sc in Engineering (ME, IPE, EEE, ChE) or BBA/B.Sc from recognized institutions.",
      "Demonstrated campus leadership (Club President, Case Competition Champion).",
      "Willingness to rotate across manufacturing facilities in Dhaka and Kushtia."
    ],
    perks: [
      "Starting salary ৳110,000 / month — top corporate compensation",
      "Guaranteed international stint at BAT regional hub",
      "Full executive benefits, car loan support, and international health coverage"
    ],
    stages: [
      { step: 1, title: "Online Aptitude & Behavioral Test", desc: "Gamified cognitive and situational judgment assessment." },
      { step: 2, title: "Assessment Center (AC)", desc: "Full-day group business case simulation, presentation, and role-play." },
      { step: 3, title: "Executive Leadership Board Interview", desc: "Final interview with BAT Bangladesh Board of Directors." }
    ]
  },
  {
    id: "scb-relationship-manager",
    title: "Relationship Manager — Corporate Banking",
    company: "Standard Chartered Bank BD",
    location: "Dhaka, Bangladesh",
    salary: "৳80,000 - ৳100,000 / mo",
    type: "Full-time",
    experienceLevel: "2-4 Years",
    deadline: "Aug 22, 2026",
    logo: "🏦",
    department: "Corporate & Institutional Banking",
    postedDate: "Jul 21, 2026",
    description: "Standard Chartered is seeking experienced Corporate Relationship Managers to manage trade finance, cross-border loans, and treasury accounts for multinational conglomerates in Bangladesh.",
    responsibilities: [
      "Structure commercial credit proposals, syndication facilities, and foreign exchange hedging strategies.",
      "Maintain active relationship portfolios with RMG exporters, pharmaceuticals, and infrastructure conglomerates.",
      "Ensure adherence to Anti-Money Laundering (AML) and Bangladesh Bank trade guidelines."
    ],
    requirements: [
      "BBA / MBA in Finance, Accounting, or Economics from a top university.",
      "2+ years in corporate credit underwriting, commercial lending, or trade finance.",
      "Mastery of financial ratio analysis, DCF modeling, and credit memorandum writing."
    ],
    perks: [
      "International banking pay structure with performance bonus pool",
      "Global training opportunities in Singapore / Dubai hubs",
      "Comprehensive medical and retirement benefits package"
    ],
    stages: [
      { step: 1, title: "Credit Memorandum Walkthrough", desc: "Reviewing sample corporate credit proposal writing." },
      { step: 2, title: "Technical Finance Interview", desc: "In-depth testing on trade finance, LCs, and financial modeling." },
      { step: 3, title: "Managing Director Viva", desc: "Final executive interview with Head of Corporate Banking." }
    ]
  },
  {
    id: "robi-data-engineer",
    title: "Junior Data Engineer",
    company: "Robi Axiata PLC",
    location: "Dhaka, Bangladesh (Hybrid)",
    salary: "৳60,000 - ৳70,000 / mo",
    type: "Full-time",
    experienceLevel: "0-2 Years",
    deadline: "Aug 28, 2026",
    logo: "📊",
    department: "Big Data & Analytics Hub",
    postedDate: "Jul 27, 2026",
    description: "Join Robi's Big Data Hub to build ETL data pipelines processing terabytes of CDR (call detail records) and mobile monetary transaction data using PySpark and Databricks.",
    responsibilities: [
      "Build batch and streaming data pipelines using Apache Spark, Kafka, and Python.",
      "Maintain BigQuery / Snowflake data warehouse models powering customer analytics dashboards.",
      "Optimize SQL query performance and data partitioning strategies."
    ],
    requirements: [
      "B.Sc in Computer Science, Data Science, Software Engineering, or Information Systems.",
      "Strong proficiency in Python (Pandas, PySpark) and SQL window functions.",
      "Familiarity with Docker, Airflow, or cloud data warehousing platforms."
    ],
    perks: [
      "Hybrid work culture with top telecom employee benefits",
      "Annual performance bonus and mobile bill reimbursement",
      "Subsidized Databricks / AWS Data Engineer certification support"
    ],
    stages: [
      { step: 1, title: "SQL & Data Pipeline Test", desc: "60-minute practical data engineering exercise." },
      { step: 2, title: "Technical Data Architecture Interview", desc: "Discussion on Spark optimization, data modeling, and Airflow DAGs." },
      { step: 3, title: "Division Head Interview", desc: "Interview with Head of Analytics & Data Science." }
    ]
  },
  {
    id: "walton-supply-chain",
    title: "Operations Associate — Supply Chain Management",
    company: "Walton Hi-Tech Industries PLC",
    location: "Gazipur / Dhaka, Bangladesh",
    salary: "৳45,000 - ৳55,000 / mo",
    type: "Full-time",
    experienceLevel: "0-2 Years",
    deadline: "Aug 16, 2026",
    logo: "⚙️",
    department: "Supply Chain & Procurement",
    postedDate: "Jul 19, 2026",
    description: "Manage raw material procurement, inventory warehousing, and distribution logistics for Bangladesh's largest electronics manufacturing plant.",
    responsibilities: [
      "Coordinate international raw material imports, LC documentation, and customs clearing at Chittagong Port.",
      "Optimize warehouse space utilization and safety stock levels using SAP SCM.",
      "Monitor factory assembly line supply schedules and vendor delivery performance."
    ],
    requirements: [
      "B.Sc in IPE, Supply Chain Management, Business Administration, or Engineering.",
      "Understanding of MRP systems, inventory forecasting, and MS Excel.",
      "Willingness to spend time at Gazipur manufacturing plant."
    ],
    perks: [
      "Company transport provided from Dhaka to Gazipur plant",
      "Subsidized factory lunch, Provident Fund, and festival bonuses",
      "Rapid career movement across international export divisions"
    ],
    stages: [
      { step: 1, title: "Written Supply Chain Test", desc: "Calculations on EOQ, lead times, and inventory turnover." },
      { step: 2, title: "Factory Walkthrough & Plant Manager Viva", desc: "Site visit and interview with Supply Chain Director." }
    ]
  },
  {
    id: "augmedix-ai-scribe",
    title: "AI & Medical Scribe Trainee",
    company: "Augmedix Bangladesh",
    location: "Dhaka, Bangladesh",
    salary: "৳35,000 - ৳45,000 / mo",
    type: "Full-time",
    experienceLevel: "Fresh Graduate",
    deadline: "Aug 12, 2026",
    logo: "🩺",
    department: "Healthcare AI Operations",
    postedDate: "Jul 15, 2026",
    description: "Join US-listed Augmedix in Dhaka to assist American physicians using Ambient AI technology to structure electronic health records (EHR) in real-time.",
    responsibilities: [
      "Review ambient AI audio transcripts of doctor-patient consultations and edit clinical documentation.",
      "Ensure HIPAA compliance and medical chart accuracy across electronic health record systems.",
      "Collaborate with AI product teams to train ambient machine learning speech models."
    ],
    requirements: [
      "Graduate in any discipline (English, Business, Pharmacy, Science preferred).",
      "Native-level listening comprehension in American English accent.",
      "Fast typing speed (50+ WPM) with strong attention to medical detail."
    ],
    perks: [
      "4-month paid medical terminology & EHR academy training",
      "Fixed night shift transport drop-off service in Dhaka metro area",
      "Bi-annual salary appraisal and global promotion tracks"
    ],
    stages: [
      { step: 1, title: "English Audio Comprehension Test", desc: "Listening comprehension and typing speed evaluation." },
      { step: 2, title: "Medical Terminology Training Assessment", desc: "Basic medical vocabulary and chart editing exercise." },
      { step: 3, title: "HR & Operations viva", desc: "Final interview with Country Operations Manager." }
    ]
  }
];
