import { useAuth } from '@/contexts/AuthContext'
import { getFromLocalStorage, LOCAL_STORAGE_KEYS } from '@/utils/localStorage'

export const useSubscriptionLimits = () => {
  const { user } = useAuth()
  
  const plano = user?.plano || 'free'
  const isProfessional = plano === 'professional'
  
  // Contadores atuais (do localStorage)
  const receitas = getFromLocalStorage(LOCAL_STORAGE_KEYS.RECEITAS, [])
  const orcamentos = getFromLocalStorage(LOCAL_STORAGE_KEYS.ORCAMENTOS, [])
  const clientes = getFromLocalStorage(LOCAL_STORAGE_KEYS.CLIENTES, [])
  const ingredientesCustom = getFromLocalStorage(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, [])
  
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
  
  const usage = {
    receitas: receitas.length,
    orcamentos: orcamentos.length,
    clientes: clientes.length,
    ingredientes: ingredientesCustom.length
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
    plano,
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