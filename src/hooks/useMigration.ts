import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { LOCAL_STORAGE_KEYS, getFromLocalStorage, removeFromLocalStorage } from '@/utils/localStorage'
import { useToast } from '@/hooks/use-toast'

export const useMigration = () => {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const [migrating, setMigrating] = useState(false)
  const [migrationStatus, setMigrationStatus] = useState<{
    receitas: boolean
    ingredientes: boolean
    categorias: boolean
    clientes: boolean
    orcamentos: boolean
    configuracoes: boolean
  }>({
    receitas: false,
    ingredientes: false,
    categorias: false,
    clientes: false,
    orcamentos: false,
    configuracoes: false
  })

  const migrateToSupabase = async () => {
    if (!user || migrating) return

    setMigrating(true)
    const errors: string[] = []

    try {
      // Migrar receitas
      try {
        const receitas = getFromLocalStorage(LOCAL_STORAGE_KEYS.RECEITAS, [])
          .filter((r: any) => r.usuario_id === user.id)

        if (receitas.length > 0) {
          const receitasData = receitas.map((r: any) => ({
            user_id: user.id,
            nome: r.nome,
            descricao: r.descricao,
            ingredientes: r.ingredientes || [],
            modo_preparo: r.modo_preparo,
            tempo_preparo: r.tempo_preparo,
            rendimento: r.rendimento,
            categoria_id: r.categoria_id,
            custo_total: r.custo_total || 0,
            preco_sugerido: r.preco_sugerido || 0,
            margem_lucro: r.margem_lucro || 30,
            observacoes: r.observacoes
          }))

          const { error } = await supabase.from('receitas').insert(receitasData)
          if (error) throw error
        }
        
        setMigrationStatus(prev => ({ ...prev, receitas: true }))
      } catch (error) {
        console.error('Erro ao migrar receitas:', error)
        errors.push('receitas')
      }

      // Migrar ingredientes
      try {
        const ingredientes = getFromLocalStorage(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, [])
          .filter((i: any) => i.usuario_id === user.id)

        if (ingredientes.length > 0) {
          const ingredientesData = ingredientes.map((i: any) => ({
            user_id: user.id,
            nome: i.nome,
            categoria: i.categoria,
            unidade_padrao: i.unidade_padrao,
            preco_medio: i.preco_medio || 0,
            estoque: i.estoque_atual || 0,
            fornecedor: i.fornecedor,
            data_ultima_compra: i.data_ultima_compra
          }))

          const { error } = await supabase.from('ingredientes_usuario').insert(ingredientesData)
          if (error) throw error
        }
        
        setMigrationStatus(prev => ({ ...prev, ingredientes: true }))
      } catch (error) {
        console.error('Erro ao migrar ingredientes:', error)
        errors.push('ingredientes')
      }

      // Migrar categorias
      try {
        const categorias = getFromLocalStorage(LOCAL_STORAGE_KEYS.CATEGORIAS, [])
          .filter((c: any) => c.usuario_id === user.id)

        if (categorias.length > 0) {
          const categoriasData = categorias.map((c: any) => ({
            user_id: user.id,
            nome: c.nome,
            cor_hex: c.cor_hex,
            icone: c.icone || '🍰',
            ordem: c.ordem || 1
          }))

          const { error } = await supabase.from('categorias').insert(categoriasData)
          if (error) throw error
        }
        
        setMigrationStatus(prev => ({ ...prev, categorias: true }))
      } catch (error) {
        console.error('Erro ao migrar categorias:', error)
        errors.push('categorias')
      }

      // Migrar clientes
      try {
        const clientes = getFromLocalStorage(LOCAL_STORAGE_KEYS.CLIENTES, [])
          .filter((c: any) => c.usuario_id === user.id)

        if (clientes.length > 0) {
          const clientesData = clientes.map((c: any) => ({
            user_id: user.id,
            nome: c.nome,
            email: c.email,
            telefone: c.telefone,
            whatsapp: c.whatsapp,
            endereco: c.endereco,
            cidade: c.cidade,
            estado: c.estado,
            data_nascimento: c.data_nascimento,
            observacoes: c.observacoes,
            ativo: c.ativo !== false
          }))

          const { error } = await supabase.from('clientes').insert(clientesData)
          if (error) throw error
        }
        
        setMigrationStatus(prev => ({ ...prev, clientes: true }))
      } catch (error) {
        console.error('Erro ao migrar clientes:', error)
        errors.push('clientes')
      }

      // Migrar orçamentos
      try {
        const orcamentos = getFromLocalStorage(LOCAL_STORAGE_KEYS.ORCAMENTOS, [])
          .filter((o: any) => o.usuario_id === user.id)

        if (orcamentos.length > 0) {
          const orcamentosData = orcamentos.map((o: any) => ({
            user_id: user.id,
            numero: o.numero || `ORC-${Date.now()}`,
            cliente_id: o.cliente_id,
            itens: o.itens || [],
            valor_total: o.valor_total || 0,
            valor_final: o.valor_final || 0,
            desconto: o.desconto || 0,
            status: o.status || 'pendente',
            data_evento: o.data_evento,
            local_evento: o.local_evento,
            quantidade_pessoas: o.quantidade_pessoas,
            valido_ate: o.valido_ate,
            observacoes: o.observacoes
          }))

          const { error } = await supabase.from('orcamentos').insert(orcamentosData)
          if (error) throw error
        }
        
        setMigrationStatus(prev => ({ ...prev, orcamentos: true }))
      } catch (error) {
        console.error('Erro ao migrar orçamentos:', error)
        errors.push('orçamentos')
      }

      // Migrar configurações
      try {
        const config: any = getFromLocalStorage(LOCAL_STORAGE_KEYS.CONFIGURACOES, {})
        
        if (Object.keys(config).length > 0) {
          const configData = {
            user_id: user.id,
            moeda: config.moeda || 'BRL',
            fuso_horario: config.fuso_horario || 'America/Sao_Paulo',
            margem_padrao: config.margem_padrao || 30,
            custo_hora_trabalho: config.custo_hora_trabalho || 25.00,
            notificacoes_email: config.notificacoes_email !== false,
            notificacoes_whatsapp: config.notificacoes_whatsapp !== false
          }

          const { error } = await supabase.from('configuracoes_usuario').insert(configData)
          if (error) throw error
        }
        
        setMigrationStatus(prev => ({ ...prev, configuracoes: true }))
      } catch (error) {
        console.error('Erro ao migrar configurações:', error)
        errors.push('configurações')
      }

      // Limpar localStorage se a migração foi bem sucedida
      if (errors.length === 0) {
        removeFromLocalStorage(LOCAL_STORAGE_KEYS.RECEITAS)
        removeFromLocalStorage(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO)
        removeFromLocalStorage(LOCAL_STORAGE_KEYS.CATEGORIAS)
        removeFromLocalStorage(LOCAL_STORAGE_KEYS.CLIENTES)
        removeFromLocalStorage(LOCAL_STORAGE_KEYS.ORCAMENTOS)
        removeFromLocalStorage(LOCAL_STORAGE_KEYS.CONFIGURACOES)

        toast({
          title: "Migração concluída!",
          description: "Todos os seus dados foram migrados para a nuvem com sucesso.",
        })
      } else {
        toast({
          title: "Migração parcial",
          description: `Alguns dados não puderam ser migrados: ${errors.join(', ')}. Tente novamente.`,
          variant: "destructive",
        })
      }

    } catch (error) {
      console.error('Erro na migração:', error)
      toast({
        title: "Erro na migração",
        description: "Erro inesperado durante a migração. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setMigrating(false)
    }
  }

  return {
    migrateToSupabase,
    migrating,
    migrationStatus
  }
}