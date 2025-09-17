'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// Removido import de lib/auth para evitar erro de DATABASE_URL no cliente

type Profile = {
  id: string
  nome: string
  email: string
  plano: string
  taxa_horaria: string
  margem_lucro: string
  created_at: Date
  updated_at: Date
}

type AuthContextType = {
  user: Profile | null
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

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar se usuário está logado
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (token) {
          // Por simplicidade, vamos apenas verificar se o token existe
          // Em um app real, você validaria o token no servidor
          try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            if (payload.exp * 1000 > Date.now()) {
              setUser({
                id: payload.userId,
                email: payload.email,
                nome: payload.nome,
                plano: 'free',
                taxa_horaria: '25.00',
                margem_lucro: '30.00',
                created_at: new Date(),
                updated_at: new Date()
              })
            } else {
              localStorage.removeItem('auth_token')
            }
          } catch {
            localStorage.removeItem('auth_token')
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        localStorage.removeItem('auth_token')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nome })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro no cadastro')
      }
      
      // Salvar token e usuário
      localStorage.setItem('auth_token', result.token)
      setUser(result.user)
      
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
    try {
      setLoading(true)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro no login')
      }
      
      // Salvar token e usuário
      localStorage.setItem('auth_token', result.token)
      setUser(result.user)
      
      // Redirecionar para dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = () => {
    localStorage.removeItem('auth_token')
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