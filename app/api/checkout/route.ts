import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "../../../lib/supabase-server";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Get authenticated user if available
  let userId: string | null = null;
  let userEmail: string | undefined;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
    userEmail = user?.email;
  } catch {}

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: 500, // $5.00
          product_data: {
            name: "MusicRight.AI — Early Access",
            description: "Reserve your spot in the Creator Wallet first-user list. Applied to your first song setup.",
            images: [`${appUrl}/og-image.png`],
          },
        },
        quantity: 1,
      },
    ],
    customer_email: userEmail,
    metadata: {
      user_id: userId ?? "",
      product: "early_access",
    },
    success_url: `${appUrl}/early-access/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/early-access`,
  });

  return NextResponse.json({ url: session.url });
}
