import aarongDb from "@/DB/aarong.json";
import aarongDairy1Db from "@/DB/aarongdairy_1.json";
import aciAgbDb from "@/DB/Aci_aciagb.json";
import aciAgLinkDb from "@/DB/aci_agLink_biossci_ah.json";
import aciBiotechDb from "@/DB/aci_biotech_motor_seed.json";
import acmeLabsDb from "@/DB/acmeLab_adama_aftab_agilentTech.json";
import agromasDb from "@/DB/agromas_agroshift_akijDairy_AlltechBD.json";
import amanApexDb from "@/DB/aman_apex_armalikseeds_arannaykFoundation.json";
import aristoDb from "@/DB/aristo_astrazzeneca_ABD_ACC.json";
import { getAllGovJobs, GovJob } from "@/lib/data/gov-jobs-db";

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

export function convertGovJobToJobListing(govJob: GovJob): JobListing {
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

function getLogoForCompany(company: string, dept: string): string {
  const c = (company || "").toLowerCase();
  const d = (dept || "").toLowerCase();
  if (c.includes("aarong") || c.includes("brac")) return "🥛";
  if (c.includes("aci")) {
    if (d.includes("motor") || d.includes("machinery") || d.includes("engineer")) return "🚜";
    if (d.includes("seed") || d.includes("crop") || d.includes("agronomy")) return "🌱";
    if (d.includes("vet") || d.includes("animal") || d.includes("genetics")) return "🐄";
    return "🔬";
  }
  if (c.includes("acme") || c.includes("aristo") || c.includes("astra")) return "🧪";
  if (c.includes("akij") || c.includes("dairy")) return "🥛";
  if (c.includes("apex")) return "👟";
  if (c.includes("agromas") || c.includes("agroshift") || c.includes("alltech")) return "🌾";
  if (c.includes("aman") || c.includes("arannayk")) return "🌳";
  if (c.includes("adama") || c.includes("aftab") || c.includes("malik")) return "🌽";
  if (d.includes("data") || d.includes("analyst") || d.includes("it") || d.includes("erp") || d.includes("software")) return "💻";
  if (d.includes("finance") || d.includes("accounting") || d.includes("credit")) return "📊";
  return "🏢";
}

function extractJobsFromDataset(dataset: any, fileTag: string): JobListing[] {
  if (!dataset) return [];
  const results: JobListing[] = [];
  let rawJobs: any[] = [];

  if (Array.isArray(dataset.jobs)) {
    const defaultOrg = dataset.organization?.name || dataset.organization?.enterprise || "Corporate Enterprise";
    rawJobs = dataset.jobs.map((j: any) => ({ ...j, _datasetOrg: defaultOrg }));
  } else if (Array.isArray(dataset.organizations)) {
    dataset.organizations.forEach((org: any) => {
      if (Array.isArray(org.jobs)) {
        org.jobs.forEach((j: any) => {
          rawJobs.push({
            ...j,
            _datasetOrg: org.organization || org.name || org.acronym || "Corporate Enterprise"
          });
        });
      }
    });
  }

  rawJobs.forEach((rj: any, idx: number) => {
    const title = rj.title_en || rj.title || "Corporate Executive Role";
    const company = rj.organization || rj.business_unit || rj._datasetOrg || "Corporate Enterprise";
    const department = rj.job_family || "Corporate Operations";
    const salary = rj.salary_scale_bdt ? `৳${rj.salary_scale_bdt} / mo` : (rj.salary || "Negotiable");

    let experienceLevel = "Per Circular";
    if (typeof rj.experience === "string") {
      experienceLevel = rj.experience;
    } else if (typeof rj.experience_minimum_years === "number") {
      experienceLevel = `${rj.experience_minimum_years}+ Years`;
    } else if (rj.experience?.minimum_years !== undefined) {
      experienceLevel = `${rj.experience.minimum_years}+ Years`;
    }

    const deadline = rj.deadline || rj.application_deadline || "Active / Open";
    const postedDate = rj.date_posted || rj.date_published || "2026 Circular";

    let description = "Official Corporate Job Circular.";
    if (Array.isArray(rj.job_purpose)) {
      description = rj.job_purpose.join(" ");
    } else if (typeof rj.job_purpose === "string") {
      description = rj.job_purpose;
    } else if (rj.education) {
      const eduStr = typeof rj.education === "string" ? rj.education : (rj.education.minimum || rj.education.field || "Graduate");
      description = `Key Position Requirement: ${eduStr}.`;
    }

    let responsibilities: string[] = [];
    if (Array.isArray(rj.responsibilities) && rj.responsibilities.length > 0) {
      responsibilities = rj.responsibilities;
    } else if (Array.isArray(rj.key_responsibilities) && rj.key_responsibilities.length > 0) {
      responsibilities = rj.key_responsibilities;
    } else if (Array.isArray(rj.skills_after_joining_inferred) && rj.skills_after_joining_inferred.length > 0) {
      responsibilities = rj.skills_after_joining_inferred.map((s: string) => `Develop & execute ${s}`);
    } else {
      responsibilities = [
        "Perform operational and executive duties per circular instructions.",
        "Coordinate with cross-functional business units and field teams."
      ];
    }

    let requirements: string[] = [];
    if (Array.isArray(rj.hard_skills) && rj.hard_skills.length > 0) {
      requirements = rj.hard_skills;
    } else if (Array.isArray(rj.hard_skills_before_joining) && rj.hard_skills_before_joining.length > 0) {
      requirements = rj.hard_skills_before_joining;
    } else {
      const eduStr = typeof rj.education === "string" ? rj.education : (rj.education?.minimum || "Bachelor's / Master's degree");
      requirements = [eduStr, "Relevant domain expertise & interpersonal communication skills"];
    }

    const perks = [
      "Executive compensation & performance bonuses",
      "Corporate medical insurance & provident fund eligibility",
      "Accelerated career progression in enterprise network"
    ];

    let stages = [
      { step: 1, title: "CV Screening & Academic Review", desc: "Shortlisting based on educational background & skill alignment." },
      { step: 2, title: "Written & Technical Assessment", desc: "Evaluating domain knowledge and practical case solving." },
      { step: 3, title: "Executive Management Viva", desc: "Final panel interview with Department Head & HR Director." }
    ];

    if (Array.isArray(rj.selection) && rj.selection.length > 0) {
      stages = rj.selection.map((sel: string, sIdx: number) => ({
        step: sIdx + 1,
        title: typeof sel === "string" ? sel : "Evaluation Stage",
        desc: `Stage ${sIdx + 1} selection process`
      }));
    }

    results.push({
      id: rj.id || `${fileTag}-${idx}`,
      title,
      company,
      location: rj.location || "Bangladesh",
      salary,
      type: rj.employment || rj.grade || "Full-time Executive",
      experienceLevel,
      deadline,
      logo: getLogoForCompany(company, department),
      department,
      postedDate,
      description,
      responsibilities,
      requirements,
      perks,
      stages
    });
  });

  return results;
}

// ─── Extract All Corporate Datasets ──────────────────────────────────────────
const corporateJobs: JobListing[] = [
  ...extractJobsFromDataset(aarongDb, "aarong"),
  ...extractJobsFromDataset(aarongDairy1Db, "aarongdairy1"),
  ...extractJobsFromDataset(aciAgbDb, "aci-agri"),
  ...extractJobsFromDataset(aciAgLinkDb, "aci-aglink"),
  ...extractJobsFromDataset(aciBiotechDb, "aci-biotech"),
  ...extractJobsFromDataset(acmeLabsDb, "acme"),
  ...extractJobsFromDataset(agromasDb, "agromas"),
  ...extractJobsFromDataset(amanApexDb, "aman-apex"),
  ...extractJobsFromDataset(aristoDb, "aristo"),
];

// ─── Convert Govt Research Cadres ───────────────────────────────────────────
const govJobs: JobListing[] = getAllGovJobs().map(convertGovJobToJobListing);

// ─── Export Unified Master Jobs Array ────────────────────────────────────────
export const jobsData: JobListing[] = [...corporateJobs, ...govJobs];

// ─── Helper Query Functions ──────────────────────────────────────────────────
export function getJobById(id: string): JobListing | undefined {
  if (!id) return undefined;
  const targetId = id.toLowerCase();
  return jobsData.find((j) => j.id.toLowerCase() === targetId || (j as any).slug?.toLowerCase() === targetId);
}

export function getJobsByCompany(companyName: string): JobListing[] {
  if (!companyName) return jobsData;
  const cLower = companyName.toLowerCase();
  return jobsData.filter((j) => j.company.toLowerCase().includes(cLower));
}

export function getJobsByDepartment(dept: string): JobListing[] {
  if (!dept) return jobsData;
  const dLower = dept.toLowerCase();
  return jobsData.filter((j) => j.department.toLowerCase().includes(dLower));
}

export function searchJobs(query: string): JobListing[] {
  if (!query || query.trim().length === 0) return jobsData;
  const q = query.toLowerCase().trim();
  return jobsData.filter(
    (j) =>
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.department.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q) ||
      j.requirements.some((r) => r.toLowerCase().includes(q))
  );
}
