import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface UserCredits {
  id: string
  user_id: string
  plan_type: 'free' | 'starter' | 'professional'
  credits_ia: number
  credits_used_this_month: number
  reset_date: string
  created_at: string
  updated_at: string
}

const CREDITS_CONFIG = {
  free: 30,
  starter: 100,
  professional: 9999, // Ilimitado
}

export function useSupabaseCredits() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [credits, setCredits] = useState<UserCredits | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar créditos do usuário
  const loadCredits = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Buscar créditos existentes
      const { data: existingCredits, error: fetchError } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      if (existingCredits) {
        // Verificar se precisa resetar créditos mensalmente
        const now = new Date()
        const resetDate = new Date(existingCredits.reset_date)
        
        if (now >= resetDate) {
          // Resetar créditos do mês
          const nextMonth = new Date()
          nextMonth.setMonth(nextMonth.getMonth() + 1, 1)
          nextMonth.setHours(0, 0, 0, 0)

          const { data: updatedCredits, error: updateError } = await supabase
            .from('user_credits')
            .update({
              credits_used_this_month: 0,
              reset_date: nextMonth.toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .select()
            .single()

      if (updateError) throw updateError
      setCredits(updatedCredits as UserCredits)
    } else {
      setCredits(existingCredits as UserCredits)
    }
      } else {
        // Criar registro de créditos inicial
        const nextMonth = new Date()
        nextMonth.setMonth(nextMonth.getMonth() + 1, 1)
        nextMonth.setHours(0, 0, 0, 0)

        const { data: newCredits, error: insertError } = await supabase
          .from('user_credits')
          .insert({
            user_id: user.id,
            plan_type: 'free',
            credits_ia: CREDITS_CONFIG.free,
            credits_used_this_month: 0,
            reset_date: nextMonth.toISOString()
          })
          .select()
          .single()

    if (insertError) throw insertError
    setCredits(newCredits as UserCredits)
      }
    } catch (err: any) {
      console.error('Erro ao carregar créditos:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Usar um crédito
  const useCredit = async (): Promise<boolean> => {
    if (!credits || !user) return false

    try {
      const remainingCredits = credits.credits_ia - credits.credits_used_this_month
      
      if (remainingCredits <= 0) {
        toast({
          title: "Créditos esgotados",
          description: "Você atingiu o limite mensal de créditos IA. Faça upgrade para continuar.",
          variant: "destructive",
        })
        return false
      }

      const { data: updatedCredits, error } = await supabase
        .from('user_credits')
        .update({
          credits_used_this_month: credits.credits_used_this_month + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single()

    if (error) throw error

    setCredits(updatedCredits as UserCredits)
      return true
    } catch (err: any) {
      console.error('Erro ao usar crédito:', err)
      toast({
        title: "Erro",
        description: "Erro ao processar crédito. Tente novamente.",
        variant: "destructive",
      })
      return false
    }
  }

  // Fazer upgrade do plano
  const upgradePlan = async (newPlanType: 'free' | 'starter' | 'professional'): Promise<boolean> => {
    if (!credits || !user) return false

    try {
      const { data: updatedCredits, error } = await supabase
        .from('user_credits')
        .update({
          plan_type: newPlanType,
          credits_ia: CREDITS_CONFIG[newPlanType],
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single()

    if (error) throw error

    setCredits(updatedCredits as UserCredits)
      
      // Também atualizar no perfil
      await supabase
        .from('profiles')
        .update({ plano: newPlanType === 'free' ? 'free' : 'professional' })
        .eq('id', user.id)

      toast({
        title: "Plano atualizado!",
        description: `Seu plano foi alterado para ${newPlanType}.`,
      })
      
      return true
    } catch (err: any) {
      console.error('Erro ao fazer upgrade:', err)
      toast({
        title: "Erro",
        description: "Erro ao atualizar plano. Tente novamente.",
        variant: "destructive",
      })
      return false
    }
  }

  // Verificar se pode usar IA
  const canUseIA = (): boolean => {
    if (!credits) return false
    const remainingCredits = credits.credits_ia - credits.credits_used_this_month
    return remainingCredits > 0
  }

  // Créditos restantes
  const remainingCredits = credits ? credits.credits_ia - credits.credits_used_this_month : 0

  useEffect(() => {
    if (user) {
      loadCredits()
    }
  }, [user])

  return {
    credits,
    loading,
    error,
    remainingCredits,
    canUseIA,
    useCredit,
    upgradePlan,
    refreshCredits: loadCredits
  }
}