'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, getUserProfile } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

type Profile = {
  id: string
  nome: string
  email?: string
  plano: 'free' | 'pro'
  valor_hora: number
  margem_padrao: number
  created_at: string
  updated_at: string
}

type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  signUp: (email: string, password: string, nome: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  signUp: async () => {},
  signIn: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      if (currentUser) {
        try {
          const userProfile = await getUserProfile(currentUser.id)
          setProfile(userProfile)
        } catch (error) {
          console.error('Erro ao carregar perfil:', error)
        }
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        
        if (currentUser) {
          try {
            const userProfile = await getUserProfile(currentUser.id)
            setProfile(userProfile)
          } catch (error) {
            console.error('Erro ao carregar perfil:', error)
            setProfile(null)
          }
        } else {
          setProfile(null)
        }
        
        setLoading(false)

        if (event === 'SIGNED_IN') {
          router.push('/dashboard')
        } else if (event === 'SIGNED_OUT') {
          router.push('/')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome
          },
          emailRedirectTo: undefined // Remove verificação de email
        }
      })

      if (error) {
        throw error
      }

      // Se o usuário foi criado mas precisa de confirmação, vamos fazer login direto
      if (data.user && !data.session) {
        // Tentar fazer login direto
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (signInError) {
          console.error('Erro no login automático:', signInError)
          throw new Error('Conta criada! Tente fazer login.')
        }
      }

      // Criar perfil do usuário na tabela profiles
      const userId = data.user?.id || data.session?.user?.id
      if (userId) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            nome: nome,
            email: email,
            plano: 'free'
          })

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError)
        }
      }
    } catch (error) {
      console.error('Erro no cadastro:', error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, signUp, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}