import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, ebookId, downloadUrl } = await req.json();

    if (!email || !ebookId || !downloadUrl) {
      throw new Error("email, ebookId e downloadUrl são obrigatórios");
    }

    // Criar cliente Supabase
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Buscar informações do ebook
    const { data: ebook } = await supabaseClient
      .from("ebooks")
      .select("*")
      .eq("id", ebookId)
      .single();

    if (!ebook) {
      throw new Error("Ebook não encontrado");
    }

    // Enviar e-mail
    const emailResponse = await resend.emails.send({
      from: "DoceCalc <onboarding@resend.dev>",
      to: [email],
      subject: `Seu ebook "${ebook.titulo}" está pronto para download!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ec4899;">Obrigado pela sua compra! 🎉</h1>
          
          <p>Olá!</p>
          
          <p>Sua compra do ebook <strong>"${ebook.titulo}"</strong> foi confirmada com sucesso!</p>
          
          <p>Você pode fazer o download do seu ebook clicando no botão abaixo:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${downloadUrl}" 
               style="background-color: #ec4899; 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block;
                      font-weight: bold;">
              📥 Baixar Ebook
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            <strong>Importante:</strong> Este link de download é válido por 24 horas.
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <p style="color: #666; font-size: 12px;">
            Você também pode acessar seus ebooks a qualquer momento na seção "Meus Ebooks" do DoceCalc.
          </p>
          
          <p style="color: #666; font-size: 12px;">
            Dúvidas? Entre em contato conosco respondendo este e-mail.
          </p>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Com carinho,<br>
            <strong>Equipe DoceCalc</strong>
          </p>
        </div>
      `,
    });

    console.log("E-mail enviado com sucesso:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, messageId: emailResponse.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
