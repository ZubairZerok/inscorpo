export interface InterviewScenario {
  id: string;
  role: string;
  company: string;
  companyLogo: string;
  industry: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  questions: string[];
  systemPrompt: string;
}

export const interviewScenarios: InterviewScenario[] = [
  {
    id: "fmcg-supply-chain",
    role: "Supply Chain Analyst",
    company: "Unilever",
    companyLogo: "U",
    industry: "FMCG",
    difficulty: "Intermediate",
    questions: [
      "Tell me about a time you identified a bottleneck in a supply chain and how you resolved it.",
      "How do you approach demand forecasting for seasonal products like during Eid?",
      "Can you explain the difference between reorder point and safety stock? How do you calculate them?"
    ],
    systemPrompt: "Act as a hiring manager at a top FMCG company interviewing a candidate for a Supply Chain Analyst role. Ask the provided questions one by one. Evaluate their technical knowledge (demand forecasting, inventory management) and behavioral responses (problem-solving under pressure). Provide constructive feedback at the end."
  },
  {
    id: "rmg-compliance",
    role: "Compliance Officer",
    company: "H&M Supplier",
    companyLogo: "H",
    industry: "RMG",
    difficulty: "Advanced",
    questions: [
      "What are the most common compliance violations you see in RMG factories, and how do you address them?",
      "Walk me through your process of creating a Corrective Action Plan (CAP) after an audit.",
      "How do you balance strict buyer requirements with the practical operational constraints of factory management?"
    ],
    systemPrompt: "Act as a Chief Compliance Officer at a major RMG buying house in Bangladesh. You are interviewing a candidate for a Compliance Officer position. Focus on their understanding of labor laws, safety regulations, and their ability to handle difficult negotiations with factory management."
  },
  {
    id: "ngo-me-specialist",
    role: "M&E Specialist",
    company: "BRAC",
    companyLogo: "B",
    industry: "NGO",
    difficulty: "Intermediate",
    questions: [
      "How do you ensure data quality when field workers are collecting data using tools like KoboToolbox in low-connectivity areas?",
      "Can you describe a logical framework (logframe) and how you have used it in a past project?",
      "How do you handle a situation where the collected data shows that a project is completely failing to meet its KPIs?"
    ],
    systemPrompt: "Act as a Program Director at a large NGO. You are interviewing for a Monitoring and Evaluation (M&E) Specialist. Evaluate the candidate on their technical skills (KoboToolbox, data cleaning) and their ability to interpret data for donor reporting."
  },
  {
    id: "bank-mto",
    role: "Management Trainee (MTO)",
    company: "Standard Chartered",
    companyLogo: "S",
    industry: "Banking",
    difficulty: "Advanced",
    questions: [
      "Why do you want to start your career in banking, and specifically why this Management Trainee program?",
      "Pitch a new digital banking product that would appeal to university students in Bangladesh.",
      "Describe a time you had to make a quick decision with incomplete information."
    ],
    systemPrompt: "Act as a Senior HR Partner at a multinational bank. You are interviewing a fresh graduate for a highly competitive Management Trainee program. Assess their leadership potential, strategic thinking, and general business acumen."
  }
];
