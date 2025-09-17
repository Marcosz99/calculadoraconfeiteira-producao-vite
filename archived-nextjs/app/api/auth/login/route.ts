import { NextRequest, NextResponse } from 'next/server'
import { signIn } from '@/lib/auth'

// Use Node.js runtime for database operations
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 })
    }

    const result = await signIn(email, password)

    return NextResponse.json({
      success: true,
      user: result.user,
      token: result.token,
    })
  } catch (error: any) {
    console.error('Erro no login:', error)
    return NextResponse.json({ error: error.message || 'Erro interno' }, { status: 500 })
  }
}
