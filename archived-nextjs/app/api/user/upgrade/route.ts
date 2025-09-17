import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    const { paymentIntentId, plan = 'pro' } = body

    // Verificar se o usuário está autenticado
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Atualizar o plano do usuário no banco de dados
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        plano: plan,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('Erro ao atualizar perfil:', updateError)
      return NextResponse.json(
        { error: 'Erro ao atualizar perfil do usuário' },
        { status: 500 }
      )
    }

    // Opcional: Salvar informações do pagamento para histórico
    /*
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        payment_intent_id: paymentIntentId,
        amount: 2900, // R$ 29,00 em centavos
        currency: 'BRL',
        status: 'completed',
        plan: plan,
        method: 'stripe',
        created_at: new Date().toISOString()
      })

    if (paymentError) {
      console.error('Erro ao salvar pagamento:', paymentError)
      // Não falhar a requisição se não conseguir salvar o histórico
    }
    */

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: 'Upgrade realizado com sucesso!'
    })

  } catch (error: any) {
    console.error('Erro ao fazer upgrade do usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}