import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

// AbacatePay API integration for PIX payments
// Documentação: https://abacatepay.readme.io/reference

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, description, customerName, customerEmail } = body

    // Simular criação de pagamento PIX via AbacatePay
    // Na implementação real, você faria uma chamada para a API do AbacatePay
    
    // Exemplo de requisição AbacatePay (implementar quando tiver as credenciais)
    /*
    const abacatePayResponse = await fetch('https://api.abacatepay.com/v1/billing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACATEPAY_API_KEY}`,
      },
      body: JSON.stringify({
        frequency: 'ONE_TIME',
        methods: ['PIX'],
        products: [{
          external_id: `docecalc_pro_${Date.now()}`,
          name: 'DoceCalc PRO - Plano Mensal',
          description: description,
          quantity: 1,
          price: Math.round(amount * 100) // Converter para centavos
        }],
        metadata: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
          completion_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade/success`
        },
        customer: {
          metadata: {
            name: customerName,
            email: customerEmail,
            tax_id: null // CPF opcional
          }
        }
      })
    })

    if (!abacatePayResponse.ok) {
      throw new Error('Erro ao criar pagamento PIX')
    }

    const pixData = await abacatePayResponse.json()
    */

    // Por enquanto, simular resposta do AbacatePay
    const pixData = {
      id: `pix_${Date.now()}`,
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      pixKey: `00020126330014BR.GOV.BCB.PIX0111${Math.random().toString(36).substring(2, 15)}520400005303986540${amount.toFixed(2)}5802BR5913${customerName}6009SAO PAULO61080540900062070503***6304${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      paymentId: `payment_${Date.now()}`,
      amount: amount,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    // Salvar pagamento no banco de dados (opcional, para tracking)
    /*
    const { error: dbError } = await supabase
      .from('payments')
      .insert({
        payment_id: pixData.paymentId,
        user_id: userSession.user.id,
        amount: amount,
        currency: 'BRL',
        method: 'pix',
        status: 'pending',
        metadata: {
          description,
          customer_name: customerName,
          customer_email: customerEmail
        }
      })

    if (dbError) {
      console.error('Erro ao salvar pagamento:', dbError)
    }
    */

    return NextResponse.json({
      qrCode: pixData.qrCode,
      pixKey: pixData.pixKey,
      paymentId: pixData.paymentId,
      amount: pixData.amount,
      status: pixData.status
    })

  } catch (error: any) {
    console.error('Erro ao criar pagamento PIX:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}