import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@18.5.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : ''
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`)
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    logStep("Function started")

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY")
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set")
    logStep("Stripe key verified")

    // Get user email from request body instead of JWT
    const requestBody = await req.json()
    const { userEmail } = requestBody
    
    if (!userEmail) {
      logStep("ERROR: Missing user email")
      return new Response(JSON.stringify({ error: "Email do usuário é obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    logStep("User email received", { email: userEmail })

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" })
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 })
    
    if (customers.data.length === 0) {
      logStep("No customer found, returning unsubscribed state")
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      })
    }

    const customerId = customers.data[0].id
    logStep("Found Stripe customer", { customerId })

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    })
    const hasActiveSub = subscriptions.data.length > 0
    let productId = null
    let subscriptionEnd = null

    if (hasActiveSub) {
      const subscription = subscriptions.data[0]
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString()
      logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd })
      productId = subscription.items.data[0].price.product
      logStep("Determined subscription tier", { productId })
    } else {
      logStep("No active subscription found")
    }

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      product_id: productId,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logStep("ERROR in check-subscription", { message: errorMessage })
    
    // Return user-friendly error messages
    let userMessage = "Erro ao verificar assinatura"
    if (errorMessage.includes("STRIPE_SECRET_KEY")) {
      userMessage = "Erro na configuração. Entre em contato com o suporte."
    }
    
    return new Response(JSON.stringify({ 
      error: userMessage,
      details: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    })
  }
})