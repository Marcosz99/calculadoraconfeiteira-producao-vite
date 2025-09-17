'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type User = {
  id: string
  nome: string
  email: string
  plano: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signOut: () => void
  signUp: (email: string, password: string, nome: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: () => {},
  signUp: async () => {},
  signIn: async () => {},
})

export function LocalAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar se usuário está logado - só no lado cliente
    const checkAuth = () => {
      try {
        // Garantir que estamos no lado cliente
        if (typeof window !== 'undefined') {
          const savedUser = localStorage.getItem('doce_user')
          if (savedUser) {
            setUser(JSON.parse(savedUser))
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('doce_user')
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      setLoading(true)
      
      // Chamada para API de cadastro
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, nome }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro no cadastro')
      }
      
      // Salvar usuário e token
      const userForState = data.user
      setUser(userForState)
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('doce_user', JSON.stringify(userForState))
        localStorage.setItem('doce_token', data.token)
        // Definir cookie também para o middleware (sem secure para funcionar em desenvolvimento)
        document.cookie = `doce_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`
      }
      
      // Redirecionar para dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Erro no cadastro:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log('🚀 signIn chamado com:', { email })
    
    try {
      setLoading(true)
      
      console.log('🔄 LocalAuthProvider: Iniciando login...')
      
      // Chamada para API de login
      console.log('📡 Fazendo fetch para /api/auth/login')
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      console.log('📥 Resposta recebida, status:', response.status)
      const data = await response.json()
      console.log('📄 Data recebida:', data)
      
      if (!response.ok || !data.success) {
        console.log('❌ Erro na resposta')
        throw new Error(data.error || 'Erro no login')
      }
      
      // Salvar usuário e token
      const userForState = {
        id: data.user.id,
        nome: data.user.nome,
        email: data.user.email,
        plano: data.user.plano || 'free'
      }
      
      console.log('💾 Definindo usuário:', userForState)
      setUser(userForState)
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('doce_user', JSON.stringify(userForState))
        localStorage.setItem('doce_token', data.token)
        // Definir cookie também para o middleware (sem secure para funcionar em desenvolvimento)
        document.cookie = `doce_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`
        console.log('💾 Dados salvos no localStorage e cookie')
      }
      
      console.log('🔄 Redirecionando para /dashboard...')
      // Redirecionar para dashboard
      router.push('/dashboard')
      console.log('✅ Redirecionamento executado')
    } catch (error) {
      console.error('💥 LocalAuthProvider: Erro no login:', error)
      throw error
    } finally {
      console.log('🔄 Finalizando (setLoading false)')
      setLoading(false)
    }
  }

  const signOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('doce_user')
      localStorage.removeItem('doce_token')
      // Remover cookie também
      document.cookie = 'doce_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    }
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signUp, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}