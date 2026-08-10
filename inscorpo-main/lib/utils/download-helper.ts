/**
 * Triggers an immediate client-side file download with real content.
 */
export function triggerFileDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const SAMPLE_N8N_WORKFLOW_JSON = JSON.stringify({
  name: "INSYT Corporate — Bangla Invoice & NBR Mushak 6.3 VAT Automation Pipeline",
  nodes: [
    {
      parameters: { httpMethod: "POST", path: "bangla-invoice-webhook", responseMode: "onReceived" },
      name: "Webhook Trigger (Invoice Received)",
      type: "n8n-nodes-base.webhook",
      typeVersion: 1,
      position: [250, 300]
    },
    {
      parameters: { model: "google/gemini-flash-1.5-vision", prompt: "Extract Bangla handwritten invoice details: Total BDT, VAT Reg No (Mushak 6.3), Supplier Name, Date." },
      name: "Bangla OCR & LLM Vision Parser",
      type: "n8n-nodes-base.openAiVision",
      typeVersion: 1,
      position: [500, 300]
    },
    {
      parameters: { operation: "executeQuery", query: "INSERT INTO vat_ledger (supplier_name, Mushak_id, amount_bdt, vat_bdt, status) VALUES ($1, $2, $3, $4, 'VERIFIED')" },
      name: "PostgreSQL NBR Audit Ledger",
      type: "n8n-nodes-base.postgres",
      typeVersion: 1,
      position: [750, 300]
    }
  ],
  connections: {
    "Webhook Trigger (Invoice Received)": { main: [[{ node: "Bangla OCR & LLM Vision Parser", type: "main", index: 0 }]] },
    "Bangla OCR & LLM Vision Parser": { main: [[{ node: "PostgreSQL NBR Audit Ledger", type: "main", index: 0 }]] }
  }
}, null, 2);

export const SAMPLE_EXCEL_FINANCIAL_MODEL_CSV = `Month,Revenue (BDT),COGS (BDT),Gross Profit,EBITDA (22%),VAT Mushak 6.3 (15%),Net Income
Jan 2026,12500000,7500000,5000000,2750000,1875000,2125000
Feb 2026,14200000,8100000,6100000,3124000,2130000,2419000
Mar 2026,16800000,9400000,7400000,3696000,2520000,2864000
Apr 2026,18500000,10200000,8300000,4070000,2775000,3152000
May 2026,21000000,11500000,9500000,4620000,3150000,3570000
Jun 2026,24500000,13200000,11300000,5390000,3675000,4165000
TOTAL (H1),107500000,59900000,47600000,23650000,16125000,18295000
`;

export const SAMPLE_CASE_PLAYBOOK_TEXT = `================================================================================
INSYT CORPORATE × BAUBC — MANAGEMENT TRAINEE CASE INTERVIEW PLAYBOOK 2026
================================================================================

1. EXECUTIVE CASE FRAMEWORKS
   - Issue Tree & MECE Principles (Mutually Exclusive, Collectively Exhaustive)
   - Profitability Framework: Profit = (Price * Quantity) - (Fixed Costs + Variable Costs)
   - Market Entry Matrix: Market Attractiveness vs. Competitive Capabilities

2. FMCG & RMG BANGLADESH CASE EXAMPLES
   - Case 1: Optimizing RMG Factory Garment Compliance & Buyer Lead Times
   - Case 2: FMCG Route-to-Market Distribution Expansion in Chittagong Division
   - Case 3: MFS Cash-Out Commission Structure & Agent Network Retention

3. BEHAVIORAL INTERVIEW (STAR METHOD)
   - S: Situation | Describe the specific context
   - T: Task | What was your responsibility?
   - A: Action | What precise steps did YOU take?
   - R: Result | What was the quantified outcome (+X% efficiency / ৳Y saved)?

(c) 2026 INSYT Corporate & BAUBC Academic Board. All Rights Reserved.
`;
