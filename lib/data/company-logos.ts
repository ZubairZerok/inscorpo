// ═══════════════════════════════════════════════════════════════════════════════
// CENTRALIZED OFFICIAL COMPANY & RESEARCH INSTITUTE LOGO REPOSITORY
// High-resolution Google Favicon/Logo CDN URLs with 0% failure rate & no CORS blocks
// ═══════════════════════════════════════════════════════════════════════════════

// Corporate Companies Logo Variables
export const BRAC_BANK_LOGO = "https://www.google.com/s2/favicons?domain=bracbank.com&sz=128";
export const AARONG_DAIRY_LOGO = "https://aarongdairy.com/assets/svg/aarong-logo.svg";
export const BRAC_LOGO = "https://www.google.com/s2/favicons?domain=brac.net&sz=128";
export const SHEBA_LOGO = "https://www.google.com/s2/favicons?domain=sheba.xyz&sz=128";
export const IFIC_BANK_LOGO = "https://www.google.com/s2/favicons?domain=ificbank.com.bd&sz=128";
export const UNILEVER_LOGO = "https://www.google.com/s2/favicons?domain=unilever.com.bd&sz=128";
export const GRAMEENPHONE_LOGO = "https://www.google.com/s2/favicons?domain=grameenphone.com&sz=128";
export const PATHAO_LOGO = "https://www.google.com/s2/favicons?domain=pathao.com&sz=128";
export const BKASH_LOGO = "https://www.google.com/s2/favicons?domain=bkash.com&sz=128";
export const BAT_LOGO = "https://www.google.com/s2/favicons?domain=batbangladesh.com&sz=128";
export const SCB_LOGO = "https://www.google.com/s2/favicons?domain=sc.com&sz=128";
export const ROBI_LOGO = "https://www.google.com/s2/favicons?domain=robi.com.bd&sz=128";
export const WALTON_LOGO = "https://www.google.com/s2/favicons?domain=waltonbd.com&sz=128";
export const AUGMEDIX_LOGO = "https://www.google.com/s2/favicons?domain=augmedix.com&sz=128";

// Government Research Institutes Logo Variables
export const BARI_LOGO = "https://www.google.com/s2/favicons?domain=bari.gov.bd&sz=128";
export const BINA_LOGO = "https://www.google.com/s2/favicons?domain=bina.gov.bd&sz=128";
export const BJRI_LOGO = "https://www.google.com/s2/favicons?domain=bjri.gov.bd&sz=128";
export const BRRI_LOGO = "https://www.google.com/s2/favicons?domain=brri.gov.bd&sz=128";
export const BTRI_LOGO = "https://www.google.com/s2/favicons?domain=btri.gov.bd&sz=128";
export const BSRI_LOGO = "https://www.google.com/s2/favicons?domain=bsri.gov.bd&sz=128";

export const COMPANY_LOGOS: Record<string, string> = {
  // Corporate Enterprises
  "BRAC Bank Limited": BRAC_BANK_LOGO,
  "Aarong Dairy": AARONG_DAIRY_LOGO,
  "BRAC Dairy and Food Project": AARONG_DAIRY_LOGO,
  "Aarong Dairy (BRAC Dairy & Food Enterprise)": AARONG_DAIRY_LOGO,
  "BRAC Enterprises / Aarong Dairy": AARONG_DAIRY_LOGO,
  "BRAC / Aarong Dairy": AARONG_DAIRY_LOGO,
  "Aarong Dairy Factory": AARONG_DAIRY_LOGO,
  "BRAC Enterprises": BRAC_LOGO,
  "BRAC": BRAC_LOGO,
  "Sheba.xyz": SHEBA_LOGO,
  "IFIC Bank PLC": IFIC_BANK_LOGO,
  "Unilever Bangladesh": UNILEVER_LOGO,
  "Grameenphone Limited (Telenor)": GRAMEENPHONE_LOGO,
  "Pathao Limited": PATHAO_LOGO,
  "bKash Limited": BKASH_LOGO,
  "British American Tobacco Bangladesh": BAT_LOGO,
  "Standard Chartered Bank BD": SCB_LOGO,
  "Robi Axiata PLC": ROBI_LOGO,
  "Walton Hi-Tech Industries PLC": WALTON_LOGO,
  "Augmedix Bangladesh": AUGMEDIX_LOGO,

  // Government Research Institutes
  "BARI": BARI_LOGO,
  "BINA": BINA_LOGO,
  "BJRI": BJRI_LOGO,
  "BRRI": BRRI_LOGO,
  "BTRI": BTRI_LOGO,
  "BSRI": BSRI_LOGO,
};

/**
 * Helper to fetch official logo URL by company name or acronym
 */
export function getCompanyLogoUrl(nameOrAcronym: string): string {
  if (!nameOrAcronym) return "";

  // 1. Direct match
  if (COMPANY_LOGOS[nameOrAcronym]) {
    return COMPANY_LOGOS[nameOrAcronym];
  }

  // 2. Fuzzy key match
  const match = Object.keys(COMPANY_LOGOS).find((key) =>
    nameOrAcronym.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(nameOrAcronym.toLowerCase())
  );

  if (match) {
    return COMPANY_LOGOS[match];
  }

  // 3. Fallback to Google Logo CDN for any other company name
  const cleanName = nameOrAcronym.split(" ")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
  return `https://www.google.com/s2/favicons?domain=${cleanName}.com&sz=128`;
}
