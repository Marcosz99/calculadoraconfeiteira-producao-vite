import { UserPlan } from '../types'

// Configurações de créditos por plano
export const CREDITS_CONFIG = {
  gratuito: 10,
  profissional: 100,
  premium: 9999, // Ilimitado
}

// Chave do localStorage
const STORAGE_KEY = 'doce_calc_user_plan'

// Função para criar plano padrão
export function createDefaultPlan(planType: UserPlan['planType'] = 'gratuito'): UserPlan {
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1, 1) // Primeiro dia do próximo mês
  nextMonth.setHours(0, 0, 0, 0)
  
  return {
    planType,
    creditsIA: CREDITS_CONFIG[planType],
    creditsUsedThisMonth: 0,
    resetDate: nextMonth.toISOString(),
  }
}

// Salvar dados do plano no localStorage
export function savePlanData(plan: UserPlan): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan))
  } catch (error) {
    console.error('Erro ao salvar dados do plano:', error)
  }
}

// Carregar dados do plano do localStorage
export function loadPlanData(): UserPlan | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    
    const plan: UserPlan = JSON.parse(stored)
    
    // Verificar se precisa resetar créditos
    if (shouldResetCredits(plan)) {
      return resetMonthlyCredits(plan)
    }
    
    return plan
  } catch (error) {
    console.error('Erro ao carregar dados do plano:', error)
    return null
  }
}

// Verificar se deve resetar créditos (início do mês)
function shouldResetCredits(plan: UserPlan): boolean {
  const now = new Date()
  const resetDate = new Date(plan.resetDate)
  return now >= resetDate
}

// Resetar créditos mensalmente
function resetMonthlyCredits(plan: UserPlan): UserPlan {
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1, 1)
  nextMonth.setHours(0, 0, 0, 0)
  
  const resetPlan: UserPlan = {
    ...plan,
    creditsIA: CREDITS_CONFIG[plan.planType],
    creditsUsedThisMonth: 0,
    resetDate: nextMonth.toISOString(),
  }
  
  savePlanData(resetPlan)
  return resetPlan
}

// Decrementar créditos quando IA é usada
export function decrementCredits(plan: UserPlan): UserPlan | null {
  if (plan.planType === 'premium') {
    // Premium é ilimitado, não decrementa
    return plan
  }
  
  const remainingCredits = plan.creditsIA - plan.creditsUsedThisMonth
  if (remainingCredits <= 0) {
    return null // Sem créditos disponíveis
  }
  
  const updatedPlan: UserPlan = {
    ...plan,
    creditsUsedThisMonth: plan.creditsUsedThisMonth + 1,
  }
  
  savePlanData(updatedPlan)
  return updatedPlan
}

// Verificar se ainda tem créditos disponíveis
export function hasCreditsAvailable(plan: UserPlan): boolean {
  if (plan.planType === 'premium') {
    return true // Premium é ilimitado
  }
  
  const remainingCredits = plan.creditsIA - plan.creditsUsedThisMonth
  return remainingCredits > 0
}

// Obter créditos restantes
export function getRemainingCredits(plan: UserPlan): number {
  if (plan.planType === 'premium') {
    return 9999 // Mostra como ilimitado
  }
  
  return Math.max(0, plan.creditsIA - plan.creditsUsedThisMonth)
}

// Atualizar tipo de plano (para simulação de upgrade)
export function upgradePlan(currentPlan: UserPlan, newPlanType: UserPlan['planType']): UserPlan {
  const upgradedPlan: UserPlan = {
    ...currentPlan,
    planType: newPlanType,
    creditsIA: CREDITS_CONFIG[newPlanType],
  }
  
  savePlanData(upgradedPlan)
  return upgradedPlan
}