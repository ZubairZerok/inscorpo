export interface SimulationTask {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  deliverableType: "File Upload" | "Text Response" | "Video Submission";
  resources: { name: string; type: string; url?: string }[];
  modelAnswer: {
    text: string;
    videoUrl?: string;
    downloadUrl?: string;
  };
}

export interface Simulation {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  industry: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  tags: string[];
  description: string;
  tasks: SimulationTask[];
}

export const simulations: Simulation[] = [
  {
    id: "fmcg-supply-chain",
    title: "Supply Chain & Operations Analyst",
    company: "Unilever Bangladesh (Simulated)",
    companyLogo: "U",
    industry: "FMCG",
    difficulty: "Intermediate",
    duration: "4-5 hours",
    tags: ["Data Analytics", "Excel", "Supply Chain", "Power BI"],
    description: "Step into the shoes of a Supply Chain Analyst at a top FMCG brand. In this simulation, you will analyze warehouse inventory data, forecast demand for the upcoming Eid season, and present a bottleneck mitigation strategy to your operations director.",
    tasks: [
      {
        id: "task-1",
        title: "Analyze Regional Inventory Turnover",
        description: "You have been provided with raw SAP export data for the last quarter. Clean the data and calculate the Inventory Turnover Ratio for each major warehouse (Dhaka, Chittagong, Sylhet). Identify any locations facing stockout risks.",
        timeEstimate: "90 mins",
        deliverableType: "Text Response",
        resources: [
          { name: "Q3_Warehouse_Data_Raw.xlsx", type: "Excel" },
          { name: "Inventory_Formulas_Guide.pdf", type: "PDF" }
        ],
        modelAnswer: {
          text: "The model answer focuses on correctly identifying the Chittagong warehouse as high-risk due to its turnover ratio dropping below 4.5. A strong submission will have used a pivot table to aggregate the raw data, explicitly filtering out returned/damaged goods before calculating the turnover."
        }
      },
      {
        id: "task-2",
        title: "Draft an Executive Memo",
        description: "Write a short memo to the Head of Operations summarizing your findings from Task 1 and proposing a reallocation of inventory from Sylhet to Chittagong.",
        timeEstimate: "45 mins",
        deliverableType: "Text Response",
        resources: [],
        modelAnswer: {
          text: "Model Response Structure:\n\n1. BLUF (Bottom Line Up Front): Reallocate 15% of Sylhet's safety stock to Chittagong immediately to prevent Eid stockouts.\n2. Data Support: Chittagong turnover at 4.2 vs Sylhet at 6.8.\n3. Risk/Mitigation: Minimal cost in transport; high cost if sales are lost in the port city."
        }
      }
    ]
  },
  {
    id: "rmg-compliance-audit",
    title: "Social Compliance & Sustainability",
    company: "H&M Supplier Network (Simulated)",
    companyLogo: "H",
    industry: "RMG",
    difficulty: "Advanced",
    duration: "5-6 hours",
    tags: ["Compliance", "Audit", "RMG", "ESG"],
    description: "Experience the rigorous compliance requirements of top global RMG buyers. Act as a Compliance Officer reviewing factory audit reports, identifying non-compliance in working hours and safety, and drafting a Corrective Action Plan (CAP).",
    tasks: [
      {
        id: "task-1",
        title: "Identify Audit Violations",
        description: "Review the provided Factory Audit Report. Highlight three major non-compliance issues related to working hours and emergency exits.",
        timeEstimate: "60 mins",
        deliverableType: "Text Response",
        resources: [
          { name: "Factory_73_Audit_Report.pdf", type: "PDF" },
          { name: "Buyer_Code_of_Conduct.pdf", type: "PDF" }
        ],
        modelAnswer: {
          text: "The three major issues are:\n1. Working Hours: Section 3 shows 55 workers exceeded the 60-hour weekly limit (including overtime).\n2. Emergency Exits: Exit route on Floor 3 was partially blocked by raw materials.\n3. Documentation: Missing age verification documents for 3 newly hired operators."
        }
      }
    ]
  },
  {
    id: "ngo-data-monitoring",
    title: "M&E Data Specialist",
    company: "BRAC / Save The Children (Simulated)",
    companyLogo: "B",
    industry: "NGO",
    difficulty: "Beginner",
    duration: "3-4 hours",
    tags: ["KoboToolbox", "M&E", "Field Data", "Data Cleaning"],
    description: "Work as a Monitoring & Evaluation (M&E) Specialist. Clean raw survey data collected via KoboToolbox from a rural field project, ensuring accuracy for donor reporting (FD-7).",
    tasks: [
      {
        id: "task-1",
        title: "Clean KoboToolbox Survey Data",
        description: "Download the messy CSV dataset from the field team. Identify and fix duplicate entries, missing age values, and inconsistent formatting in the 'Income' column.",
        timeEstimate: "120 mins",
        deliverableType: "Text Response",
        resources: [
          { name: "Field_Survey_Raw_Extract.csv", type: "CSV" }
        ],
        modelAnswer: {
          text: "A successful cleaning involves:\n- Removing 12 exact duplicate rows based on 'Household_ID'.\n- Imputing missing age values with the median (or flagging them).\n- Standardizing 'Income' by removing currency symbols (BDT, Taka) and converting strings to numerical values."
        }
      }
    ]
  }
];
