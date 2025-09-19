import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, PerfilConfeitaria } from '../types'
import { LOCAL_STORAGE_KEYS, saveToLocalStorage, getFromLocalStorage, initializeDefaultData, clearAllUserData } from '../utils/localStorage'
import { supabase } from '@/integrations/supabase/client'

type AuthContextType = {
  user: User | null
  perfilConfeitaria: PerfilConfeitaria | null
  loading: boolean
  signOut: () => void
  signUp: (email: string, password: string, nome: string, nomeConfeitaria: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  updatePerfil: (perfil: Partial<PerfilConfeitaria>) => void
  upgradeUser: (novoPlano: 'free' | 'professional') => void
  checkSubscriptionStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  perfilConfeitaria: null,
  loading: true,
  signOut: () => {},
  signUp: async () => {},
  signIn: async () => {},
  updatePerfil: () => {},
  upgradeUser: () => {},
  checkSubscriptionStatus: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [perfilConfeitaria, setPerfilConfeitaria] = useState<PerfilConfeitaria | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar se usuário está logado no localStorage
    const checkAuth = () => {
      try {
        const savedUser = getFromLocalStorage<User | null>(LOCAL_STORAGE_KEYS.USER, null)
        const savedPerfil = getFromLocalStorage<PerfilConfeitaria | null>(LOCAL_STORAGE_KEYS.PERFIL_CONFEITARIA, null)
        
        if (savedUser) {
          setUser(savedUser)
          setPerfilConfeitaria(savedPerfil)
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        clearAllUserData()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signUp = async (email: string, password: string, nome: string, nomeConfeitaria: string) => {
    try {
      setLoading(true)
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const userId = Date.now().toString()
      
      // Criar usuário
      const newUser: User = {
        id: userId,
        nome,
        email,
        plano: 'free',
        data_cadastro: new Date().toISOString(),
        ativo: true,
        catalogo_ativo: false,
        dados_confeitaria: {
          nomeFantasia: nome,
          whatsapp: '',
          instagram: '',
          endereco: '',
          descricao: ''
        }
      }
      
      // Criar perfil da confeitaria
      const newPerfil: PerfilConfeitaria = {
        id: (Date.now() + 1).toString(),
        usuario_id: userId,
        nome_fantasia: nomeConfeitaria,
        especialidades: [],
        cidade: '',
        estado: ''
      }
      
      // Salvar dados
      saveToLocalStorage(LOCAL_STORAGE_KEYS.USER, newUser)
      saveToLocalStorage(LOCAL_STORAGE_KEYS.PERFIL_CONFEITARIA, newPerfil)
      
      // Inicializar dados padrão
      initializeDefaultData(userId)
      
      setUser(newUser)
      setPerfilConfeitaria(newPerfil)
      
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
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Verificar se usuário já existe
      const existingUser = getFromLocalStorage<User | null>(LOCAL_STORAGE_KEYS.USER, null)
      const existingPerfil = getFromLocalStorage<PerfilConfeitaria | null>(LOCAL_STORAGE_KEYS.PERFIL_CONFEITARIA, null)
      
      if (existingUser && existingUser.email === email) {
        setUser(existingUser)
        setPerfilConfeitaria(existingPerfil)
      } else {
        // Criar usuário demo
        const userId = Date.now().toString()
        const mockUser: User = {
          id: userId,
          nome: 'Usuário Demo',
          email,
          plano: 'free',
          data_cadastro: new Date().toISOString(),
          ativo: true,
          catalogo_ativo: false,
          dados_confeitaria: {
            nomeFantasia: 'Usuário Demo',
            whatsapp: '',
            instagram: '',
            endereco: '',
            descricao: ''
          }
        }
        
        const mockPerfil: PerfilConfeitaria = {
          id: (Date.now() + 1).toString(),
          usuario_id: userId,
          nome_fantasia: 'Confeitaria Demo',
          especialidades: ['Bolos', 'Doces'],
          cidade: 'São Paulo',
          estado: 'SP'
        }
        
        saveToLocalStorage(LOCAL_STORAGE_KEYS.USER, mockUser)
        saveToLocalStorage(LOCAL_STORAGE_KEYS.PERFIL_CONFEITARIA, mockPerfil)
        initializeDefaultData(userId)
        
        setUser(mockUser)
        setPerfilConfeitaria(mockPerfil)
      }
      
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
    clearAllUserData()
    setUser(null)
    setPerfilConfeitaria(null)
    navigate('/')
  }
  
  const updatePerfil = (perfil: Partial<PerfilConfeitaria>) => {
    if (perfilConfeitaria) {
      const updatedPerfil = { ...perfilConfeitaria, ...perfil }
      setPerfilConfeitaria(updatedPerfil)
      saveToLocalStorage(LOCAL_STORAGE_KEYS.PERFIL_CONFEITARIA, updatedPerfil)
    }
  }
  
  const upgradeUser = (novoPlano: 'free' | 'professional') => {
    if (user) {
      const updatedUser = { ...user, plano: novoPlano }
      setUser(updatedUser)
      saveToLocalStorage(LOCAL_STORAGE_KEYS.USER, updatedUser)
      
      // Verificar subscription status após upgrade
      if (novoPlano === 'professional') {
        checkSubscriptionStatus()
      }
    }
  }

  const checkSubscriptionStatus = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        body: {
          userEmail: user.email
        }
      })
      
      if (error) {
        console.error('Error checking subscription:', error)
        return
      }
      
      // Update user plan based on subscription status
      if (data.subscribed && user.plano !== 'professional') {
        const updatedUser = { ...user, plano: 'professional' as const }
        setUser(updatedUser)
        saveToLocalStorage(LOCAL_STORAGE_KEYS.USER, updatedUser)
      } else if (!data.subscribed && user.plano !== 'free') {
        const updatedUser = { ...user, plano: 'free' as const }
        setUser(updatedUser)
        saveToLocalStorage(LOCAL_STORAGE_KEYS.USER, updatedUser)
      }
      
    } catch (error) {
      console.error('Error checking subscription:', error)
    }
  }

  // Check subscription status when user logs in
  useEffect(() => {
    if (user && user.plano === 'professional') {
      checkSubscriptionStatus()
    }
  }, [user?.id])

  return (
    <AuthContext.Provider value={{ 
      user, 
      perfilConfeitaria, 
      loading, 
      signOut, 
      signUp, 
      signIn, 
      updatePerfil, 
      upgradeUser,
      checkSubscriptionStatus
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