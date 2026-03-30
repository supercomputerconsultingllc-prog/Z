import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PACKS: Record<string, { coinAmount: number; usdPrice: number }> = {
  pack100: { coinAmount: 100, usdPrice: 2.99 },
  pack500: { coinAmount: 500, usdPrice: 5.99 },
  pack1000: { coinAmount: 1000, usdPrice: 9.99 },
  pack10000: { coinAmount: 10000, usdPrice: 19.99 },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization') || '';
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { global: { headers: authHeader ? { Authorization: authHeader } : {} } }
    );

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { packId } = await req.json();
    const pack = PACKS[String(packId || '')];
    if (!pack) {
      return new Response(JSON.stringify({ error: 'Invalid packId' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const email = userData.user.email || '';
    const { data: profile, error: profileError } = await supabase
      .from('player_profiles')
      .select('id,email')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: 'Player profile not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const checkoutBase = Deno.env.get('COINBASE_CHECKOUT_BASE_URL') || 'REPLACE_WITH_HOSTED_CHECKOUT_BASE_URL';
    const providerCheckoutUrl = `${checkoutBase}?pack=${encodeURIComponent(String(packId))}&order_ref=pending`;

    const { data: order, error: orderError } = await supabase
      .from('purchase_orders')
      .insert({
        player_profile_id: profile.id,
        player_email: profile.email,
        pack_id: String(packId),
        coin_amount: pack.coinAmount,
        usd_price: pack.usdPrice,
        provider: 'coinbase',
        provider_checkout_url: providerCheckoutUrl,
        status: 'checkout_created',
        metadata: { source: 'edge-function:create-checkout' },
      })
      .select('id, provider_checkout_url')
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: orderError?.message || 'Failed to create order' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ orderId: order.id, checkoutUrl: order.provider_checkout_url }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
