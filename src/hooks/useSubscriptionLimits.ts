import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { useState, useEffect } from 'react'

export const useSubscriptionLimits = () => {
  const { user, profile } = useAuth()
  const [usage, setUsage] = useState({
    receitas: 0,
    orcamentos: 0,
    clientes: 0,
    ingredientes: 0
  })

  const isProfessional = profile?.plano === 'professional'

  useEffect(() => {
    if (!user) return

    const fetchUsage = async () => {
      try {
        const [receitas, ingredientes, clientes, orcamentos] = await Promise.all([
          supabase.from('receitas').select('id', { count: 'exact' }).eq('user_id', user.id),
          supabase.from('ingredientes_usuario').select('id', { count: 'exact' }).eq('user_id', user.id),
          supabase.from('clientes').select('id', { count: 'exact' }).eq('user_id', user.id),
          supabase.from('orcamentos').select('id', { count: 'exact' }).eq('user_id', user.id)
        ])

        setUsage({
          receitas: receitas.count || 0,
          orcamentos: orcamentos.count || 0,
          clientes: clientes.count || 0,
          ingredientes: ingredientes.count || 0
        })
      } catch (error) {
        console.error('Erro ao buscar uso:', error)
      }
    }

    fetchUsage()
  }, [user])
  
  const limits = {
    receitas: isProfessional ? null : 5,
    orcamentos: isProfessional ? null : 3,
    clientes: isProfessional ? null : 10,
    ingredientes: isProfessional ? null : 50,
    catalogoPublico: isProfessional ? null : 3,
    backup: isProfessional,
    relatorios: isProfessional,
    comunidade: isProfessional,
    ferramentas: isProfessional
  }
  
  const canAddReceita = () => {
    if (isProfessional) return true
    return usage.receitas < 5
  }
  
  const canAddOrcamento = () => {
    if (isProfessional) return true
    return usage.orcamentos < 3
  }
  
  const canAddCliente = () => {
    if (isProfessional) return true
    return usage.clientes < 10
  }
  
  const canAddIngrediente = () => {
    if (isProfessional) return true
    return usage.ingredientes < 50
  }
  
  const canUseFeature = (feature: string) => {
    if (isProfessional) return true
    
    const freeFeatures = ['receitas', 'orcamentos', 'calculadora', 'ingredientes']
    return freeFeatures.includes(feature)
  }
  
  const getRemainingCount = (type: 'receitas' | 'orcamentos' | 'clientes' | 'ingredientes') => {
    if (isProfessional) return null
    const limit = limits[type] as number
    return Math.max(0, limit - usage[type])
  }
  
  const getUsagePercentage = (type: 'receitas' | 'orcamentos' | 'clientes' | 'ingredientes') => {
    if (isProfessional) return 0
    const limit = limits[type] as number
    return Math.min(100, (usage[type] / limit) * 100)
  }
  
  return {
    plano: profile?.plano || 'free',
    isProfessional,
    limits,
    usage,
    canAddReceita,
    canAddOrcamento,
    canAddCliente,
    canAddIngrediente,
    canUseFeature,
    getRemainingCount,
    getUsagePercentage
  }
}