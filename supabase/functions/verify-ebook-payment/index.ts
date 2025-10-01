import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, ebookId } = await req.json();

    if (!sessionId || !ebookId) {
      throw new Error("sessionId e ebookId são obrigatórios");
    }

    // Inicializar Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Verificar status da sessão
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ 
          paid: false, 
          message: "Pagamento ainda não confirmado" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Criar cliente Supabase
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Buscar informações do ebook
    const { data: ebook, error: ebookError } = await supabaseClient
      .from("ebooks")
      .select("*")
      .eq("id", ebookId)
      .single();

    if (ebookError || !ebook) {
      throw new Error("Ebook não encontrado");
    }

    // Verificar se usuário está autenticado
    const authHeader = req.headers.get("Authorization");
    let userId = null;
    let userEmail = session.customer_details?.email;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      if (data.user) {
        userId = data.user.id;
        userEmail = data.user.email;
      }
    }

    // Registrar compra
    const { error: purchaseError } = await supabaseClient
      .from("compras_ebooks")
      .insert({
        user_id: userId,
        ebook_id: ebookId,
        metodo_pagamento: "stripe",
        preco_pago: ebook.preco,
        status: "concluida",
        dados_pagamento: {
          session_id: sessionId,
          customer_email: userEmail,
          payment_intent: session.payment_intent,
        },
      });

    if (purchaseError) {
      console.error("Erro ao registrar compra:", purchaseError);
    }

    // Gerar link de download do arquivo
    const { data: signedUrl } = await supabaseClient.storage
      .from("ebooks")
      .createSignedUrl(ebook.arquivo_url, 3600); // 1 hora de validade

    return new Response(
      JSON.stringify({
        paid: true,
        downloadUrl: signedUrl?.signedUrl,
        ebook: {
          titulo: ebook.titulo,
          arquivo: ebook.arquivo_url,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro ao verificar pagamento:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
