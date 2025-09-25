import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { customerEmail, customerName, paymentMethodId } = await req.json();
    
    if (!customerEmail || !paymentMethodId) {
      throw new Error("Missing required fields: customerEmail and paymentMethodId");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    // Verificar se cliente já existe
    let customerId;
    const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      // Criar novo cliente
      const customer = await stripe.customers.create({
        email: customerEmail,
        name: customerName || customerEmail,
        metadata: {
          user_id: user.id
        }
      });
      customerId = customer.id;
      logStep("New customer created", { customerId });
    }

    // Anexar método de pagamento ao cliente
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Definir como método padrão
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    logStep("Payment method attached and set as default");

    // Criar assinatura com compromisso de 12 meses
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: "price_1SAKIuEkyU3B9iiUJwohHHZs", // Preço do DoceCalc Professional Mensal
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        user_id: user.id,
        minimum_commitment_months: "12",
        commitment_start_date: new Date().toISOString()
      },
      // Impedir cancelamento nos primeiros 12 meses
      cancel_at_period_end: false,
    });

    logStep("Subscription created", { subscriptionId: subscription.id });

    // Salvar dados da assinatura no Supabase
    const { error: dbError } = await supabaseClient
      .from('subscriptions')
      .insert({
        user_id: user.id,
        customer_id: customerId,
        subscription_id: subscription.id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        plan_id: 'professional',
        cancel_at_period_end: subscription.cancel_at_period_end
      });

    if (dbError) {
      logStep("Database error", { error: dbError });
      throw new Error(`Database error: ${dbError.message}`);
    }

    // Atualizar status na tabela profiles
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .update({ 
        plano: 'professional',
        subscription_status: subscription.status 
      })
      .eq('id', user.id);

    if (profileError) {
      logStep("Profile update error", { error: profileError });
    }

    logStep("Subscription saved to database");

    const response = {
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
      status: subscription.status
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});