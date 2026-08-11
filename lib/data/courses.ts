export interface CourseItem {
  slug: string;
  pathSlug: string;
  title: string;
  description: string;
  lessons: number;
  hours: number;
  xp: number;
  skills: string[];
  enrolledCount?: number;
  rating?: number;
  modules?: {
    title: string;
    description: string;
    duration: string;
    exercisesCount: number;
    lessons: { slug: string; title: string; duration: string; xp: number; type: "video" | "reading" | "simulation" | "assessment" }[];
  }[];
}

export interface LearningPathItem {
  slug: string;
  title: string;
  category: "analytics" | "career" | "tech" | "strategy" | "comm" | "finance" | "testprep";
  description: string;
  gradient: string;
  icon: string;
  students: number;
  rating: number;
  courses: CourseItem[];
}

export const ALL_PATHS: Record<string, LearningPathItem> = {
  "excel-corporate": {
    slug: "excel-corporate",
    title: "Excel for Corporate Careers",
    category: "analytics",
    description: "From basic navigation to advanced financial modeling — the complete enterprise Excel curriculum used by MBAs, analysts, and consultants.",
    gradient: "from-emerald-600 to-teal-800",
    icon: "BarChart3",
    students: 66350,
    rating: 4.9,
    courses: [
      {
        slug: "excel-fundamentals",
        pathSlug: "excel-corporate",
        title: "Excel Foundations & Fundamentals",
        description: "Master the Excel interface, workbook navigation, cell formatting, and essential keyboard shortcuts used by corporate analysts every day.",
        lessons: 9, hours: 5, xp: 300, enrolledCount: 66350, rating: 4.9,
        skills: ["Navigation", "Formatting", "Keyboard Shortcuts", "Workbooks"],
      },
      {
        slug: "excel-formulas-cleaning",
        pathSlug: "excel-corporate",
        title: "Formulas, Functions & Data Cleaning",
        description: "Deep-dive into XLOOKUP, SUMIFS, COUNTIFS, IF nesting, and Power Query ETL pipelines to clean messy enterprise datasets.",
        lessons: 8, hours: 8, xp: 400, enrolledCount: 45200, rating: 4.9,
        skills: ["XLOOKUP", "SUMIFS", "Power Query", "Data Cleaning"],
      },
      {
        slug: "excel-viz-pivots",
        pathSlug: "excel-corporate",
        title: "Visualizations & Pivot Tables",
        description: "Build executive-grade charts, conditional formatting heatmaps, pivot tables with calculated fields, slicers, and timeline filters.",
        lessons: 7, hours: 7, xp: 350, enrolledCount: 38900, rating: 4.8,
        skills: ["Pivot Tables", "Charts", "Conditional Formatting", "Slicers"],
      },
      {
        slug: "excel-analytics-modeling",
        pathSlug: "excel-corporate",
        title: "Business Analytics & Financial Modeling",
        description: "Construct P&L projections, NPV/IRR models, break-even analysis, and KPI dashboards used in boardroom presentations.",
        lessons: 8, hours: 10, xp: 500, enrolledCount: 31200, rating: 5.0,
        skills: ["NPV/IRR", "Financial Modeling", "KPI Dashboards", "P&L Projections"],
      },
      {
        slug: "excel-decisions",
        pathSlug: "excel-corporate",
        title: "Decision Making & What-If Simulations",
        description: "Use Excel Solver, Goal Seek, Scenario Manager, and introductory VBA macros to automate business decisions.",
        lessons: 6, hours: 6, xp: 400, enrolledCount: 24100, rating: 4.8,
        skills: ["Solver", "Goal Seek", "VBA Macros", "Scenario Analysis"],
      },
      {
        slug: "excel-projects",
        pathSlug: "excel-corporate",
        title: "Corporate Projects & Capstone Assessment",
        description: "Build a real CEO performance tracker, inventory dashboard, and pass corporate Excel assessment tests.",
        lessons: 6, hours: 8, xp: 600, enrolledCount: 19800, rating: 4.9,
        skills: ["CEO Dashboard", "Case Studies", "Assessment Prep", "Capstone"],
      },
    ],
  },

  "corporate-mto": {
    slug: "corporate-mto",
    title: "Corporate Job / MTO Masterclass",
    category: "career",
    description: "Crack Management Trainee assessments, refine your CV for ATS screening, and master behavioral, technical, and consulting case interviews.",
    gradient: "from-blue-600 to-indigo-800",
    icon: "Briefcase",
    students: 52100,
    rating: 5.0,
    courses: [
      {
        slug: "recruit-assessments",
        pathSlug: "corporate-mto",
        title: "Application Strategy & Assessment Tests",
        description: "SHL numerical reasoning, situational judgment tests (SJT), and employer expectations for top MNC recruitment drives.",
        lessons: 8, hours: 6, xp: 350, enrolledCount: 52100, rating: 5.0,
        skills: ["SHL Tests", "Psychometric", "Situational Judgment", "ATS CV"],
      },
      {
        slug: "recruit-behavioral",
        pathSlug: "corporate-mto",
        title: "Behavioral & HR Interview Mastery",
        description: "STAR framework storytelling, CAR structures, and templates for answering tough behavioral questions.",
        lessons: 7, hours: 5, xp: 350, enrolledCount: 41800, rating: 4.9,
        skills: ["STAR Method", "HR Interviews", "Behavioral Q&A"],
      },
      {
        slug: "recruit-technical",
        pathSlug: "corporate-mto",
        title: "Technical & Functional Case Studies",
        description: "Commercial banking, FMCG brand marketing, operations, and corporate finance interview prep.",
        lessons: 6, hours: 4, xp: 300, enrolledCount: 35400, rating: 4.8,
        skills: ["Case Studies", "Finance Q&A", "Operations Strategy"],
      },
      {
        slug: "recruit-case",
        pathSlug: "corporate-mto",
        title: "Case Interview & Executive Slide Decks",
        description: "MECE issue trees, market entry framework, profitability trees, and consulting slide presentations.",
        lessons: 7, hours: 8, xp: 450, enrolledCount: 29000, rating: 4.9,
        skills: ["MECE", "Consulting Cases", "Issue Trees", "Slide Pitching"],
      },
    ],
  },

  "power-bi": {
    slug: "power-bi",
    title: "Power BI & Business Intelligence",
    category: "analytics",
    description: "Transform raw enterprise data into interactive DAX dashboards and uncover actionable business insights using Microsoft Power BI.",
    gradient: "from-amber-600 to-orange-700",
    icon: "BarChart3",
    students: 28400,
    rating: 4.8,
    courses: [
      {
        slug: "power-bi-foundations",
        pathSlug: "power-bi",
        title: "Power BI Desktop & Data Connections",
        description: "Import SQL databases, Excel spreadsheets, clean data in Power Query, and build interactive report pages.",
        lessons: 7, hours: 6, xp: 350, enrolledCount: 28400, rating: 4.8,
        skills: ["Power BI Desktop", "Power Query ETL", "Data Relationships"],
      },
      {
        slug: "power-bi-dax",
        pathSlug: "power-bi",
        title: "DAX Expressions & Time Intelligence",
        description: "Master DAX measures, CALCULATE, SUMX, FILTER, and year-over-year time intelligence functions.",
        lessons: 8, hours: 8, xp: 450, enrolledCount: 21300, rating: 4.9,
        skills: ["DAX", "CALCULATE", "Time Intelligence", "Custom Measures"],
      },
    ],
  },

  "ai-automation": {
    slug: "ai-automation",
    title: "AI & Workplace Automation",
    category: "tech",
    description: "Leverage generative AI tools, prompt engineering, and workflow automation to 10x your workplace output.",
    gradient: "from-purple-600 to-violet-800",
    icon: "Brain",
    students: 41200,
    rating: 4.9,
    courses: [
      {
        slug: "ai-prompting",
        pathSlug: "ai-automation",
        title: "AI Prompt Engineering & Executive Writing",
        description: "Craft expert ChatGPT and Gemini prompts for automated report drafting, email generation, and market research.",
        lessons: 6, hours: 5, xp: 300, enrolledCount: 41200, rating: 4.9,
        skills: ["Prompting", "Generative AI", "Executive Writing"],
      },
      {
        slug: "ai-workflow-automation",
        pathSlug: "ai-automation",
        title: "Workflow Automation with Python & Zapier",
        description: "Automate repetitive data collection, spreadsheet updates, and email notifications using Python scripts.",
        lessons: 7, hours: 7, xp: 400, enrolledCount: 27900, rating: 4.8,
        skills: ["Python Automation", "Zapier", "API Integration"],
      },
    ],
  },

  "corporate-finance": {
    slug: "corporate-finance",
    title: "Corporate Finance & Valuation",
    category: "finance",
    description: "Master financial statement analysis, DCF valuation, capital budgeting, and corporate M&A fundamentals.",
    gradient: "from-blue-700 to-slate-900",
    icon: "Landmark",
    students: 31800,
    rating: 4.9,
    courses: [
      {
        slug: "fin-statement-analysis",
        pathSlug: "corporate-finance",
        title: "Financial Statement Analysis (P&L, Balance Sheet, Cash Flow)",
        description: "Analyze annual reports, calculate liquidity & profitability ratios, and evaluate corporate solvency.",
        lessons: 8, hours: 8, xp: 400, enrolledCount: 31800, rating: 4.9,
        skills: ["Ratio Analysis", "Balance Sheet", "P&L", "Cash Flow"],
      },
      {
        slug: "fin-valuation-dcf",
        pathSlug: "corporate-finance",
        title: "Corporate Valuation & DCF Modeling",
        description: "Build WACC calculations, terminal value estimates, and Discounted Cash Flow (DCF) enterprise valuation models.",
        lessons: 9, hours: 10, xp: 550, enrolledCount: 22600, rating: 5.0,
        skills: ["DCF Modeling", "WACC", "Enterprise Value", "M&A Basics"],
      },
    ],
  },

  "business-comm": {
    slug: "business-comm",
    title: "Business Communication & Slide Pitching",
    category: "comm",
    description: "Craft executive presentations, master McKinsey slide layouts, and communicate with clarity in boardroom meetings.",
    gradient: "from-rose-600 to-red-800",
    icon: "Presentation",
    students: 31000,
    rating: 4.8,
    courses: [
      {
        slug: "comm-professional-writing",
        pathSlug: "business-comm",
        title: "Professional Writing & Cold Email Etiquette",
        description: "Write concise memo reports, executive summaries, and high-converting cold emails to senior leaders.",
        lessons: 6, hours: 5, xp: 300, enrolledCount: 31000, rating: 4.8,
        skills: ["Email Writing", "Executive Summaries", "Networking"],
      },
      {
        slug: "comm-ppt-storytelling",
        pathSlug: "business-comm",
        title: "PowerPoint & Visual Storytelling",
        description: "Design clean executive slides, infographic data layouts, and present complex numbers with visual impact.",
        lessons: 7, hours: 6, xp: 400, enrolledCount: 24500, rating: 4.9,
        skills: ["PowerPoint Design", "Slide Formatting", "Visual Pitching"],
      },
    ],
  },
};

// Helper function to find any course across all paths by slug
export function getCourseBySlug(courseSlug: string): CourseItem | null {
  for (const pathKey in ALL_PATHS) {
    const path = ALL_PATHS[pathKey];
    const found = path.courses.find((c) => c.slug === courseSlug);
    if (found) return found;
  }
  return null;
}
