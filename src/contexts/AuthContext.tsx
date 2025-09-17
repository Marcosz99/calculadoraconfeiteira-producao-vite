import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// TODO: [REMOVIDO] Supabase auth e JWT complexo estavam aqui
// Implementar: Sistema simples com localStorage para demo

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar se usuário está logado no localStorage
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('doce_user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        localStorage.removeItem('doce_user')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      setLoading(true)
      
      // TODO: [REMOVIDO] API endpoints de auth estavam aqui
      // Simulação simples para demo - em produção conectar com Supabase/Firebase
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Criar usuário mock
      const newUser: User = {
        id: Date.now().toString(),
        nome,
        email,
        plano: 'free'
      }
      
      // Salvar no localStorage
      localStorage.setItem('doce_user', JSON.stringify(newUser))
      setUser(newUser)
      
      // Navegar para dashboard
      navigate('/dashboard')
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
      
      // TODO: [REMOVIDO] Validação de senha com bcrypt estava aqui
      // Simulação simples para demo
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Login simples para demo (qualquer email/senha funciona)
      const mockUser: User = {
        id: Date.now().toString(),
        nome: 'Usuário Demo',
        email,
        plano: 'free'
      }
      
      // Salvar no localStorage
      localStorage.setItem('doce_user', JSON.stringify(mockUser))
      setUser(mockUser)
      
      // Navegar para dashboard
      navigate('/dashboard')
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = () => {
    localStorage.removeItem('doce_user')
    setUser(null)
    navigate('/')
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