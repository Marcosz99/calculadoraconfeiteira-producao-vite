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
    console.log('Checking PIX payment status...')
    
    const { pixId } = await req.json()
    
    if (!pixId) {
      return new Response(
        JSON.stringify({ error: 'PIX ID é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Calling Abacate Pay check API for PIX:', pixId)
    
    const abacateResponse = await fetch(`https://api.abacatepay.com/v1/pixQrCode/check/${pixId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${abacatePayToken}`,
        'Content-Type': 'application/json',
      },
    })

    const responseData = await abacateResponse.json()
    console.log('Abacate Pay check response:', responseData)

    if (!abacateResponse.ok) {
      console.error('Abacate Pay API error:', responseData)
      return new Response(
        JSON.stringify({ error: 'Erro ao verificar status do PIX', details: responseData }),
        { status: abacateResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (responseData.error) {
      console.error('Abacate Pay returned error:', responseData.error)
      return new Response(
        JSON.stringify({ error: 'Erro na API Abacate Pay', details: responseData.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Se o pagamento foi aprovado, atualizar no banco
    if (responseData.data.status === 'PAID') {
      console.log('Payment confirmed as PAID, updating database...')
      
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      
      const { error: updateError } = await supabase
        .from('pagamentos')
        .update({
          status: 'aprovado',
          data_pagamento: new Date().toISOString(),
          dados_pagamento: responseData.data,
          updated_at: new Date().toISOString()
        })
        .eq('referencia_externa', pixId)

      if (updateError) {
        console.error('Error updating payment status:', updateError)
      } else {
        console.log('Payment status updated successfully')
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: responseData.data 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in check-pix-status function:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})