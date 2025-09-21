import { useState, useEffect } from 'react'
import { UserPlan } from '../types'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '../contexts/AuthContext'

const CREDITS_CONFIG = {
  gratuito: 10,
  profissional: 100,
  premium: 9999, // Ilimitado
}

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
  useCredit: () => Promise<boolean>
  canUseIA: () => boolean
  upgradePlanType: (newPlanType: UserPlan['planType']) => void
  refreshPlan: () => void
}

// Helper function defined first
const createDefaultPlan = (planType: UserPlan['planType'] = 'gratuito'): UserPlan => {
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1, 1)
  nextMonth.setHours(0, 0, 0, 0)
  
  return {
    planType,
    creditsIA: CREDITS_CONFIG[planType],
    creditsUsedThisMonth: 0,
    resetDate: nextMonth.toISOString(),
  }
}

export function useCredits(): UseCreditsReturn {
  const { user } = useAuth()
  const [state, setState] = useState<CreditsState>({
    plan: createDefaultPlan(),
    loading: true,
    error: null,
  })

  // Carregar dados do plano ao inicializar
  useEffect(() => {
    if (user) {
      loadUserPlan()
    }
  }, [user])

  const loadUserPlan = async () => {
    if (!user) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = não encontrado
        throw error
      }

      let plan: UserPlan

      if (!data) {
        // Criar plano padrão se não existir
        plan = createDefaultPlan()
        await createUserCredits(plan)
      } else {
        // Converter dados do Supabase para UserPlan
        plan = {
          planType: data.plan_type as UserPlan['planType'],
          creditsIA: data.credits_ia,
          creditsUsedThisMonth: data.credits_used_this_month,
          resetDate: data.reset_date,
        }

        // Verificar se precisa resetar créditos
        if (shouldResetCredits(plan)) {
          plan = await resetMonthlyCredits(plan)
        }
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

  const createUserCredits = async (plan: UserPlan) => {
    if (!user) return

    const { error } = await supabase
      .from('user_credits')
      .insert({
        user_id: user.id,
        plan_type: plan.planType,
        credits_ia: plan.creditsIA,
        credits_used_this_month: plan.creditsUsedThisMonth,
        reset_date: plan.resetDate,
      })

    if (error) throw error
  }

  const shouldResetCredits = (plan: UserPlan): boolean => {
    const now = new Date()
    const resetDate = new Date(plan.resetDate)
    return now >= resetDate
  }

  const resetMonthlyCredits = async (plan: UserPlan): Promise<UserPlan> => {
    if (!user) return plan

    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1, 1)
    nextMonth.setHours(0, 0, 0, 0)

    const resetPlan: UserPlan = {
      ...plan,
      creditsIA: CREDITS_CONFIG[plan.planType],
      creditsUsedThisMonth: 0,
      resetDate: nextMonth.toISOString(),
    }

    await supabase
      .from('user_credits')
      .update({
        credits_ia: resetPlan.creditsIA,
        credits_used_this_month: 0,
        reset_date: resetPlan.resetDate,
      })
      .eq('user_id', user.id)

    return resetPlan
  }

  // Função para usar 1 crédito
  const useCredit = async (): Promise<boolean> => {
    if (!user) return false

    try {
      if (state.plan.planType === 'premium') {
        // Premium é ilimitado, não decrementa
        return true
      }
      
      const remainingCredits = state.plan.creditsIA - state.plan.creditsUsedThisMonth
      if (remainingCredits <= 0) {
        return false // Sem créditos disponíveis
      }
      
      const newUsedCredits = state.plan.creditsUsedThisMonth + 1
      
      const { error } = await supabase
        .from('user_credits')
        .update({
          credits_used_this_month: newUsedCredits,
        })
        .eq('user_id', user.id)

      if (error) throw error

      const updatedPlan = {
        ...state.plan,
        creditsUsedThisMonth: newUsedCredits,
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
    if (state.plan.planType === 'premium') {
      return true // Premium é ilimitado
    }
    
    const remainingCredits = state.plan.creditsIA - state.plan.creditsUsedThisMonth
    return remainingCredits > 0
  }

  // Fazer upgrade do plano (para simulação)
  const upgradePlanType = async (newPlanType: UserPlan['planType']): Promise<void> => {
    if (!user) return

    try {
      const upgradedPlan = {
        ...state.plan,
        planType: newPlanType,
        creditsIA: CREDITS_CONFIG[newPlanType],
      }

      const { error } = await supabase
        .from('user_credits')
        .update({
          plan_type: newPlanType,
          credits_ia: upgradedPlan.creditsIA,
        })
        .eq('user_id', user.id)

      if (error) throw error

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
    loadUserPlan()
  }

  const getRemainingCredits = (plan: UserPlan): number => {
    if (plan.planType === 'premium') {
      return 9999 // Mostra como ilimitado
    }
    
    return Math.max(0, plan.creditsIA - plan.creditsUsedThisMonth)
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