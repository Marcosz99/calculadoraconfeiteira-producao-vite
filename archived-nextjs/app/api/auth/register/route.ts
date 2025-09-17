import { NextRequest, NextResponse } from 'next/server'
import { signUp } from '@/lib/auth'

// Use Node.js runtime for database operations
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { email, password, nome } = await request.json()

    if (!email || !password || !nome) {
      return NextResponse.json(
        { error: 'Email, senha e nome são obrigatórios' },
        { status: 400 }
      )
    }

    const result = await signUp(email, password, nome)

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        nome: result.user.nome,
        plano: result.user.plano,
      },
      token: result.token,
    })
  } catch (error: any) {
    console.error('Erro no cadastro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 400 }
    )
  }
}
