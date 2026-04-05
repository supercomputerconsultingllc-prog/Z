import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@16.5.0?target=denonext";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2024-06-20",
});

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response("Missing stripe-signature header", { status: 400 });
    }

    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const orderId = session.metadata?.order_id;
      if (!orderId) {
        return new Response("Missing order_id metadata", { status: 400 });
      }

      const admin = createClient(supabaseUrl, serviceRoleKey);

      const { error: updateError } = await admin
        .from("purchase_orders")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
          provider_charge_id: session.payment_intent?.toString() || null,
          provider_event_id: event.id,
        })
        .eq("id", orderId);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: "Failed to update purchase order", detail: updateError.message }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }

      const { error: rpcError } = await admin.rpc("grant_paid_coins", {
        p_order_id: orderId,
      });

      if (rpcError) {
        return new Response(
          JSON.stringify({ error: "Failed to grant coins", detail: rpcError.message }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Webhook handler failed",
        detail: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});
