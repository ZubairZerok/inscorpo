/**
 * INSYT Corporate Career Platform — Feature Flag Inventory & Phase Metadata
 * 
 * Phase 1 — Candidate Product (Launch)
 * Phase 2 — Growth & Validation
 * Phase 3 — Recruiter Platform (B2B Marketplace)
 * Phase 4 — University Platform (Campus Placement)
 * Phase 5 — Enterprise Ecosystem (Corporate L&D)
 */

export interface FeatureFlagMeta {
  enabled: boolean;
  phase: "Phase 1" | "Phase 2" | "Phase 3" | "Phase 4" | "Phase 5";
  activationCondition: string;
  targetMetric: "Activation" | "Retention" | "Employability" | "Conversion" | "Revenue";
  dependencies: string[];
}

export const FEATURE_FLAG_INVENTORY: Record<string, FeatureFlagMeta> = {
  // ── Phase 1: Candidate Product (ACTIVE NOW) ───────────────────────────
  CANDIDATE_AI_INTERVIEWS: {
    enabled: true,
    phase: "Phase 1",
    activationCondition: "Default Launch Active",
    targetMetric: "Employability",
    dependencies: ["OPENROUTER_API_KEY"],
  },
  CANDIDATE_INTERACTIVE_SIMULATORS: {
    enabled: true,
    phase: "Phase 1",
    activationCondition: "Default Launch Active",
    targetMetric: "Activation",
    dependencies: [],
  },
  CANDIDATE_PASSPORT_VERIFICATION: {
    enabled: true,
    phase: "Phase 1",
    activationCondition: "Default Launch Active",
    targetMetric: "Conversion",
    dependencies: ["Appwrite DB Profiles"],
  },
  SPACED_RETRIEVAL_ENGINE: {
    enabled: true,
    phase: "Phase 1",
    activationCondition: "Default Launch Active",
    targetMetric: "Retention",
    dependencies: ["UserContext State"],
  },

  // ── Phase 2: Growth & Validation (ACTIVE NOW) ─────────────────────────
  UNIVERSITY_LEADERBOARDS: {
    enabled: true,
    phase: "Phase 2",
    activationCondition: "Default Launch Active",
    targetMetric: "Retention",
    dependencies: ["Appwrite DB Leaderboard"],
  },
  COMMUNITY_PEER_REVIEWS: {
    enabled: true,
    phase: "Phase 2",
    activationCondition: "Default Launch Active",
    targetMetric: "Retention",
    dependencies: ["Appwrite DB Community Posts"],
  },
  LINKEDIN_PASSPORT_SHARING: {
    enabled: true,
    phase: "Phase 2",
    activationCondition: "Default Launch Active",
    targetMetric: "Conversion",
    dependencies: ["Career Passport Public View"],
  },

  // ── Phase 3: Recruiter Platform (HIDDEN IN PHASE 1) ───────────────────
  RECRUITER_TALENT_SEARCH: {
    enabled: false,
    phase: "Phase 3",
    activationCondition: ">5,000 active candidates with 100% completed Skill Passports",
    targetMetric: "Revenue",
    dependencies: ["Candidate Passport Data", "Recruiter Auth Roles"],
  },
  RECRUITER_DIRECT_SHORTLISTING: {
    enabled: false,
    phase: "Phase 3",
    activationCondition: "Minimum 10 signed MNC Partner LOIs",
    targetMetric: "Revenue",
    dependencies: ["RECRUITER_TALENT_SEARCH"],
  },

  // ── Phase 4: University Platform (HIDDEN IN PHASE 1) ──────────────────
  UNIVERSITY_CAMPUS_DASHBOARD: {
    enabled: false,
    phase: "Phase 4",
    activationCondition: "3 signed University Career Placement Contracts",
    targetMetric: "Revenue",
    dependencies: ["Campus Analytics Engine"],
  },

  // ── Phase 5: Enterprise Ecosystem (HIDDEN IN PHASE 1) ─────────────────
  ENTERPRISE_LND_ANALYTICS: {
    enabled: false,
    phase: "Phase 5",
    activationCondition: "Corporate L&D Enterprise SLA Agreements",
    targetMetric: "Revenue",
    dependencies: ["Enterprise SSO", "Custom Rubric Builder"],
  },
};

export function isFeatureEnabled(flagName: string): boolean {
  const meta = FEATURE_FLAG_INVENTORY[flagName];
  return meta ? meta.enabled : false;
}
