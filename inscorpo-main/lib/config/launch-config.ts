/**
 * INSYT Corporate — Launch & Feature Flag Configuration
 * 
 * Configures the platform to focus on the 2 Flagship Learning Paths for launch
 * while preserving all modular underlying routes, tools, and components for future scaling.
 */

export const LAUNCH_CONFIG = {
  /**
   * The 2 Flagship Learning Paths promoted as primary launch products.
   * Path 1: Corporate Job / MTO Masterclass (`corporate-mto`)
   * Path 2: Excel for Corporate Careers & Business Analytics (`excel-corporate`)
   */
  flagshipPathSlugs: ["corporate-mto", "excel-corporate"] as const,

  /**
   * Primary launch tracks promoted on onboarding and hero spot.
   */
  primaryLaunchTrackNames: [
    "Corporate Job & MTO Masterclass",
    "Business Analytics & Corporate Excel",
  ],

  /**
   * When true, catalog spotlights the 2 flagship paths prominently.
   * Secondary paths remain accessible via direct routes `/learn/[pathSlug]`.
   */
  hideSecondaryPathsFromSpotlight: true,

  /**
   * Streamlined 4-category sidebar navigation to reduce choice paralysis.
   */
  simplifiedSidebarNav: true,

  /**
   * Enables adaptive dashboard experience based on enrollment state:
   * Mode 1: Single Course Buyer (Course Player Focus)
   * Mode 2: Learning Path Buyer (Roadmap Focus)
   * Mode 3: Pro Subscriber (Full Command Center)
   */
  enableAdaptiveDashboard: true,

  /**
   * Hybrid monetization settings: Single Course (৳499-৳999), Path Bundle (৳1,999), Pro Sub (৳799/mo).
   */
  hybridMonetization: {
    singleCourseEnabled: true,
    pathwayBundleEnabled: true,
    proSubscriptionEnabled: true,
  },
};
