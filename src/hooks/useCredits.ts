import { useState, useEffect } from 'react'
import { UserPlan } from '../types'
import {
  loadPlanData,
  savePlanData,
  createDefaultPlan,
  decrementCredits,
  hasCreditsAvailable,
  getRemainingCredits,
  upgradePlan,
} from '../utils/creditsManager'

interface CreditsState {
  plan: UserPlan
  loading: boolean
  error: string | null
}

interface UseCreditsReturn {
  // Estado
  plan: UserPlan
  remainingCredits: number
  loading: boolean
  error: string | null
  
  // Funções
  useCredit: () => boolean
  canUseIA: () => boolean
  upgradePlanType: (newPlanType: UserPlan['planType']) => void
  refreshPlan: () => void
}

export function useCredits(): UseCreditsReturn {
  const [state, setState] = useState<CreditsState>({
    plan: createDefaultPlan(),
    loading: true,
    error: null,
  })

  // Carregar dados do plano ao inicializar
  useEffect(() => {
    const loadUserPlan = () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))
        
        const existingPlan = loadPlanData()
        const plan = existingPlan || createDefaultPlan()
        
        // Se não existia plano, salva o padrão
        if (!existingPlan) {
          savePlanData(plan)
        }
        
        setState({
          plan,
          loading: false,
          error: null,
        })
      } catch (error) {
        console.error('Erro ao carregar plano:', error)
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Erro ao carregar dados do plano',
        }))
      }
    }

    loadUserPlan()
  }, [])

  // Função para usar 1 crédito
  const useCredit = (): boolean => {
    try {
      const updatedPlan = decrementCredits(state.plan)
      
      if (!updatedPlan) {
        // Sem créditos disponíveis
        return false
      }
      
      setState(prev => ({
        ...prev,
        plan: updatedPlan,
      }))
      
      return true
    } catch (error) {
      console.error('Erro ao usar crédito:', error)
      setState(prev => ({
        ...prev,
        error: 'Erro ao processar crédito',
      }))
      return false
    }
  }

  // Verificar se pode usar IA
  const canUseIA = (): boolean => {
    return hasCreditsAvailable(state.plan)
  }

  // Fazer upgrade do plano (para simulação)
  const upgradePlanType = (newPlanType: UserPlan['planType']): void => {
    try {
      const upgradedPlan = upgradePlan(state.plan, newPlanType)
      setState(prev => ({
        ...prev,
        plan: upgradedPlan,
      }))
    } catch (error) {
      console.error('Erro ao fazer upgrade:', error)
      setState(prev => ({
        ...prev,
        error: 'Erro ao atualizar plano',
      }))
    }
  }

  // Atualizar dados do plano
  const refreshPlan = (): void => {
    const refreshedPlan = loadPlanData()
    if (refreshedPlan) {
      setState(prev => ({
        ...prev,
        plan: refreshedPlan,
      }))
    }
  }

  return {
    plan: state.plan,
    remainingCredits: getRemainingCredits(state.plan),
    loading: state.loading,
    error: state.error,
    useCredit,
    canUseIA,
    upgradePlanType,
    refreshPlan,
  }
}