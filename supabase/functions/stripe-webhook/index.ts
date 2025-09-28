import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

// Função para gerar hash SHA256 (necessário para Meta Conversions API)
async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

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

        // Buscar dados do customer
        const customer = await stripe.customers.retrieve(invoice.customer as string) as Stripe.Customer;

        // Enviar evento Purchase para Meta Pixel via Conversions API
        try {
          if (invoice.amount_paid && customer.email) {
            const purchaseAmount = invoice.amount_paid / 100 // Convertendo de centavos

            logStep('Sending Meta Pixel Purchase event', {
              email: customer.email,
              amount: purchaseAmount,
              currency: invoice.currency?.toUpperCase()
            })

            // Meta Conversions API data
            const metaPixelData = {
              data: [{
                event_name: 'Purchase',
                event_time: Math.floor(Date.now() / 1000),
                action_source: 'website',
                user_data: {
                  em: await sha256(customer.email.toLowerCase()),
                  fn: customer.name ? await sha256(customer.name.split(' ')[0].toLowerCase()) : null,
                  ln: customer.name ? await sha256(customer.name.split(' ').slice(-1)[0].toLowerCase()) : null
                },
                custom_data: {
                  currency: invoice.currency?.toUpperCase() || 'BRL',
                  value: purchaseAmount,
                  content_name: 'DoceCalc Professional Subscription',
                  content_type: 'product',
                  content_ids: ['docecalc_professional']
                }
              }],
              access_token: Deno.env.get('META_CONVERSIONS_API_TOKEN')
            }

            // Enviar para Meta Conversions API se token estiver configurado
            if (Deno.env.get('META_CONVERSIONS_API_TOKEN')) {
              const metaResponse = await fetch(`https://graph.facebook.com/v18.0/24319925394345055/events`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(metaPixelData)
              })

              if (metaResponse.ok) {
                logStep('Meta Pixel Purchase event sent successfully')
              } else {
                const errorText = await metaResponse.text()
                logStep('Meta Pixel event failed', { status: metaResponse.status, error: errorText })
              }
            } else {
              logStep('META_CONVERSIONS_API_TOKEN not configured, skipping CAPI')
            }
          }
        } catch (pixelError) {
          logStep('Pixel tracking error', { error: pixelError })
          // Não falha o webhook por causa do pixel
        }

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