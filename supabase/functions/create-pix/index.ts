import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const abacatePayToken = Deno.env.get('ABACATE_PAY_TOKEN')!

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Creating PIX payment with Abacate Pay...')
    
    const { amount, description, customer, metadata } = await req.json()
    
    // Validar campos obrigatórios
    if (!customer || !customer.name || !customer.cellphone || !customer.email || !customer.taxId) {
      console.error('Missing required customer fields')
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios: nome, telefone, email e CPF' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Calling Abacate Pay API...')
    
    const abacateResponse = await fetch('https://api.abacatepay.com/v1/pixQrCode/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${abacatePayToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Converter para centavos
        expiresIn: 15 * 60, // 15 minutos em segundos
        description: description || 'Upgrade para Plano Professional',
        customer: {
          name: customer.name,
          cellphone: customer.cellphone,
          email: customer.email,
          taxId: customer.taxId
        },
        metadata: metadata || {}
      }),
    })

    const responseData = await abacateResponse.json()
    console.log('Abacate Pay response:', responseData)

    if (!abacateResponse.ok) {
      console.error('Abacate Pay API error:', responseData)
      return new Response(
        JSON.stringify({ error: 'Erro ao criar pagamento PIX', details: responseData }),
        { status: abacateResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (responseData.error) {
      console.error('Abacate Pay returned error:', responseData.error)
    // Return user-friendly error messages
    let userMessage = "Erro ao criar pagamento PIX";
    if (responseData.error === "Invalid taxId") {
      userMessage = "CPF inválido. Por favor, digite um CPF válido no formato: 000.000.000-00";
    } else if (responseData.error === "Invalid cellphone") {
      userMessage = "Telefone inválido. Use o formato: (11) 99999-9999";
    } else if (responseData.error === "Invalid email") {
      userMessage = "Email inválido. Verifique o endereço de email";
    } else if (responseData.error === "Invalid amount") {
      userMessage = "Valor do pagamento inválido";
    }
    
    return new Response(
      JSON.stringify({ error: userMessage, details: responseData.error }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    }

    // Salvar informações do pagamento no banco
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { error: dbError } = await supabase
      .from('pagamentos')
      .insert({
        user_id: metadata?.userId || null,
        valor: amount,
        plano: 'professional',
        tipo_pagamento: 'pix',
        status: 'pendente',
        referencia_externa: responseData.data.id,
        dados_pagamento: responseData.data,
        data_vencimento: responseData.data.expiresAt,
        observacoes: 'Pagamento PIX via Abacate Pay'
      })

    if (dbError) {
      console.error('Error saving payment to database:', dbError)
      // Não falhar a requisição por causa do banco, mas logar o erro
    }

    console.log('PIX payment created successfully:', responseData.data.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: responseData.data 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in create-pix function:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})