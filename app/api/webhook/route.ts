import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "../../../lib/supabase";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${err}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id || null;
    const product = session.metadata?.product ?? "early_access";
    const amountCents = session.amount_total ?? 500;
    const customerEmail = session.customer_email ?? session.customer_details?.email ?? null;

    const db = getSupabaseAdmin();
    if (db) {
      await db.from("orders").insert({
        id: session.id,
        user_id: userId || null,
        plan: product,
        amount_cents: amountCents,
        stripe_session_id: session.id,
        status: "paid",
        customer_email: customerEmail,
      }).then(({ error }) => {
        if (error) console.error("Order insert error:", error.message);
      });
    }
  }

  return NextResponse.json({ received: true });
}
