import { NextRequest, NextResponse } from "next/server";
import { processCheckoutPayment, PaymentMethod } from "@/lib/payments";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId = "pro_monthly", method = "bkash", accountNumber = "" } = body;

    if (!["bkash", "nagad", "sslcommerz", "stripe"].includes(method)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    const result = await processCheckoutPayment({
      planId,
      method: method as PaymentMethod,
      accountNumber,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Payments Checkout] Error:", error);
    return NextResponse.json(
      { error: "Payment processing failed. Please try again." },
      { status: 500 }
    );
  }
}
