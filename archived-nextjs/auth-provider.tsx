'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase-client'
import { Profile } from '@/lib/database-types'
import { toast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, nome: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Pegar usuário inicial
    const getInitialUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        await fetchProfile(user.id)
      }
      
      setLoading(false)
    }

    getInitialUser()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      setProfile(data)
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar seu perfil.",
        variant: "destructive",
      })
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: "Bem-vinda de volta! 🎂",
        description: "Login realizado com sucesso.",
      })
    } catch (error: any) {
      console.error('Erro no login:', error)
      
      let message = "Erro ao fazer login. Tente novamente."
      if (error.message?.includes('Invalid login credentials')) {
        message = "Email ou senha incorretos."
      } else if (error.message?.includes('Email not confirmed')) {
        message = "Por favor, confirme seu email antes de fazer login."
      }
      
      toast({
        title: "Erro no Login",
        description: message,
        variant: "destructive",
      })
      
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome,
          },
        },
      })

      if (error) throw error

      toast({
        title: "Conta criada! 🎉",
        description: "Verifique seu email para confirmar a conta.",
      })
    } catch (error: any) {
      console.error('Erro no cadastro:', error)
      
      let message = "Erro ao criar conta. Tente novamente."
      if (error.message?.includes('User already registered')) {
        message = "Este email já está cadastrado. Faça login ou recupere sua senha."
      } else if (error.message?.includes('Password should be at least 6 characters')) {
        message = "A senha deve ter pelo menos 6 caracteres."
      } else if (error.message?.includes('Signup requires a valid password')) {
        message = "Por favor, insira uma senha válida."
      }
      
      toast({
        title: "Erro no Cadastro",
        description: message,
        variant: "destructive",
      })
      
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast({
        title: "Até logo! 👋",
        description: "Logout realizado com sucesso.",
      })
    } catch (error) {
      console.error('Erro no logout:', error)
      toast({
        title: "Erro",
        description: "Erro ao fazer logout.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      setProfile(data)
      
      toast({
        title: "Perfil atualizado! ✨",
        description: "Suas informações foram salvas com sucesso.",
      })
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seu perfil.",
        variant: "destructive",
      })
      throw error
    }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}