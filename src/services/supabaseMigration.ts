// @ts-nocheck
// Supabase Migration Service - Migrate localStorage to Supabase
import { supabase } from '@/integrations/supabase/client';
import { 
  getFromLocalStorage, 
  LOCAL_STORAGE_KEYS,
  saveToLocalStorage,
  removeFromLocalStorage 
} from '@/utils/localStorage';

class SupabaseMigrationService {
  // ===== RECEITAS MIGRATION =====
  async migrateReceitas(userId: string): Promise<boolean> {
    try {
      const localReceitas = getFromLocalStorage<Receita[]>(LOCAL_STORAGE_KEYS.RECEITAS, []);
      
      if (localReceitas.length === 0) return true;

      // Get existing receitas from Supabase
      const { data: existingReceitas } = await supabase
        .from('receitas')
        .select('nome')
        .eq('user_id', userId);

      const existingNames = new Set(existingReceitas?.map(r => r.nome) || []);

      // Prepare data for Supabase with correct schema
      const receitasToInsert = localReceitas
        .filter(receita => !existingNames.has(receita.nome))
        .map(receita => ({
          user_id: userId,
          nome: receita.nome,
          descricao: receita.descricao || '',
          modo_preparo: receita.modo_preparo.join('\n'),
          tempo_preparo: receita.tempo_preparo_mins || 30,
          rendimento: receita.rendimento || '',
          ingredientes: JSON.stringify(receita.ingredientes || []),
          custo_total: receita.custo_calculado || 0,
          preco_sugerido: receita.preco_sugerido || 0,
        }));

      if (receitasToInsert.length > 0) {
        const { error } = await supabase
          .from('receitas')
          .insert(receitasToInsert);

        if (error) {
          console.error('Erro ao migrar receitas:', error);
          return false;
        }

        console.log(`✅ Migradas ${receitasToInsert.length} receitas para Supabase`);
      }

      return true;
    } catch (error) {
      console.error('Erro na migração de receitas:', error);
      return false;
    }
  }

  // ===== INGREDIENTES MIGRATION =====
  async migrateIngredientes(userId: string): Promise<boolean> {
    try {
      const localIngredientes = getFromLocalStorage<IngredienteUsuario[]>(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, []);
      
      if (localIngredientes.length === 0) return true;

      // Get existing ingredientes from Supabase
      const { data: existingIngredientes } = await supabase
        .from('ingredientes_usuario')
        .select('nome')
        .eq('user_id', userId);

      const existingNames = new Set(existingIngredientes?.map(i => i.nome) || []);

      // Prepare data for Supabase
      const ingredientesToInsert = localIngredientes
        .filter(ingrediente => !existingNames.has(ingrediente.nome))
        .map(ingrediente => ({
          user_id: userId,
          nome: ingrediente.nome,
          categoria: ingrediente.categoria || 'Outros',
          preco_medio: ingrediente.preco_atual || 0,
          unidade_padrao: ingrediente.unidade || 'g',
          fornecedor: ingrediente.fornecedor || '',
          estoque: ingrediente.estoque_atual || 0,
        }));

      if (ingredientesToInsert.length > 0) {
        const { error } = await supabase
          .from('ingredientes_usuario')
          .insert(ingredientesToInsert);

        if (error) {
          console.error('Erro ao migrar ingredientes:', error);
          return false;
        }

        console.log(`✅ Migrados ${ingredientesToInsert.length} ingredientes para Supabase`);
      }

      return true;
    } catch (error) {
      console.error('Erro na migração de ingredientes:', error);
      return false;
    }
  }

  // ===== CLIENTES MIGRATION =====
  async migrateClientes(userId: string): Promise<boolean> {
    try {
      const localClientes = getFromLocalStorage<Cliente[]>(LOCAL_STORAGE_KEYS.CLIENTES, []);
      
      if (localClientes.length === 0) return true;

      // Get existing clientes from Supabase
      const { data: existingClientes } = await supabase
        .from('clientes')
        .select('nome, telefone')
        .eq('user_id', userId);

      const existingKeys = new Set(existingClientes?.map(c => `${c.nome}_${c.telefone}`) || []);

      // Prepare data for Supabase
      const clientesToInsert = localClientes
        .filter(cliente => !existingKeys.has(`${cliente.nome}_${cliente.telefone}`))
        .map(cliente => ({
          user_id: userId,
          nome: cliente.nome,
          telefone: cliente.telefone || '',
          whatsapp: cliente.whatsapp || '',
          email: cliente.email || '',
          endereco: cliente.endereco_completo || '',
          data_nascimento: cliente.data_nascimento || null,
          observacoes: cliente.observacoes || '',
          ativo: cliente.ativo !== false,
        }));

      if (clientesToInsert.length > 0) {
        const { error } = await supabase
          .from('clientes')
          .insert(clientesToInsert);

        if (error) {
          console.error('Erro ao migrar clientes:', error);
          return false;
        }

        console.log(`✅ Migrados ${clientesToInsert.length} clientes para Supabase`);
      }

      return true;
    } catch (error) {
      console.error('Erro na migração de clientes:', error);
      return false;
    }
  }

  // ===== ORCAMENTOS MIGRATION =====
  async migrateOrcamentos(userId: string): Promise<boolean> {
    try {
      const localOrcamentos = getFromLocalStorage<Orcamento[]>(LOCAL_STORAGE_KEYS.ORCAMENTOS, []);
      
      if (localOrcamentos.length === 0) return true;

      // Get existing orcamentos from Supabase
      const { data: existingOrcamentos } = await supabase
        .from('orcamentos')
        .select('numero')
        .eq('user_id', userId);

      const existingNumbers = new Set(existingOrcamentos?.map(o => o.numero) || []);

      // Prepare data for Supabase
      const orcamentosToInsert = localOrcamentos
        .filter(orcamento => !existingNumbers.has(orcamento.numero_orcamento))
        .map(orcamento => ({
          user_id: userId,
          numero: orcamento.numero_orcamento,
          status: orcamento.status,
          valor_total: orcamento.valor_total || 0,
          observacoes: orcamento.observacoes || '',
          valido_ate: orcamento.data_validade || null,
          itens: JSON.stringify(orcamento.itens || []),
        }));

      if (orcamentosToInsert.length > 0) {
        const { error } = await supabase
          .from('orcamentos')
          .insert(orcamentosToInsert);

        if (error) {
          console.error('Erro ao migrar orçamentos:', error);
          return false;
        }

        console.log(`✅ Migrados ${orcamentosToInsert.length} orçamentos para Supabase`);
      }

      return true;
    } catch (error) {
      console.error('Erro na migração de orçamentos:', error);
      return false;
    }
  }

  // ===== FULL MIGRATION =====
  async migrateAllUserData(userId: string): Promise<{
    success: boolean;
    results: {
      receitas: boolean;
      ingredientes: boolean;
      clientes: boolean;
      orcamentos: boolean;
    };
  }> {
    console.log('🚀 Iniciando migração completa de dados para Supabase...');

    const results = {
      receitas: await this.migrateReceitas(userId),
      ingredientes: await this.migrateIngredientes(userId),
      clientes: await this.migrateClientes(userId),
      orcamentos: await this.migrateOrcamentos(userId),
    };

    const success = Object.values(results).every(result => result);

    if (success) {
      console.log('✅ Migração completa realizada com sucesso!');
      // Mark migration as completed in localStorage
      saveToLocalStorage('doce_migration_completed', {
        userId,
        timestamp: new Date().toISOString(),
        results
      });
    } else {
      console.log('❌ Alguns dados falharam na migração');
    }

    return { success, results };
  }

  // ===== MIGRATION STATUS =====
  isMigrationCompleted(userId: string): boolean {
    const migrationData = getFromLocalStorage<any>('doce_migration_completed', null);
    return migrationData && migrationData.userId === userId;
  }

  // ===== DATA FETCHERS (Replace localStorage reads) =====
  async getReceitas(userId: string): Promise<Receita[]> {
    try {
      const { data, error } = await supabase
        .from('receitas')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map Supabase data to App format
      return data?.map(item => ({
        id: item.id,
        usuario_id: item.user_id,
        categoria_id: '',
        nome: item.nome,
        descricao: item.descricao || '',
        modo_preparo: item.modo_preparo ? item.modo_preparo.split('\n') : [],
        tempo_preparo_mins: item.tempo_preparo || 30,
        rendimento: item.rendimento || '',
        dificuldade: 'intermediario' as const,
        foto_principal: '',
        ingredientes: typeof item.ingredientes === 'string' ? JSON.parse(item.ingredientes) : (item.ingredientes || []),
        tags: [],
        ativo: true,
        criado_em: item.created_at,
        atualizado_em: item.updated_at,
        custo_calculado: item.custo_total,
        preco_sugerido: item.preco_sugerido,
        origem: 'usuario' as const
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
      // Fallback to localStorage
      return getFromLocalStorage<Receita[]>(LOCAL_STORAGE_KEYS.RECEITAS, []);
    }
  }

  async getIngredientes(userId: string): Promise<IngredienteUsuario[]> {
    try {
      const { data, error } = await supabase
        .from('ingredientes_usuario')
        .select('*')
        .eq('user_id', userId)
        .order('nome');

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        usuario_id: item.user_id,
        nome: item.nome,
        preco_atual: item.preco_medio || 0,
        unidade: item.unidade_padrao,
        categoria: item.categoria,
        fornecedor: item.fornecedor || undefined,
        data_atualizacao: item.updated_at,
        estoque_atual: item.estoque,
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar ingredientes:', error);
      return getFromLocalStorage<IngredienteUsuario[]>(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, []);
    }
  }

  async getClientes(userId: string): Promise<Cliente[]> {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('user_id', userId)
        .order('nome');

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        usuario_id: item.user_id,
        nome: item.nome,
        telefone: item.telefone || undefined,
        whatsapp: item.whatsapp || undefined,
        email: item.email || undefined,
        endereco_completo: item.endereco || undefined,
        data_nascimento: item.data_nascimento,
        observacoes: item.observacoes,
        criado_em: item.created_at,
        ativo: item.ativo !== false,
        historico_pedidos: 0,
        valor_total_gasto: 0,
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return getFromLocalStorage<Cliente[]>(LOCAL_STORAGE_KEYS.CLIENTES, []);
    }
  }
}

export const migrationService = new SupabaseMigrationService();