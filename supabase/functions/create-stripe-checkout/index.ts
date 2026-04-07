import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@16.5.0?target=denonext";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2024-06-20",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const appBaseUrl = Deno.env.get("APP_BASE_URL") || "";

const PACKS: Record<string, { coinAmount: number; usdPrice: number }> = {
  pack100: { coinAmount: 100, usdPrice: 2.99 },
  pack500: { coinAmount: 500, usdPrice: 5.99 },
  pack1000: { coinAmount: 1000, usdPrice: 9.99 },
  pack10000: { coinAmount: 10000, usdPrice: 19.99 },
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders,
  });
}

function normalizeEmail(value: string) {
  return String(value || "").trim().toLowerCase();
}

async function sha256Hex(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const { packId, email, password } = await req.json();

    const normalizedEmail = normalizeEmail(email);
    const rawPassword = String(password || "");
    const pack = PACKS[String(packId || "")];

    if (!normalizedEmail || !rawPassword) {
      return json({ error: "Missing email or password" }, 400);
    }

    if (!pack) {
      return json({ error: "Invalid packId" }, 400);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);

    const { data: profile, error: profileError } = await admin
      .from("player_profiles")
      .select("id,email,password_hash")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (profileError) {
      return json({ error: "Failed to look up player profile", detail: profileError.message }, 500);
    }

    if (!profile) {
      return json({ error: "Account not found" }, 404);
    }

    const submittedHash = await sha256Hex(rawPassword);
    const storedSecret = String(profile.password_hash || "");
    const secretMatches = storedSecret === submittedHash;

    if (!secretMatches) {
      return json({
        error: "Incorrect email or password",
      }, 401);
    }

    const { data: order, error: orderError } = await admin
      .from("purchase_orders")
      .insert({
        player_profile_id: profile.id,
        player_email: profile.email,
        pack_id: packId,
        coin_amount: pack.coinAmount,
        usd_price: pack.usdPrice,
        provider: "stripe",
        status: "pending",
      })
      .select()
      .single();

    if (orderError || !order) {
      return json(
        {
          error: "Failed to create purchase order",
          detail: orderError?.message || "Unknown order error",
        },
        500,
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${appBaseUrl}/?checkout=success&order_id=${order.id}`,
      cancel_url: `${appBaseUrl}/?checkout=cancelled&order_id=${order.id}`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${pack.coinAmount} Coins`,
              description: `Zombie Mayhem coin pack: ${pack.coinAmount}`,
            },
            unit_amount: Math.round(pack.usdPrice * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        order_id: order.id,
        player_profile_id: profile.id,
        pack_id: String(packId),
        coin_amount: String(pack.coinAmount),
        player_email: profile.email,
      },
    });

    const { error: updateError } = await admin
      .from("purchase_orders")
      .update({
        provider_checkout_id: session.id,
        provider_checkout_url: session.url,
        status: "checkout_created",
      })
      .eq("id", order.id);

    if (updateError) {
      return json(
        {
          error: "Failed to store checkout session",
          detail: updateError.message,
        },
        500,
      );
    }

    return json({
      ok: true,
      orderId: order.id,
      checkoutUrl: session.url,
    });
  } catch (err) {
    return json(
      {
        error: "Unhandled create-stripe-checkout error",
        detail: err instanceof Error ? err.message : String(err),
      },
      500,
    );
  }
});
