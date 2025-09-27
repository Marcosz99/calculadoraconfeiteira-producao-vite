import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CANCEL-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Cancel subscription function started");

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

    const { reason } = await req.json();

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    // Buscar assinatura ativa do usuário
    const { data: subscription, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (subError || !subscription) {
      throw new Error("Nenhuma assinatura ativa encontrada");
    }

    logStep("Active subscription found", { subscriptionId: subscription.subscription_id });

    // Buscar metadados da assinatura no Stripe para verificar compromisso
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.subscription_id);
    
    const commitmentStartDate = new Date(stripeSubscription.metadata.commitment_start_date);
    const commitmentEndDate = new Date(commitmentStartDate);
    commitmentEndDate.setMonth(commitmentEndDate.getMonth() + 12);
    
    const now = new Date();
    const isWithinCommitment = now < commitmentEndDate;
    
    logStep("Commitment check", { 
      commitmentStartDate: commitmentStartDate.toISOString(),
      commitmentEndDate: commitmentEndDate.toISOString(),
      isWithinCommitment 
    });

    if (isWithinCommitment) {
      // Calcular multa por cancelamento antecipado
      const monthsRemaining = Math.ceil((commitmentEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));
      const monthlyAmount = 19.90;
      const cancellationFee = monthsRemaining * monthlyAmount;
      
      logStep("Early cancellation detected", { 
        monthsRemaining,
        cancellationFee,
        reason 
      });

      // Criar invoice para multa de cancelamento
      const invoice = await stripe.invoices.create({
        customer: stripeSubscription.customer as string,
        description: `Multa por cancelamento antecipado - ${monthsRemaining} meses restantes do compromisso`,
        metadata: {
          user_id: user.id,
          cancellation_reason: reason || 'não informado',
          months_remaining: monthsRemaining.toString(),
          original_subscription_id: subscription.subscription_id
        }
      });

      // Adicionar item da multa
      await stripe.invoiceItems.create({
        customer: stripeSubscription.customer as string,
        invoice: invoice.id,
        amount: Math.round(cancellationFee * 100), // Convertendo para centavos
        currency: 'brl',
        description: `Multa por cancelamento antecipado do contrato de 12 meses`,
      });

      // Finalizar e enviar invoice
      await stripe.invoices.finalizeInvoice(invoice.id);
      
      logStep("Cancellation fee invoice created", { invoiceId: invoice.id, amount: cancellationFee });

      // Cancelar assinatura
      await stripe.subscriptions.cancel(subscription.subscription_id);
      
      return new Response(JSON.stringify({ 
        success: true,
        message: "Assinatura cancelada com cobrança de multa por cancelamento antecipado",
        cancellationFee: cancellationFee,
        monthsRemaining: monthsRemaining,
        invoiceId: invoice.id
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else {
      // Cancelamento após período de compromisso - sem multa
      await stripe.subscriptions.cancel(subscription.subscription_id);
      
      logStep("Subscription cancelled without fee", { subscriptionId: subscription.subscription_id });
      
      return new Response(JSON.stringify({ 
        success: true,
        message: "Assinatura cancelada sem multa",
        cancellationFee: 0
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in cancel-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});