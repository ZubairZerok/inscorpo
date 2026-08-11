import { UserState } from "./state/types";

export type SubscriptionTier = "starter" | "pro" | "enterprise";

export interface TierFeature {
  id: string;
  name: string;
  minTier: SubscriptionTier;
  description: string;
}

export const TIER_FEATURES: Record<string, TierFeature> = {
  pdfExport: {
    id: "pdfExport",
    name: "Executive PDF Passport Export",
    minTier: "pro",
    description: "Export high-resolution PDF resumes directly from your Career Passport.",
  },
  aiToolsFull: {
    id: "aiToolsFull",
    name: "Full AI Tools Suite (12 Tools)",
    minTier: "pro",
    description: "Access advanced AI tutors, prompt engineering, and mock interview tools.",
  },
  unlimitedMockTests: {
    id: "unlimitedMockTests",
    name: "Unlimited Mock Tests",
    minTier: "pro",
    description: "Take unlimited banking, corporate, and analytics mock tests.",
  },
  allLearningPaths: {
    id: "allLearningPaths",
    name: "All Learning Paths (Full Access)",
    minTier: "pro",
    description: "Unlock all 8 executive career tracks and specialized modules.",
  },
  certificates: {
    id: "certificates",
    name: "Verified Certificate Generation",
    minTier: "pro",
    description: "Generate official digital certificates with cryptographic verification.",
  },
  teamAnalytics: {
    id: "teamAnalytics",
    name: "Enterprise Team Analytics & SSO",
    minTier: "enterprise",
    description: "Organization-wide employee learning dashboards and SAML SSO integration.",
  },
};

/**
 * Rank weight for subscription tier comparison
 */
const TIER_WEIGHT: Record<SubscriptionTier, number> = {
  starter: 1,
  pro: 2,
  enterprise: 3,
};

/**
 * Check if the user's current subscription tier has access to a specific feature ID
 */
export function hasFeatureAccess(state: Partial<UserState>, featureId: string): boolean {
  const userTier: SubscriptionTier = (state.subscriptionTier as SubscriptionTier) || "starter";
  const feature = TIER_FEATURES[featureId];

  if (!feature) return true; // Default to accessible if feature is not explicitly restricted

  return TIER_WEIGHT[userTier] >= TIER_WEIGHT[feature.minTier];
}

/**
 * Returns list of locked features for the user's current tier
 */
export function getLockedFeaturesForTier(tier: SubscriptionTier = "starter"): TierFeature[] {
  const currentWeight = TIER_WEIGHT[tier] || 1;
  return Object.values(TIER_FEATURES).filter(
    (feature) => TIER_WEIGHT[feature.minTier] > currentWeight
  );
}
