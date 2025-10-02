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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Creating PIX payment for ebook...')
    
    const { ebookId, customer } = await req.json()
    
    // Validar campos obrigatórios
    if (!customer || !customer.name || !customer.cellphone || !customer.email || !customer.taxId) {
      console.error('Missing required customer fields')
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios: nome, telefone, email e CPF' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Buscar informações do ebook
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { data: ebook, error: ebookError } = await supabase
      .from('ebooks')
      .select('*')
      .eq('id', ebookId)
      .single()

    if (ebookError || !ebook) {
      console.error('Ebook not found:', ebookError)
      return new Response(
        JSON.stringify({ error: 'Ebook não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
        amount: Math.round(ebook.preco * 100), // Converter para centavos
        expiresIn: 15 * 60, // 15 minutos
        description: `Ebook: ${ebook.titulo}`,
        customer: {
          name: customer.name,
          cellphone: customer.cellphone,
          email: customer.email,
          taxId: customer.taxId
        },
        metadata: {
          ebookId: ebookId,
          type: 'ebook'
        }
      }),
    })

    const responseData = await abacateResponse.json()
    console.log('Abacate Pay response:', responseData)

    if (!abacateResponse.ok || responseData.error) {
      console.error('Abacate Pay API error:', responseData)
      
      let userMessage = "Erro ao criar pagamento PIX"
      if (responseData.error === "Invalid taxId") {
        userMessage = "CPF inválido. Por favor, digite um CPF válido no formato: 000.000.000-00"
      } else if (responseData.error === "Invalid cellphone") {
        userMessage = "Telefone inválido. Use o formato: (11) 99999-9999"
      } else if (responseData.error === "Invalid email") {
        userMessage = "Email inválido. Verifique o endereço de email"
      }
      
      return new Response(
        JSON.stringify({ error: userMessage, details: responseData.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Salvar informações do pagamento no banco (compra de ebook)
    const { error: dbError } = await supabase
      .from('compras_ebooks')
      .insert({
        ebook_id: ebookId,
        user_id: null, // Compra anônima
        preco_pago: ebook.preco,
        metodo_pagamento: 'pix',
        status: 'pendente',
        dados_pagamento: {
          ...responseData.data,
          customer: customer
        }
      })

    if (dbError) {
      console.error('Error saving ebook purchase:', dbError)
    }

    console.log('PIX payment created successfully for ebook:', responseData.data.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: responseData.data,
        ebook: {
          titulo: ebook.titulo,
          preco: ebook.preco
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in create-ebook-pix function:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
