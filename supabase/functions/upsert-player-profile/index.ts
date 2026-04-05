import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return json({ error: "Missing bearer token" }, 401);
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const { data: userData, error: userError } = await userClient.auth.getUser();

    if (userError || !userData?.user) {
      return json(
        { error: "Unauthorized", detail: userError?.message || "Invalid user session" },
        401,
      );
    }

    const user = userData.user;
    const email = normalizeEmail(user.email || "");

    if (!email) {
      return json({ error: "Authenticated user has no email" }, 400);
    }

    const body = await req.json();
    const profile = body?.profile || {};
    const passwordHash = String(body?.passwordHash || "");

    if (!passwordHash) {
      return json({ error: "Missing passwordHash" }, 400);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);

    const { data: existingByUserId, error: existingByUserError } = await admin
      .from("player_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingByUserError) {
      return json({ error: "Failed to query profile by user_id", detail: existingByUserError.message }, 500);
    }

    if (existingByUserId) {
      const { data: updated, error: updateError } = await admin
        .from("player_profiles")
        .update({
          password_hash: passwordHash,
          email,
          auth_migrated: true,
          best: Number(profile.best || 0),
          bank_coins: Number(profile.bankCoins || 0),
          avatar_coins: Number(profile.avatarCoins || 0),
          selected_avatar: profile.selectedAvatar || "default",
          unlocked_avatars: profile.unlockedAvatars || ["default"],
          mission_index: Number(profile.missionIndex || 0),
          mission_progress: Number(profile.missionProgress || 0),
          pass_level: Number(profile.passLevel || 1),
          pass_xp: Number(profile.passXp || 0),
          starter_pack_claimed: !!profile.starterPackClaimed,
          daily_reward_claimed_on: profile.dailyRewardClaimedOn || null,
          achievement_flags: profile.achievementFlags || [],
          lifetime_coins: Number(profile.lifetimeCoins || 0),
          lifetime_purchased_coins: Number(profile.lifetimePurchasedCoins || 0),
        })
        .eq("id", existingByUserId.id)
        .select()
        .single();

      if (updateError) {
        return json({ error: "Failed to update profile", detail: updateError.message }, 500);
      }

      return json({ ok: true, profile: updated });
    }

    const { data: existingByEmail, error: existingByEmailError } = await admin
      .from("player_profiles")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (existingByEmailError) {
      return json({ error: "Failed to query profile by email", detail: existingByEmailError.message }, 500);
    }

    if (existingByEmail) {
      const { data: linked, error: linkError } = await admin
        .from("player_profiles")
        .update({
          user_id: user.id,
          email,
          password_hash: passwordHash,
          auth_migrated: true,
          best: Number(profile.best || 0),
          bank_coins: Number(profile.bankCoins || 0),
          avatar_coins: Number(profile.avatarCoins || 0),
          selected_avatar: profile.selectedAvatar || "default",
          unlocked_avatars: profile.unlockedAvatars || ["default"],
          mission_index: Number(profile.missionIndex || 0),
          mission_progress: Number(profile.missionProgress || 0),
          pass_level: Number(profile.passLevel || 1),
          pass_xp: Number(profile.passXp || 0),
          starter_pack_claimed: !!profile.starterPackClaimed,
          daily_reward_claimed_on: profile.dailyRewardClaimedOn || null,
          achievement_flags: profile.achievementFlags || [],
          lifetime_coins: Number(profile.lifetimeCoins || 0),
          lifetime_purchased_coins: Number(profile.lifetimePurchasedCoins || 0),
        })
        .eq("id", existingByEmail.id)
        .select()
        .single();

      if (linkError) {
        return json({ error: "Failed to link legacy profile", detail: linkError.message }, 500);
      }

      return json({ ok: true, profile: linked });
    }

    const { data: inserted, error: insertError } = await admin
      .from("player_profiles")
      .insert({
        id: crypto.randomUUID(),
        user_id: user.id,
        email,
        password_hash: passwordHash,
        auth_migrated: true,
        best: Number(profile.best || 0),
        bank_coins: Number(profile.bankCoins || 0),
        avatar_coins: Number(profile.avatarCoins || 0),
        selected_avatar: profile.selectedAvatar || "default",
        unlocked_avatars: profile.unlockedAvatars || ["default"],
        mission_index: Number(profile.missionIndex || 0),
        mission_progress: Number(profile.missionProgress || 0),
        pass_level: Number(profile.passLevel || 1),
        pass_xp: Number(profile.passXp || 0),
        starter_pack_claimed: !!profile.starterPackClaimed,
        daily_reward_claimed_on: profile.dailyRewardClaimedOn || null,
        achievement_flags: profile.achievementFlags || [],
        lifetime_coins: Number(profile.lifetimeCoins || 0),
        lifetime_purchased_coins: Number(profile.lifetimePurchasedCoins || 0),
      })
      .select()
      .single();

    if (insertError) {
      return json({ error: "Failed to insert profile", detail: insertError.message }, 500);
    }

    return json({ ok: true, profile: inserted });
  } catch (err) {
    return json(
      {
        error: "Unhandled upsert-player-profile error",
        detail: err instanceof Error ? err.message : String(err),
      },
      500,
    );
  }
});
