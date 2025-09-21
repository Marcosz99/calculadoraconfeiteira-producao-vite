import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

type UserProfile = {
  id: string
  nome: string
  email: string
  plano: 'free' | 'professional'
  nome_negocio?: string
  whatsapp?: string
  instagram?: string
  telefone?: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  bio?: string
  foto_perfil?: string
}

type AuthContextType = {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
  signUp: (email: string, password: string, nome: string, nomeNegocio?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  checkSubscription: () => Promise<void>
  updatePerfil: (updates: Partial<UserProfile>) => Promise<void>
  upgradeUser: (plano: 'free' | 'professional') => Promise<void>
  perfilConfeitaria?: any
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  signUp: async () => {},
  signIn: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
  checkSubscription: async () => {},
  updatePerfil: async () => {},
  upgradeUser: async () => {},
  perfilConfeitaria: null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  // Inicializar dados padrão do usuário
  const initializeUserData = async (userId: string) => {
    try {
      // Criar categorias padrão
      const categoriasPadrao = [
        { nome: 'Bolos', cor_hex: '#FF6B6B', icone: '🎂', ordem: 1 },
        { nome: 'Doces', cor_hex: '#4ECDC4', icone: '🍬', ordem: 2 },
        { nome: 'Salgados', cor_hex: '#45B7D1', icone: '🥧', ordem: 3 },
        { nome: 'Tortas', cor_hex: '#96CEB4', icone: '🥧', ordem: 4 },
        { nome: 'Sobremesas', cor_hex: '#FFEAA7', icone: '🍰', ordem: 5 }
      ]

      // Inserir categorias
      for (const categoria of categoriasPadrao) {
        await supabase.from('categorias').insert({
          user_id: userId,
          ...categoria
        })
      }

      // Criar configuração padrão
      await supabase.from('configuracoes_usuario').insert({
        user_id: userId,
        moeda: 'BRL',
        fuso_horario: 'America/Sao_Paulo',
        margem_padrao: 30,
        custo_hora_trabalho: 25.00,
        notificacoes_email: true,
        notificacoes_whatsapp: true
      })

    } catch (error) {
      console.error('Erro ao inicializar dados do usuário:', error)
    }
  }

  // Buscar perfil do usuário
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

      if (data) {
        const profile: UserProfile = {
          id: data.id,
          nome: data.nome,
          email: data.email,
          plano: (data.plano as 'free' | 'professional') || 'free',
          nome_negocio: data.nome_negocio || undefined,
          whatsapp: data.whatsapp || undefined,
          instagram: data.instagram || undefined,
          endereco: data.endereco || undefined,
          cidade: data.cidade || undefined,
          estado: data.estado || undefined,
          bio: data.bio || undefined,
          foto_perfil: data.foto_perfil || undefined
        }
        setProfile(profile)
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
    }
  }

  // Configurar listener de autenticação
  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (session?.user) {
          // Buscar perfil de forma assíncrona sem bloquear o callback
          setTimeout(() => {
            fetchProfile(session.user!.id)
            // Verificar assinatura após login
            if (event === 'SIGNED_IN') {
              checkSubscription()
              navigate('/dashboard', { replace: true })
            }
          }, 0)
        } else {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, nome: string, nomeNegocio?: string) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            nome,
            nome_negocio: nomeNegocio
          }
        }
      })

      if (error) throw error

      if (data.user) {
        // Criar perfil do usuário
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            nome,
            nome_negocio: nomeNegocio || '',
            plano: 'free',
            password: 'supabase_managed' // Campo obrigatório mas gerenciado pelo Supabase Auth
          })

        if (profileError) throw profileError

        // Inicializar dados padrão
        await initializeUserData(data.user.id)

        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vinda ao DoceCalc. Sua conta já está pronta para uso.",
        })
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        variant: "destructive",
      })
      setLoading(false)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta!",
      })

      // Navegação acontece no onAuthStateChange quando o evento é SIGNED_IN
      return
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      })
      setLoading(false)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setProfile(null)
      navigate('/')
      
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      })
    } catch (error: any) {
      toast({
        title: "Erro no logout",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir a senha.",
      })
    } catch (error: any) {
      toast({
        title: "Erro ao enviar email",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      setProfile({ ...profile, ...updates })

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas.",
      })
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const updatePerfil = updateProfile

  const upgradeUser = async (plano: 'free' | 'professional') => {
    await updateProfile({ plano })
  }

  const checkSubscription = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        body: {
          userEmail: user.email
        }
      })
      
      if (error) throw error

      if (data?.subscribed && profile?.plano !== 'professional') {
        await updateProfile({ plano: 'professional' })
      } else if (!data?.subscribed && profile?.plano !== 'free') {
        await updateProfile({ plano: 'free' })
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signOut, 
      signUp, 
      signIn, 
      resetPassword,
      updateProfile,
      checkSubscription,
      updatePerfil,
      upgradeUser,
      perfilConfeitaria: profile
    }}>
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