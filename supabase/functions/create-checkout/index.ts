import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@18.5.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : ''
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`)
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    logStep("Function started")

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY")
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set")
    logStep("Stripe key verified")

    // Get user info from request body instead of JWT
    const requestBody = await req.json()
    const { userEmail, userName } = requestBody
    
    if (!userEmail) {
      logStep("ERROR: Missing user email")
      return new Response(JSON.stringify({ error: "Email do usuário é obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    logStep("User info received", { email: userEmail, name: userName })

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" })
    
    // Check if customer exists
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 })
    let customerId
    if (customers.data.length > 0) {
      customerId = customers.data[0].id
      logStep("Existing customer found", { customerId })
    } else {
      logStep("No existing customer found")
    }

    const origin = req.headers.get("origin") || "http://localhost:3000"
    
    // Create checkout session with Professional plan price
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price: "price_1S9yyoEkyU3B9iiU7Kbq64dK", // DoceCalc Professional - Anual R$19,90
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/upgrade-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/upgrade`,
      metadata: {
        userEmail: userEmail,
        userName: userName || '',
        plan: 'professional'
      },
      subscription_data: {
        metadata: {
          userEmail: userEmail,
          userName: userName || '',
          plan: 'professional'
        }
      }
    })

    logStep("Checkout session created", { sessionId: session.id, url: session.url })

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logStep("ERROR in create-checkout", { message: errorMessage })
    
    // Return user-friendly error messages
    let userMessage = "Erro interno do servidor"
    if (errorMessage.includes("price_")) {
      userMessage = "Erro na configuração do plano. Entre em contato com o suporte."
    } else if (errorMessage.includes("customer")) {
      userMessage = "Erro ao processar dados do cliente."
    } else if (errorMessage.includes("STRIPE_SECRET_KEY")) {
      userMessage = "Erro na configuração de pagamento. Entre em contato com o suporte."
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