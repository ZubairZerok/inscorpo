export type PaymentMethod = "bkash" | "nagad" | "sslcommerz" | "stripe";

export interface PaymentPlan {
  id: "pro" | "enterprise";
  name: string;
  priceBDT: number;
  priceUSD: number;
  period: "monthly" | "annual";
  features: string[];
}

export const PLANS: Record<string, PaymentPlan> = {
  pro_monthly: {
    id: "pro",
    name: "Pro Monthly",
    priceBDT: 999,
    priceUSD: 9,
    period: "monthly",
    features: [
      "Access to all 8+ Learning Paths & Masterclasses",
      "Unlimited AI Career Assistants & Resume Tools",
      "Verifiable High-DPI PDF Certificates",
      "Direct 1-Click Job Application Dispatch",
      "Priority Community & Mentor Q&A",
    ],
  },
  pro_annual: {
    id: "pro",
    name: "Pro Annual (Save 20%)",
    priceBDT: 7990,
    priceUSD: 75,
    period: "annual",
    features: [
      "All Pro Monthly features for 12 months",
      "2 Months Free (Save ৳1,998)",
      "Exclusive Executive Network Lounge Access",
      "Free 1-on-1 CV Audit Session",
    ],
  },
};

export interface CheckoutResult {
  success: boolean;
  transactionId: string;
  method: PaymentMethod;
  amountBDT: number;
  planId: string;
  message: string;
}

export async function processCheckoutPayment({
  planId,
  method,
  accountNumber,
}: {
  planId: string;
  method: PaymentMethod;
  accountNumber?: string;
}): Promise<CheckoutResult> {
  const plan = PLANS[planId] || PLANS["pro_monthly"];
  const transactionId = `${method.toUpperCase()}-TXN-${Math.floor(100000 + Math.random() * 900000)}`;

  // Simulate network processing delay for realism
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    success: true,
    transactionId,
    method,
    amountBDT: plan.priceBDT,
    planId: plan.id,
    message: `Payment of ৳${plan.priceBDT.toLocaleString()} processed successfully via ${method.toUpperCase()}! Transaction ID: ${transactionId}`,
  };
}
