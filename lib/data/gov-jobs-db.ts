import unifiedDb from "@/DB/jobs_unified.json";

export interface GovJob {
  id: string;
  title: string;
  family: string;
  vacancy: number;
  grade: number;
  salary_scale_bdt: string;
  requirements: string;
  before_skills: string[];
  after_skills_inferred: string[];
  experience: string;
  source_confidence: string;
  // Attached organization metadata
  organizationAcronym: string;
  organizationName: string;
  ministry: string;
  applicationDeadline: string;
  applicationStart?: string;
  applicationMode?: string;
  applicationFee?: string;
  selectionProcess?: string;
  sourceLink?: string;
}

export interface GovOrganization {
  organization: string;
  acronym: string;
  type: string;
  ministry: string;
  headquarters: string;
  latest_supplied_recruitment: {
    circular_date: string;
    published: string;
    vacancy_categories: number;
    total_vacancies: number;
    application_start: string;
    application_deadline: string;
    age: string;
    application_mode: string;
    application_fee: string;
    selection: string;
    source: string;
  };
  institutional_career_intelligence: {
    high_value_degree_domains: string[];
    insyt_priority: string;
    why: string;
  };
  jobs: GovJob[];
}

export interface SkillTaxonomy {
  tier_1_core: string[];
  tier_2_high_value: string[];
  tier_3_specialized: string[];
  tier_4_operational: string[];
}

export interface EligibilityResult {
  isEligible: boolean;
  degreeMatch: boolean;
  status: "HIGHLY_RECOMMENDED" | "POTENTIALLY_ELIGIBLE" | "NEEDS_CHECK";
  matchedDegrees: string[];
  notes: string;
}

export interface SkillGapResult {
  matchedBeforeSkills: string[];
  missingBeforeSkills: string[];
  postJoiningCompetencies: string[];
  readinessPercentage: number;
}

// ─── Data Access API ─────────────────────────────────────────────────────────

export function getUnifiedDB() {
  return unifiedDb;
}

export function getGovOrganizations(): GovOrganization[] {
  return (unifiedDb.organizations || []) as GovOrganization[];
}

export function getAllGovJobs(): GovJob[] {
  const orgs = getGovOrganizations();
  const allJobs: GovJob[] = [];

  orgs.forEach((org) => {
    if (Array.isArray(org.jobs)) {
      org.jobs.forEach((job) => {
        allJobs.push({
          ...job,
          organizationAcronym: org.acronym,
          organizationName: org.organization,
          ministry: org.ministry,
          applicationDeadline: org.latest_supplied_recruitment?.application_deadline || "See Circular",
          applicationStart: org.latest_supplied_recruitment?.application_start || "",
          applicationMode: org.latest_supplied_recruitment?.application_mode || "Online via Teletalk",
          applicationFee: org.latest_supplied_recruitment?.application_fee || "",
          selectionProcess: org.latest_supplied_recruitment?.selection || "",
          sourceLink: org.latest_supplied_recruitment?.source || "",
        });
      });
    }
  });

  return allJobs;
}

export function getGovJobById(id: string): GovJob | null {
  const all = getAllGovJobs();
  return all.find((j) => j.id.toLowerCase() === id.toLowerCase()) || null;
}

export function getGovJobsByOrg(acronym: string): GovJob[] {
  const all = getAllGovJobs();
  return all.filter((j) => j.organizationAcronym.toLowerCase() === acronym.toLowerCase());
}

export function getSkillBundles(): Record<string, string> {
  return (unifiedDb.insyt_corporate_schema?.skill_bundles || {}) as Record<string, string>;
}

export function getSkillTaxonomy(): SkillTaxonomy {
  return (unifiedDb.skill_taxonomy || {
    tier_1_core: [],
    tier_2_high_value: [],
    tier_3_specialized: [],
    tier_4_operational: [],
  }) as SkillTaxonomy;
}

export function getGovJobStats() {
  const orgs = getGovOrganizations();
  const allJobs = getAllGovJobs();
  const totalVacancies = orgs.reduce(
    (acc, org) => acc + (org.latest_supplied_recruitment?.total_vacancies || 0),
    0
  );

  const orgStats = orgs.map((org) => ({
    acronym: org.acronym,
    name: org.organization,
    jobsCount: org.jobs ? org.jobs.length : 0,
    vacanciesCount: org.latest_supplied_recruitment?.total_vacancies || 0,
    deadline: org.latest_supplied_recruitment?.application_deadline || "Active",
    insytPriority: org.institutional_career_intelligence?.insyt_priority || "HIGH",
    degrees: org.institutional_career_intelligence?.high_value_degree_domains || [],
  }));

  return {
    totalOrganizations: orgs.length,
    totalJobs: allJobs.length,
    totalVacancies,
    orgStats,
  };
}

// ─── Smart Intelligence Engines ─────────────────────────────────────────────

export function checkDegreeEligibility(job: GovJob, userDegree?: string): EligibilityResult {
  if (!userDegree) {
    return {
      isEligible: true,
      degreeMatch: false,
      status: "NEEDS_CHECK",
      matchedDegrees: [],
      notes: "Select your degree in profile or filter to check exact eligibility.",
    };
  }

  const reqLower = job.requirements.toLowerCase();
  const userDegLower = userDegree.toLowerCase();

  const org = getGovOrganizations().find((o) => o.acronym === job.organizationAcronym);
  const orgHighValueDegrees = org?.institutional_career_intelligence?.high_value_degree_domains || [];

  const matchedOrgDegrees = orgHighValueDegrees.filter(
    (d) => d.toLowerCase().includes(userDegLower) || userDegLower.includes(d.toLowerCase())
  );
  const directReqMatch = reqLower.includes(userDegLower);

  if (directReqMatch) {
    return {
      isEligible: true,
      degreeMatch: true,
      status: "HIGHLY_RECOMMENDED",
      matchedDegrees: [userDegree],
      notes: `Direct requirement match found in circular for ${job.organizationAcronym}.`,
    };
  }

  if (matchedOrgDegrees.length > 0) {
    return {
      isEligible: true,
      degreeMatch: true,
      status: "POTENTIALLY_ELIGIBLE",
      matchedDegrees: matchedOrgDegrees,
      notes: `${userDegree} is classified as a high-value degree domain for ${job.organizationAcronym}.`,
    };
  }

  return {
    isEligible: false,
    degreeMatch: false,
    status: "NEEDS_CHECK",
    matchedDegrees: [],
    notes: `Degree match required. Check detailed requirement text: "${job.requirements}"`,
  };
}

export function calculateGovJobSkillGap(job: GovJob, userSkills: string[] = []): SkillGapResult {
  const normalizedUserSkills = userSkills.map((s) => s.toLowerCase());
  const beforeSkills = job.before_skills || [];

  const matchedBefore = beforeSkills.filter((sk) =>
    normalizedUserSkills.some((us) => us.includes(sk.toLowerCase()) || sk.toLowerCase().includes(us))
  );

  const missingBefore = beforeSkills.filter(
    (sk) => !normalizedUserSkills.some((us) => us.includes(sk.toLowerCase()) || sk.toLowerCase().includes(us))
  );

  const readiness =
    beforeSkills.length > 0
      ? Math.round((matchedBefore.length / beforeSkills.length) * 100)
      : 100;

  return {
    matchedBeforeSkills: matchedBefore,
    missingBeforeSkills: missingBefore,
    postJoiningCompetencies: job.after_skills_inferred || [],
    readinessPercentage: readiness,
  };
}

// ─── Institute Intelligence Cards ────────────────────────────────────────────

export interface InstituteCard {
  acronym: string;
  name: string;
  type: string;
  ministry: string;
  headquarters: string;
  jobCount: number;
  totalVacancies: number;
  deadline: string;
  circularDate: string;
  selectionProcess: string;
  applicationFee: string;
  ageLimit: string;
  insytPriority: string;
  priorityReason: string;
  highValueDegrees: string[];
  topJobFamilies: string[];
  gradeRange: string;
  salaryRange: string;
}

export function getInstituteCard(acronym: string): InstituteCard | null {
  const org = getGovOrganizations().find((o) => o.acronym === acronym);
  if (!org) return null;

  const jobs = getGovJobsByOrg(acronym);
  const grades = jobs.map((j) => j.grade).filter(Boolean);
  const minGrade = grades.length > 0 ? Math.min(...grades) : 0;
  const maxGrade = grades.length > 0 ? Math.max(...grades) : 0;

  const salaries = jobs.map((j) => j.salary_scale_bdt).filter(Boolean);
  const minSalary = salaries.length > 0 ? salaries.sort()[0] : "";
  const maxSalary = salaries.length > 0 ? salaries.sort()[salaries.length - 1] : "";

  const familyCounts: Record<string, number> = {};
  jobs.forEach((j) => {
    familyCounts[j.family] = (familyCounts[j.family] || 0) + 1;
  });
  const topFamilies = Object.entries(familyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([f]) => f);

  return {
    acronym: org.acronym,
    name: org.organization,
    type: org.type,
    ministry: org.ministry,
    headquarters: org.headquarters,
    jobCount: jobs.length,
    totalVacancies: org.latest_supplied_recruitment?.total_vacancies || 0,
    deadline: org.latest_supplied_recruitment?.application_deadline || "Active",
    circularDate: org.latest_supplied_recruitment?.circular_date || "",
    selectionProcess: org.latest_supplied_recruitment?.selection || "Written & Viva",
    applicationFee: org.latest_supplied_recruitment?.application_fee || "",
    ageLimit: org.latest_supplied_recruitment?.age || "",
    insytPriority: org.institutional_career_intelligence?.insyt_priority || "HIGH",
    priorityReason: org.institutional_career_intelligence?.why || "",
    highValueDegrees: org.institutional_career_intelligence?.high_value_degree_domains || [],
    topJobFamilies: topFamilies,
    gradeRange: minGrade === maxGrade ? `Grade ${minGrade}` : `Grade ${minGrade}–${maxGrade}`,
    salaryRange: minSalary === maxSalary ? `৳${minSalary}` : `৳${minSalary} – ৳${maxSalary}`,
  };
}

export function getAllInstituteCards(): InstituteCard[] {
  const orgs = getGovOrganizations();
  return orgs.map((o) => getInstituteCard(o.acronym)).filter(Boolean) as InstituteCard[];
}

export function searchByDegree(degree: string): { institute: InstituteCard; jobs: GovJob[]; matchType: "direct" | "domain" }[] {
  if (!degree || degree.trim().length < 2) return [];

  const degLower = degree.toLowerCase().trim();
  const results: { institute: InstituteCard; jobs: GovJob[]; matchType: "direct" | "domain" }[] = [];

  const orgs = getGovOrganizations();
  orgs.forEach((org) => {
    const card = getInstituteCard(org.acronym);
    if (!card) return;

    const jobs = getGovJobsByOrg(org.acronym);

    // Direct match: degree keyword appears in job requirements
    const directMatchJobs = jobs.filter((j) =>
      j.requirements.toLowerCase().includes(degLower)
    );

    if (directMatchJobs.length > 0) {
      results.push({ institute: card, jobs: directMatchJobs, matchType: "direct" });
      return;
    }

    // Domain match: degree is in the org's high-value degree domains
    const domainMatch = card.highValueDegrees.some(
      (d) => d.toLowerCase().includes(degLower) || degLower.includes(d.toLowerCase())
    );

    if (domainMatch) {
      results.push({ institute: card, jobs, matchType: "domain" });
    }
  });

  // Sort: direct matches first, then by job count
  results.sort((a, b) => {
    if (a.matchType === "direct" && b.matchType !== "direct") return -1;
    if (a.matchType !== "direct" && b.matchType === "direct") return 1;
    return b.jobs.length - a.jobs.length;
  });

  return results;
}

export function getJobsByGrade(grade: number): GovJob[] {
  return getAllGovJobs().filter((j) => j.grade === grade);
}

export function getUniqueGrades(): number[] {
  const grades = getAllGovJobs().map((j) => j.grade).filter(Boolean);
  return Array.from(new Set(grades)).sort((a, b) => a - b);
}

// ─── Grade Band Intelligence ──────────────────────────────────────────────────

export interface GradeBandGroup {
  id: string;
  label: string;
  gradeRange: string;
  payScaleRange: string;
  badgeColor: string;
  description: string;
  jobs: GovJob[];
  totalVacancies: number;
}

export function getJobsGroupedByGradeBand(): GradeBandGroup[] {
  const allJobs = getAllGovJobs();

  const bands: { id: string; label: string; gradeRange: string; payScaleRange: string; badgeColor: string; description: string; filter: (j: GovJob) => boolean }[] = [
    {
      id: "executive_research",
      label: "Class-I Executive & Scientific Officers",
      gradeRange: "Grade 9 – Grade 10",
      payScaleRange: "৳16,000 – ৳53,060/mo",
      badgeColor: "bg-emerald-500 text-emerald-950 border-emerald-600",
      description: "Cadre & Officer rank positions requiring Master's or 4-year Honours degrees. Includes Scientific Officers, Assistant Engineers, and Officers.",
      filter: (j) => j.grade >= 9 && j.grade <= 10,
    },
    {
      id: "technical_assistants",
      label: "Mid-Level Technical & Scientific Assistants",
      gradeRange: "Grade 11 – Grade 13",
      payScaleRange: "৳11,000 – ৳30,230/mo",
      badgeColor: "bg-blue-500 text-blue-950 border-blue-600",
      description: "Technical specialist roles including Sub-Assistant Engineers, Scientific Assistants, Senior Technicians, Librarians, and Overseers.",
      filter: (j) => j.grade >= 11 && j.grade <= 13,
    },
    {
      id: "operational_staff",
      label: "Operational, Support & Trade Staff",
      gradeRange: "Grade 14 – Grade 16",
      payScaleRange: "৳9,300 – ৳24,680/mo",
      badgeColor: "bg-amber-400 text-amber-950 border-amber-500",
      description: "Operational support, office administration, laboratory technicians, typists, drivers, and trade craftsmen.",
      filter: (j) => j.grade >= 14 && j.grade <= 16,
    },
  ];

  return bands.map((b) => {
    const bandJobs = allJobs.filter(b.filter);
    const totalVacancies = bandJobs.reduce((sum, j) => sum + (j.vacancy || 1), 0);
    return {
      id: b.id,
      label: b.label,
      gradeRange: b.gradeRange,
      payScaleRange: b.payScaleRange,
      badgeColor: b.badgeColor,
      description: b.description,
      jobs: bandJobs,
      totalVacancies,
    };
  });
}

// ─── Post Family / Role Grouping Intelligence ─────────────────────────────────

export interface PostFamilyGroup {
  familyKey: string;
  title: string;
  iconName: string;
  description: string;
  jobs: GovJob[];
  totalVacancies: number;
  participatingInstitutes: string[];
}

export function getJobsGroupedByPostFamily(): PostFamilyGroup[] {
  const allJobs = getAllGovJobs();
  const familyMap = new Map<string, GovJob[]>();

  allJobs.forEach((j) => {
    // Normalize family or role
    const fam = j.family || "General / Other";
    if (!familyMap.has(fam)) {
      familyMap.set(fam, []);
    }
    familyMap.get(fam)!.push(j);
  });

  const familyDescriptions: Record<string, string> = {
    "Research / Scientific": "Core scientific research, crop improvement, laboratory experiments, and field trials.",
    "Engineering / Maintenance": "Civil, electrical, mechanical engineering, infrastructure maintenance, and equipment operation.",
    "Data / Statistics": "Statistical analysis, data compilation, survey design, and mathematical modeling.",
    "Library / Information": "Cataloguing, digital library systems, scientific documentation, and information management.",
    "Computer / IT": "System administration, software operation, hardware maintenance, and ICT support.",
    "Admin / Secretarial": "Office administration, correspondence, typing, record keeping, and institutional management.",
    "Trade / Support": "Driver, mechanic, electrician, field worker, and operational support services.",
  };

  const results: PostFamilyGroup[] = [];

  familyMap.forEach((jobs, familyKey) => {
    const orgs = Array.from(new Set(jobs.map((j) => j.organizationAcronym)));
    const totalVacancies = jobs.reduce((sum, j) => sum + (j.vacancy || 1), 0);

    results.push({
      familyKey,
      title: familyKey,
      iconName: familyKey.toLowerCase().includes("engineer") ? "Wrench" : familyKey.toLowerCase().includes("research") ? "Microscope" : "Briefcase",
      description: familyDescriptions[familyKey] || `Standard positions under ${familyKey} across research institutes.`,
      jobs,
      totalVacancies,
      participatingInstitutes: orgs,
    });
  });

  // Sort groups by total vacancies descending
  return results.sort((a, b) => b.totalVacancies - a.totalVacancies);
}

// ─── Advanced Sorting Helper ──────────────────────────────────────────────────

export type GovJobSortOption = "grade_asc" | "grade_desc" | "vacancies_desc" | "title_asc" | "salary_desc";

export function sortGovJobs(jobs: GovJob[], sortBy: GovJobSortOption): GovJob[] {
  const sorted = [...jobs];
  switch (sortBy) {
    case "grade_asc":
      return sorted.sort((a, b) => a.grade - b.grade);
    case "grade_desc":
      return sorted.sort((a, b) => b.grade - a.grade);
    case "vacancies_desc":
      return sorted.sort((a, b) => b.vacancy - a.vacancy);
    case "title_asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "salary_desc":
      return sorted.sort((a, b) => {
        const numA = parseInt(a.salary_scale_bdt.replace(/[^0-9]/g, "")) || 0;
        const numB = parseInt(b.salary_scale_bdt.replace(/[^0-9]/g, "")) || 0;
        return numB - numA;
      });
    default:
      return sorted;
  }
}

// ─── Super Accurate CV Fit Engine ─────────────────────────────────────────────

export interface RecommendedCourse {
  title: string;
  slug: string;
  url: string;
  reason: string;
}

export interface CvFitResult {
  jobId: string;
  jobTitle: string;
  organizationAcronym: string;
  matchScore: number; // 0 - 100%
  degreeMatch: boolean;
  userDegree?: string;
  requiredDegreeSnippet: string;
  matchedSkills: string[];
  missingSkills: string[];
  missingProfileFields: ("degree" | "skills" | "experience")[];
  recommendedCourses: RecommendedCourse[];
  verdict: "HIGH_FIT" | "MODERATE_FIT" | "NEEDS_UPSKILLING";
  guidanceText: string;
}

export function analyzeCvFit(
  job: GovJob,
  profile: {
    degree?: string;
    skills?: string[];
    experienceLevel?: string;
  }
): CvFitResult {
  const missingProfileFields: ("degree" | "skills" | "experience")[] = [];

  if (!profile.degree || profile.degree.trim().length === 0) {
    missingProfileFields.push("degree");
  }
  if (!profile.skills || profile.skills.length === 0) {
    missingProfileFields.push("skills");
  }

  const userDegree = profile.degree || "";
  const userSkills = (profile.skills || []).map((s) => s.toLowerCase());
  const beforeSkills = job.before_skills || [];

  // 1. Degree Match Check
  const reqLower = job.requirements.toLowerCase();
  const degLower = userDegree.toLowerCase();
  const directDegreeMatch = degLower.length > 1 && reqLower.includes(degLower);

  const org = getGovOrganizations().find((o) => o.acronym === job.organizationAcronym);
  const highValDegrees = org?.institutional_career_intelligence?.high_value_degree_domains || [];
  const domainDegreeMatch = highValDegrees.some(
    (d) => degLower.length > 1 && (d.toLowerCase().includes(degLower) || degLower.includes(d.toLowerCase()))
  );

  const degreeMatch = directDegreeMatch || domainDegreeMatch;

  // 2. Skill Match Check
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  beforeSkills.forEach((sk) => {
    const skLower = sk.toLowerCase();
    const hasSkill = userSkills.some((us) => us.includes(skLower) || skLower.includes(us));
    if (hasSkill) {
      matchedSkills.push(sk);
    } else {
      missingSkills.push(sk);
    }
  });

  // 3. Compute Score
  let score = 0;
  if (degreeMatch) score += 50;
  if (beforeSkills.length > 0) {
    score += Math.round((matchedSkills.length / beforeSkills.length) * 50);
  } else {
    score += 50; // no specific skills required
  }

  if (score > 100) score = 100;

  // 4. Determine Verdict & Guidance
  let verdict: "HIGH_FIT" | "MODERATE_FIT" | "NEEDS_UPSKILLING" = "NEEDS_UPSKILLING";
  let guidanceText = "";

  if (score >= 75) {
    verdict = "HIGH_FIT";
    guidanceText = `Strong candidate match for ${job.organizationAcronym}. Your background aligns well with circular prerequisites. Highlight your ${matchedSkills.join(", ")} in your CV submission.`;
  } else if (score >= 45) {
    verdict = "MODERATE_FIT";
    guidanceText = `Moderate alignment for ${job.title}. Bridging key skill gaps in ${missingSkills.join(", ")} will significantly boost your selection probability.`;
  } else {
    verdict = "NEEDS_UPSKILLING";
    guidanceText = `Prerequisite gaps detected for Grade ${job.grade} at ${job.organizationAcronym}. Complete the recommended internal training tracks below to prepare for written & viva exams.`;
  }

  // 5. SAAS Internal Course Recommendations Mapping
  const recommendedCourses: RecommendedCourse[] = [];
  const missingStr = missingSkills.join(" ").toLowerCase();
  const jobTitleLower = job.title.toLowerCase();

  if (missingStr.includes("excel") || missingStr.includes("data") || missingStr.includes("statistics")) {
    recommendedCourses.push({
      title: "Excel Financial Modeling & Data Masterclass",
      slug: "excel-corporate",
      url: "/learn/excel-corporate",
      reason: "Master data cleaning, advanced formulas, and quantitative reporting required for screening.",
    });
  }

  if (missingStr.includes("power_bi") || missingStr.includes("statistics_data") || jobTitleLower.includes("analyst")) {
    recommendedCourses.push({
      title: "Power BI & Business Intelligence Analytics",
      slug: "power-bi",
      url: "/learn/power-bi",
      reason: "Learn dashboard creation and automated reporting for research institute data units.",
    });
  }

  if (jobTitleLower.includes("officer") || job.grade <= 10 || missingStr.includes("research")) {
    recommendedCourses.push({
      title: "Corporate Management Trainee & Officer Prep Track",
      slug: "corporate-mto",
      url: "/learn/corporate-mto",
      reason: "Comprehensive written exam, case solving, and viva interview mastery.",
    });
  }

  if (missingStr.includes("computer") || missingStr.includes("ai") || missingStr.includes("automation")) {
    recommendedCourses.push({
      title: "AI & Executive Prompt Engineering for Work",
      slug: "ai-automation",
      url: "/learn/ai-automation",
      reason: "Supercharge research workflow efficiency with AI tools and automation.",
    });
  }

  if (recommendedCourses.length === 0) {
    recommendedCourses.push({
      title: "Executive Business Communication & PPT",
      slug: "business-comm",
      url: "/learn/business-comm",
      reason: "Polish technical report writing and viva presentation confidence.",
    });
  }

  return {
    jobId: job.id,
    jobTitle: job.title,
    organizationAcronym: job.organizationAcronym,
    matchScore: score,
    degreeMatch,
    userDegree: profile.degree,
    requiredDegreeSnippet: job.requirements,
    matchedSkills,
    missingSkills,
    missingProfileFields,
    recommendedCourses,
    verdict,
    guidanceText,
  };
}



