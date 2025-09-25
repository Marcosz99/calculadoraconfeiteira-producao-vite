import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("Missing stripe-signature header");
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      // Verificar assinatura do webhook (opcional - adicionar WEBHOOK_SECRET se necessário)
      const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } else {
        event = JSON.parse(body);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      logStep("Webhook signature verification failed", { error: errorMsg });
      return new Response(`Webhook Error: ${errorMsg}`, { status: 400 });
    }

    logStep("Event received", { type: event.type, id: event.id });

    // Processar diferentes tipos de eventos
    switch (event.type) {
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Payment succeeded", { 
          invoiceId: invoice.id, 
          customerId: invoice.customer,
          subscriptionId: invoice.subscription 
        });

        // Atualizar status da assinatura para ativa
        if (invoice.subscription) {
          const { error: subError } = await supabaseClient
            .from('subscriptions')
            .update({ 
              status: 'active',
              updated_at: new Date().toISOString()
            })
            .eq('subscription_id', invoice.subscription);

          if (subError) {
            logStep("Error updating subscription", { error: subError });
          }

          // Buscar user_id da assinatura para atualizar perfil
          const { data: subscription } = await supabaseClient
            .from('subscriptions')
            .select('user_id')
            .eq('subscription_id', invoice.subscription)
            .single();

          if (subscription?.user_id) {
            // Atualizar perfil do usuário
            const { error: profileError } = await supabaseClient
              .from('profiles')
              .update({ 
                plano: 'professional',
                subscription_status: 'active'
              })
              .eq('id', subscription.user_id);

            if (profileError) {
              logStep("Error updating profile", { error: profileError });
            }

            logStep("User activated", { userId: subscription.user_id });
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Payment failed", { 
          invoiceId: invoice.id, 
          customerId: invoice.customer,
          subscriptionId: invoice.subscription,
          attemptCount: invoice.attempt_count
        });

        // Registrar falha de pagamento
        if (invoice.subscription) {
          const { error: subError } = await supabaseClient
            .from('subscriptions')
            .update({ 
              status: 'past_due',
              updated_at: new Date().toISOString()
            })
            .eq('subscription_id', invoice.subscription);

          if (subError) {
            logStep("Error updating subscription status", { error: subError });
          }

          // Buscar user_id e atualizar perfil
          const { data: subscription } = await supabaseClient
            .from('subscriptions')
            .select('user_id')
            .eq('subscription_id', invoice.subscription)
            .single();

          if (subscription?.user_id) {
            const { error: profileError } = await supabaseClient
              .from('profiles')
              .update({ 
                subscription_status: 'past_due'
              })
              .eq('id', subscription.user_id);

            if (profileError) {
              logStep("Error updating profile for failed payment", { error: profileError });
            }
          }
        }

        // Se for a 3ª tentativa falha, cancelar assinatura
        if (invoice.attempt_count >= 3 && invoice.subscription) {
          try {
            await stripe.subscriptions.cancel(invoice.subscription as string);
            logStep("Subscription cancelled after 3 failed attempts", { 
              subscriptionId: invoice.subscription 
            });
          } catch (cancelError) {
            logStep("Error cancelling subscription", { error: cancelError });
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription deleted", { 
          subscriptionId: subscription.id,
          customerId: subscription.customer 
        });

        // Atualizar status da assinatura
        const { error: subError } = await supabaseClient
          .from('subscriptions')
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('subscription_id', subscription.id);

        if (subError) {
          logStep("Error updating cancelled subscription", { error: subError });
        }

        // Buscar user_id e atualizar perfil para plano gratuito
        const { data: subData } = await supabaseClient
          .from('subscriptions')
          .select('user_id')
          .eq('subscription_id', subscription.id)
          .single();

        if (subData?.user_id) {
          const { error: profileError } = await supabaseClient
            .from('profiles')
            .update({ 
              plano: 'free',
              subscription_status: 'cancelled'
            })
            .eq('id', subData.user_id);

          if (profileError) {
            logStep("Error updating profile for cancelled subscription", { error: profileError });
          }

          logStep("User downgraded to free plan", { userId: subData.user_id });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription updated", { 
          subscriptionId: subscription.id,
          status: subscription.status 
        });

        // Atualizar dados da assinatura
        const { error: subError } = await supabaseClient
          .from('subscriptions')
          .update({ 
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString()
          })
          .eq('subscription_id', subscription.id);

        if (subError) {
          logStep("Error updating subscription data", { error: subError });
        }
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe-webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});