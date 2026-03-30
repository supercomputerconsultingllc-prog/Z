import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const payload = await req.json();
    const orderId = payload?.metadata?.orderId || payload?.orderId || null;
    const providerChargeId = payload?.charge_id || payload?.id || null;
    const providerEventId = payload?.event_id || null;
    const status = String(payload?.status || '').toLowerCase();

    if (!orderId) {
      return new Response(JSON.stringify({ error: 'Missing orderId' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // TODO: verify provider webhook signature before trusting payload.
    const paid = status === 'paid' || status === 'confirmed' || status === 'completed';
    if (!paid) {
      return new Response(JSON.stringify({ ok: true, ignored: true, status }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { error: updateError } = await supabase
      .from('purchase_orders')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        provider_charge_id: providerChargeId,
        provider_event_id: providerEventId,
        metadata: { source: 'edge-function:coinbase-webhook', rawStatus: status },
      })
      .eq('id', orderId);

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: grantResult, error: grantError } = await supabase.rpc('grant_paid_coins', { p_order_id: orderId });
    if (grantError) {
      return new Response(JSON.stringify({ error: grantError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ ok: true, grantResult }), {
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
