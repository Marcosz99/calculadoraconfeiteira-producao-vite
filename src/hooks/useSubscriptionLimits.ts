import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'

export const useSubscriptionLimits = () => {
  const { user, profile } = useAuth()
  const [usage, setUsage] = useState({
    receitas: 0,
    ingredientes: 0,
    calculos: 0,
    doceBotUsos: 0
  })

  const isProfessional = profile?.plano === 'professional'

  useEffect(() => {
    if (!user) return

    const loadUsage = () => {
      try {
        // Carregar dados do localStorage
        const receitas = JSON.parse(localStorage.getItem(`receitas_${user.id}`) || '[]')
        const ingredientes = JSON.parse(localStorage.getItem(`ingredientes_${user.id}`) || '[]')
        const calculos = parseInt(localStorage.getItem(`calculos_count_${user.id}`) || '0')
        const doceBotUsos = parseInt(localStorage.getItem(`docebot_usos_${user.id}`) || '0')

        setUsage({
          receitas: receitas.length,
          ingredientes: ingredientes.length,
          calculos: calculos,
          doceBotUsos: doceBotUsos
        })
      } catch (error) {
        console.error('Erro ao carregar estatísticas de uso:', error)
      }
    }

    loadUsage()
  }, [user])
  
  const limits = {
    receitas: isProfessional ? Infinity : 5,
    ingredientes: isProfessional ? Infinity : 15,
    calculos: isProfessional ? Infinity : 3,
    doceBotUsos: isProfessional ? 100 : 5
  }

  // Acesso a funcionalidades específicas
  const featureAccess = {
    marketplace: isProfessional,
    financeiro: isProfessional,
    catalogo: isProfessional,
    comunidade: true, // Sempre disponível
    relatorios: isProfessional,
    backup: isProfessional
  }
  
  const canAddReceita = () => {
    if (isProfessional) return true
    return usage.receitas < limits.receitas
  }
  
  const canAddIngrediente = () => {
    if (isProfessional) return true
    return usage.ingredientes < limits.ingredientes
  }

  const canUseCalculadora = () => {
    if (isProfessional) return true
    return usage.calculos < limits.calculos
  }

  const canUseDoceBot = () => {
    return usage.doceBotUsos < limits.doceBotUsos
  }

  const incrementCalculos = () => {
    if (!user) return false
    if (!canUseCalculadora()) return false

    const newCount = usage.calculos + 1
    localStorage.setItem(`calculos_count_${user.id}`, newCount.toString())
    setUsage(prev => ({ ...prev, calculos: newCount }))
    return true
  }

  const incrementDoceBotUsos = () => {
    if (!user) return false
    if (!canUseDoceBot()) return false

    const newCount = usage.doceBotUsos + 1
    localStorage.setItem(`docebot_usos_${user.id}`, newCount.toString())
    setUsage(prev => ({ ...prev, doceBotUsos: newCount }))
    return true
  }

  const hasFeatureAccess = (feature: keyof typeof featureAccess) => {
    return featureAccess[feature]
  }
  
  const getRemainingCount = (type: keyof typeof limits) => {
    if (isProfessional && type !== 'doceBotUsos') return Infinity
    const limit = limits[type]
    return Math.max(0, limit - usage[type])
  }
  
  const getUsagePercentage = (type: keyof typeof limits) => {
    const limit = limits[type]
    if (limit === Infinity) return 0
    return Math.min(100, (usage[type] / limit) * 100)
  }

  const getLimitMessage = (type: keyof typeof limits) => {
    const remaining = getRemainingCount(type)
    const limit = limits[type]

    if (remaining === Infinity) {
      return 'Ilimitado'
    }

    if (remaining === 0) {
      return `Limite atingido (${limit}/${limit}). Faça upgrade para continuar!`
    }

    return `${remaining} restantes de ${limit}`
  }

  const refreshUsage = () => {
    if (!user) return
    
    const receitas = JSON.parse(localStorage.getItem(`receitas_${user.id}`) || '[]')
    const ingredientes = JSON.parse(localStorage.getItem(`ingredientes_${user.id}`) || '[]')
    const calculos = parseInt(localStorage.getItem(`calculos_count_${user.id}`) || '0')
    const doceBotUsos = parseInt(localStorage.getItem(`docebot_usos_${user.id}`) || '0')

    setUsage({
      receitas: receitas.length,
      ingredientes: ingredientes.length,
      calculos: calculos,
      doceBotUsos: doceBotUsos
    })
  }
  
  return {
    plano: profile?.plano || 'free',
    isProfessional,
    limits,
    usage,
    featureAccess,
    
    // Verificações de limite
    canAddReceita,
    canAddIngrediente,
    canUseCalculadora,
    canUseDoceBot,
    hasFeatureAccess,
    
    // Incrementadores
    incrementCalculos,
    incrementDoceBotUsos,
    
    // Utilitários
    getRemainingCount,
    getUsagePercentage,
    getLimitMessage,
    refreshUsage
  }
}