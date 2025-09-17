import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY não está configurada')
  }
  
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe()
    const body = await request.json()
    const { amount, currency = 'brl', description, customerName, customerEmail } = body

    // Validação de entrada
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Valor deve ser um número positivo' },
        { status: 400 }
      )
    }

    if (currency !== 'brl' && currency !== 'usd') {
      return NextResponse.json(
        { error: 'Moeda deve ser BRL ou USD' },
        { status: 400 }
      )
    }

    // Criar Customer no Stripe apenas se email for válido
    let customer
    if (customerEmail && customerEmail.includes('@') && customerName) {
      try {
        const existingCustomers = await stripe.customers.list({
          email: customerEmail,
          limit: 1
        })

        if (existingCustomers.data.length > 0) {
          customer = existingCustomers.data[0]
        } else {
          customer = await stripe.customers.create({
            email: customerEmail,
            name: customerName,
            metadata: {
              source: 'docecalc_upgrade'
            }
          })
        }
      } catch (error) {
        console.error('Erro ao criar/buscar customer:', error)
        // Continuar sem customer se houver erro
      }
    }

    // Criar Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Valor em centavos
      currency: currency,
      description: description,
      customer: customer?.id,
      metadata: {
        product: 'docecalc_pro',
        plan: 'monthly',
        customer_name: customerName,
        customer_email: customerEmail
      },
      payment_method_types: ['card'],
      setup_future_usage: 'off_session', // Para salvar o método de pagamento para futuras cobranças
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })

  } catch (error: any) {
    console.error('Erro ao criar Payment Intent:', error)
    
    // Retornar erro específico do Stripe se disponível
    if (error.type === 'StripeCardError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}