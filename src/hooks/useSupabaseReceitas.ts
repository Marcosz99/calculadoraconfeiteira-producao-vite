import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface Receita {
  id: string
  user_id: string
  nome: string
  categoria_id: string | null
  ingredientes: any
  modo_preparo: string | null
  tempo_preparo: number | null
  rendimento: string | null
  custo_total: number | null
  preco_sugerido: number | null
  margem_lucro: number | null
  descricao: string | null
  observacoes: string | null
  created_at: string
  updated_at: string
}

export function useSupabaseReceitas() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar receitas do usuário
  const loadReceitas = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('receitas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setReceitas(data || [])
    } catch (err: any) {
      console.error('Erro ao carregar receitas:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Adicionar nova receita
  const addReceita = async (receitaData: Partial<Receita>): Promise<Receita | null> => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('receitas')
        .insert({
          user_id: user.id,
          nome: receitaData.nome || '',
          categoria_id: receitaData.categoria_id,
          ingredientes: receitaData.ingredientes || [],
          modo_preparo: receitaData.modo_preparo,
          tempo_preparo: receitaData.tempo_preparo,
          rendimento: receitaData.rendimento,
          custo_total: receitaData.custo_total,
          preco_sugerido: receitaData.preco_sugerido,
          margem_lucro: receitaData.margem_lucro,
          descricao: receitaData.descricao,
          observacoes: receitaData.observacoes
        })
        .select()
        .single()

      if (error) throw error

      setReceitas(prev => [data, ...prev])
      
      toast({
        title: "Receita criada!",
        description: "Sua receita foi salva com sucesso.",
      })

      return data
    } catch (err: any) {
      console.error('Erro ao criar receita:', err)
      toast({
        title: "Erro",
        description: "Erro ao salvar receita. Tente novamente.",
        variant: "destructive",
      })
      return null
    }
  }

  // Atualizar receita
  const updateReceita = async (id: string, updates: Partial<Receita>): Promise<boolean> => {
    if (!user) return false

    try {
      const { data, error } = await supabase
        .from('receitas')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      setReceitas(prev => prev.map(r => r.id === id ? data : r))
      
      toast({
        title: "Receita atualizada!",
        description: "Suas alterações foram salvas.",
      })

      return true
    } catch (err: any) {
      console.error('Erro ao atualizar receita:', err)
      toast({
        title: "Erro",
        description: "Erro ao atualizar receita. Tente novamente.",
        variant: "destructive",
      })
      return false
    }
  }

  // Deletar receita
  const deleteReceita = async (id: string): Promise<boolean> => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('receitas')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setReceitas(prev => prev.filter(r => r.id !== id))
      
      toast({
        title: "Receita excluída",
        description: "A receita foi removida com sucesso.",
      })

      return true
    } catch (err: any) {
      console.error('Erro ao deletar receita:', err)
      toast({
        title: "Erro",
        description: "Erro ao excluir receita. Tente novamente.",
        variant: "destructive",
      })
      return false
    }
  }

  useEffect(() => {
    if (user) {
      loadReceitas()
    }
  }, [user])

  return {
    receitas,
    loading,
    error,
    addReceita,
    updateReceita,
    deleteReceita,
    refreshReceitas: loadReceitas
  }
}