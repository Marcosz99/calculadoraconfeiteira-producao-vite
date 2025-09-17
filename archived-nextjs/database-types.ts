export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          nome: string
          email: string | null
          plano: 'free' | 'pro'
          valor_hora: number
          margem_padrao: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nome: string
          email?: string | null
          plano?: 'free' | 'pro'
          valor_hora?: number
          margem_padrao?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string | null
          plano?: 'free' | 'pro'
          valor_hora?: number
          margem_padrao?: number
          created_at?: string
          updated_at?: string
        }
      }
      categorias_ingredientes: {
        Row: {
          id: string
          user_id: string
          nome: string
          cor: string
          icone: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nome: string
          cor?: string
          icone?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nome?: string
          cor?: string
          icone?: string
          created_at?: string
        }
      }
      ingredientes: {
        Row: {
          id: string
          user_id: string
          nome: string
          categoria_id: string | null
          preco_kg: number
          unidade: 'g' | 'ml' | 'unidades'
          densidade: number
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nome: string
          categoria_id?: string | null
          preco_kg: number
          unidade?: 'g' | 'ml' | 'unidades'
          densidade?: number
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nome?: string
          categoria_id?: string | null
          preco_kg?: number
          unidade?: 'g' | 'ml' | 'unidades'
          densidade?: number
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      receitas: {
        Row: {
          id: string
          user_id: string
          nome: string
          descricao: string | null
          tempo_producao: number
          complexidade: 'simples' | 'media' | 'complexa'
          rendimento: number
          imagem_url: string | null
          categoria: string
          ativa: boolean
          custo_calculado: number | null
          preco_sugerido: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nome: string
          descricao?: string | null
          tempo_producao?: number
          complexidade?: 'simples' | 'media' | 'complexa'
          rendimento?: number
          imagem_url?: string | null
          categoria?: string
          ativa?: boolean
          custo_calculado?: number | null
          preco_sugerido?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nome?: string
          descricao?: string | null
          tempo_producao?: number
          complexidade?: 'simples' | 'media' | 'complexa'
          rendimento?: number
          imagem_url?: string | null
          categoria?: string
          ativa?: boolean
          custo_calculado?: number | null
          preco_sugerido?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      receita_ingredientes: {
        Row: {
          id: string
          receita_id: string
          ingrediente_id: string
          quantidade: number
          created_at: string
        }
        Insert: {
          id?: string
          receita_id: string
          ingrediente_id: string
          quantidade: number
          created_at?: string
        }
        Update: {
          id?: string
          receita_id?: string
          ingrediente_id?: string
          quantidade?: number
          created_at?: string
        }
      }
      calculos_salvos: {
        Row: {
          id: string
          user_id: string
          receita_id: string
          quantidade_produzida: number
          preco_unitario: number
          preco_total: number
          detalhes: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          receita_id: string
          quantidade_produzida: number
          preco_unitario: number
          preco_total: number
          detalhes: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          receita_id?: string
          quantidade_produzida?: number
          preco_unitario?: number
          preco_total?: number
          detalhes?: Json
          created_at?: string
        }
      }
      orcamentos: {
        Row: {
          id: string
          user_id: string
          cliente_nome: string
          cliente_contato: string | null
          itens: Json
          valor_total: number
          status: 'pendente' | 'aprovado' | 'rejeitado' | 'concluido'
          observacoes: string | null
          valido_ate: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cliente_nome: string
          cliente_contato?: string | null
          itens: Json
          valor_total: number
          status?: 'pendente' | 'aprovado' | 'rejeitado' | 'concluido'
          observacoes?: string | null
          valido_ate?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cliente_nome?: string
          cliente_contato?: string | null
          itens?: Json
          valor_total?: number
          status?: 'pendente' | 'aprovado' | 'rejeitado' | 'concluido'
          observacoes?: string | null
          valido_ate?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Tipos derivados para uso na aplicação
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Receita = Database['public']['Tables']['receitas']['Row']
export type Ingrediente = Database['public']['Tables']['ingredientes']['Row']
export type CategoriaIngrediente = Database['public']['Tables']['categorias_ingredientes']['Row']
export type ReceitaIngrediente = Database['public']['Tables']['receita_ingredientes']['Row']
export type CalculoSalvo = Database['public']['Tables']['calculos_salvos']['Row']
export type Orcamento = Database['public']['Tables']['orcamentos']['Row']

// Tipos compostos para uso na aplicação
export type ReceitaCompleta = Receita & {
  // Adicionar aliases para compatibilidade com a calculadora
  tempo_preparo: number
  receita_ingredientes: (ReceitaIngrediente & {
    ingredientes: Ingrediente & {
      preco_por_unidade: number // Alias para preco_kg
      user_id: string // Campo adicional para compatibilidade
    }
  })[]
}

export type CalculoDetalhes = {
  custoIngredientes: number
  custoMaoDeObra: number
  custosFixos: number
  custoTotal: number
  margemLucro: number
  precoFinal: number
  breakdown: {
    ingrediente: string
    quantidade: number
    custo: number
  }[]
}

export type ItemOrcamento = {
  receita_id: string
  nome: string
  quantidade: number
  preco_unitario: number
  preco_total: number
}