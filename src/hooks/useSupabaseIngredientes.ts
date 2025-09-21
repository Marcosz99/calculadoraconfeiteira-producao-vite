import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface IngredienteUsuario {
  id: string
  user_id: string
  nome: string
  categoria: string
  preco_medio: number
  unidade_padrao: string
  estoque: number | null
  data_ultima_compra: string | null
  fornecedor: string | null
  created_at: string
  updated_at: string
}

export function useSupabaseIngredientes() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [ingredientes, setIngredientes] = useState<IngredienteUsuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar ingredientes do usuário
  const loadIngredientes = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('ingredientes_usuario')
        .select('*')
        .eq('user_id', user.id)
        .order('nome', { ascending: true })

      if (fetchError) throw fetchError

      setIngredientes(data || [])
    } catch (err: any) {
      console.error('Erro ao carregar ingredientes:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Adicionar novo ingrediente
  const addIngrediente = async (ingredienteData: Partial<IngredienteUsuario>): Promise<IngredienteUsuario | null> => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('ingredientes_usuario')
        .insert({
          user_id: user.id,
          nome: ingredienteData.nome || '',
          categoria: ingredienteData.categoria || '',
          preco_medio: ingredienteData.preco_medio || 0,
          unidade_padrao: ingredienteData.unidade_padrao || 'un',
          estoque: ingredienteData.estoque,
          data_ultima_compra: ingredienteData.data_ultima_compra,
          fornecedor: ingredienteData.fornecedor
        })
        .select()
        .single()

      if (error) throw error

      setIngredientes(prev => [...prev, data].sort((a, b) => a.nome.localeCompare(b.nome)))
      
      toast({
        title: "Ingrediente adicionado!",
        description: "O ingrediente foi salvo com sucesso.",
      })

      return data
    } catch (err: any) {
      console.error('Erro ao criar ingrediente:', err)
      toast({
        title: "Erro",
        description: "Erro ao salvar ingrediente. Tente novamente.",
        variant: "destructive",
      })
      return null
    }
  }

  // Atualizar ingrediente
  const updateIngrediente = async (id: string, updates: Partial<IngredienteUsuario>): Promise<boolean> => {
    if (!user) return false

    try {
      const { data, error } = await supabase
        .from('ingredientes_usuario')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      setIngredientes(prev => prev.map(i => i.id === id ? data : i).sort((a, b) => a.nome.localeCompare(b.nome)))
      
      toast({
        title: "Ingrediente atualizado!",
        description: "As alterações foram salvas.",
      })

      return true
    } catch (err: any) {
      console.error('Erro ao atualizar ingrediente:', err)
      toast({
        title: "Erro",
        description: "Erro ao atualizar ingrediente. Tente novamente.",
        variant: "destructive",
      })
      return false
    }
  }

  // Deletar ingrediente
  const deleteIngrediente = async (id: string): Promise<boolean> => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('ingredientes_usuario')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setIngredientes(prev => prev.filter(i => i.id !== id))
      
      toast({
        title: "Ingrediente excluído",
        description: "O ingrediente foi removido com sucesso.",
      })

      return true
    } catch (err: any) {
      console.error('Erro ao deletar ingrediente:', err)
      toast({
        title: "Erro",
        description: "Erro ao excluir ingrediente. Tente novamente.",
        variant: "destructive",
      })
      return false
    }
  }

  useEffect(() => {
    if (user) {
      loadIngredientes()
    }
  }, [user])

  return {
    ingredientes,
    loading,
    error,
    addIngrediente,
    updateIngrediente,
    deleteIngrediente,
    refreshIngredientes: loadIngredientes
  }
}