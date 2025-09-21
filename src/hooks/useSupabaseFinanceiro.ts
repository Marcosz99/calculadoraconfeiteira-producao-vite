import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TransacaoFinanceira {
  id?: string;
  user_id: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  valor: number;
  descricao?: string | null;
  data_transacao: string;
  metodo_pagamento?: string | null;
  comprovante_url?: string | null;
  dados_ocr?: any;
  created_at?: string;
  updated_at?: string;
}

export interface GastoPlanejado {
  id?: string;
  user_id: string;
  nome: string;
  valor_estimado: number;
  data_vencimento?: string | null;
  categoria: string;
  observacoes?: string | null;
  pago: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export function useSupabaseFinanceiro() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transacoes, setTransacoes] = useState<TransacaoFinanceira[]>([]);
  const [gastosPlanejados, setGastosPlanejados] = useState<GastoPlanejado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar transações
  const loadTransacoes = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('transacoes_financeiras')
        .select('*')
        .eq('user_id', user.id)
        .order('data_transacao', { ascending: false });

      if (error) throw error;
      setTransacoes((data || []) as TransacaoFinanceira[]);
    } catch (err: any) {
      console.error('Erro ao carregar transações:', err);
      setError(err.message);
    }
  };

  // Carregar gastos planejados
  const loadGastosPlanejados = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('gastos_planejados')
        .select('*')
        .eq('user_id', user.id)
        .order('data_vencimento', { ascending: true });

      if (error) throw error;
      setGastosPlanejados((data || []) as GastoPlanejado[]);
    } catch (err: any) {
      console.error('Erro ao carregar gastos planejados:', err);
      setError(err.message);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      Promise.all([loadTransacoes(), loadGastosPlanejados()])
        .finally(() => setLoading(false));
    }
  }, [user?.id]);

  // Adicionar transação
  const addTransacao = async (transacaoData: Omit<TransacaoFinanceira, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<TransacaoFinanceira | null> => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('transacoes_financeiras')
        .insert({
          ...transacaoData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setTransacoes(prev => [data as TransacaoFinanceira, ...prev]);
      toast({
        title: '✅ Transação salva',
        description: `${transacaoData.tipo === 'receita' ? 'Receita' : 'Despesa'} de R$ ${transacaoData.valor.toFixed(2)} adicionada`,
      });

      return data as TransacaoFinanceira;
    } catch (err: any) {
      console.error('Erro ao adicionar transação:', err);
      toast({
        title: '❌ Erro',
        description: 'Erro ao salvar transação: ' + err.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  // Atualizar transação
  const updateTransacao = async (id: string, updates: Partial<TransacaoFinanceira>): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('transacoes_financeiras')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTransacoes(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
      toast({
        title: '✅ Transação atualizada',
        description: 'Transação foi atualizada com sucesso',
      });

      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar transação:', err);
      toast({
        title: '❌ Erro',
        description: 'Erro ao atualizar transação: ' + err.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  // Deletar transação
  const deleteTransacao = async (id: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('transacoes_financeiras')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTransacoes(prev => prev.filter(t => t.id !== id));
      toast({
        title: '✅ Transação removida',
        description: 'Transação foi removida com sucesso',
      });

      return true;
    } catch (err: any) {
      console.error('Erro ao deletar transação:', err);
      toast({
        title: '❌ Erro',
        description: 'Erro ao deletar transação: ' + err.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  // Adicionar gasto planejado
  const addGastoPlanejado = async (gastoData: Omit<GastoPlanejado, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<GastoPlanejado | null> => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('gastos_planejados')
        .insert({
          ...gastoData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setGastosPlanejados(prev => [...prev, data as GastoPlanejado]);
      toast({
        title: '✅ Gasto planejado salvo',
        description: `Gasto "${gastoData.nome}" de R$ ${gastoData.valor_estimado.toFixed(2)} adicionado`,
      });

      return data as GastoPlanejado;
    } catch (err: any) {
      console.error('Erro ao adicionar gasto planejado:', err);
      toast({
        title: '❌ Erro',
        description: 'Erro ao salvar gasto planejado: ' + err.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  // Atualizar gasto planejado
  const updateGastoPlanejado = async (id: string, updates: Partial<GastoPlanejado>): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('gastos_planejados')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setGastosPlanejados(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
      toast({
        title: '✅ Gasto planejado atualizado',
        description: 'Gasto planejado foi atualizado com sucesso',
      });

      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar gasto planejado:', err);
      toast({
        title: '❌ Erro',
        description: 'Erro ao atualizar gasto planejado: ' + err.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  // Deletar gasto planejado
  const deleteGastoPlanejado = async (id: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('gastos_planejados')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setGastosPlanejados(prev => prev.filter(g => g.id !== id));
      toast({
        title: '✅ Gasto planejado removido',
        description: 'Gasto planejado foi removido com sucesso',
      });

      return true;
    } catch (err: any) {
      console.error('Erro ao deletar gasto planejado:', err);
      toast({
        title: '❌ Erro',
        description: 'Erro ao deletar gasto planejado: ' + err.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  // Calcular totais
  const totais = {
    receitas: transacoes
      .filter(t => t.tipo === 'receita')
      .reduce((sum, t) => sum + t.valor, 0),
    despesas: transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((sum, t) => sum + t.valor, 0),
    saldo: transacoes.reduce((sum, t) => sum + (t.tipo === 'receita' ? t.valor : -t.valor), 0),
    gastosPlanejadosTotal: gastosPlanejados
      .filter(g => !g.pago)
      .reduce((sum, g) => sum + g.valor_estimado, 0)
  };

  return {
    transacoes,
    gastosPlanejados,
    loading,
    error,
    totais,
    addTransacao,
    updateTransacao,
    deleteTransacao,
    addGastoPlanejado,
    updateGastoPlanejado,
    deleteGastoPlanejado,
    refreshTransacoes: loadTransacoes,
    refreshGastosPlanejados: loadGastosPlanejados
  };
}