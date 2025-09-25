export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      backups_usuarios: {
        Row: {
          created_at: string | null
          dados: Json
          dispositivo: string | null
          id: string
          observacoes: string | null
          resolvido: boolean | null
          usuario_email: string
          versao: string | null
        }
        Insert: {
          created_at?: string | null
          dados: Json
          dispositivo?: string | null
          id?: string
          observacoes?: string | null
          resolvido?: boolean | null
          usuario_email: string
          versao?: string | null
        }
        Update: {
          created_at?: string | null
          dados?: Json
          dispositivo?: string | null
          id?: string
          observacoes?: string | null
          resolvido?: boolean | null
          usuario_email?: string
          versao?: string | null
        }
        Relationships: []
      }
      categorias: {
        Row: {
          cor_hex: string
          created_at: string
          icone: string
          id: string
          nome: string
          ordem: number
          updated_at: string
          user_id: string
        }
        Insert: {
          cor_hex: string
          created_at?: string
          icone: string
          id?: string
          nome: string
          ordem?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          cor_hex?: string
          created_at?: string
          icone?: string
          id?: string
          nome?: string
          ordem?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          ativo: boolean | null
          cidade: string | null
          created_at: string
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          observacoes: string | null
          telefone: string | null
          updated_at: string
          user_id: string
          whatsapp: string | null
        }
        Insert: {
          ativo?: boolean | null
          cidade?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          telefone?: string | null
          updated_at?: string
          user_id: string
          whatsapp?: string | null
        }
        Update: {
          ativo?: boolean | null
          cidade?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          telefone?: string | null
          updated_at?: string
          user_id?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      compras_ebooks: {
        Row: {
          created_at: string
          dados_pagamento: Json | null
          ebook_id: string
          id: string
          metodo_pagamento: string
          preco_pago: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dados_pagamento?: Json | null
          ebook_id: string
          id?: string
          metodo_pagamento: string
          preco_pago: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dados_pagamento?: Json | null
          ebook_id?: string
          id?: string
          metodo_pagamento?: string
          preco_pago?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compras_ebooks_ebook_id_fkey"
            columns: ["ebook_id"]
            isOneToOne: false
            referencedRelation: "ebooks"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes_usuario: {
        Row: {
          created_at: string
          custo_hora_trabalho: number | null
          fuso_horario: string | null
          id: string
          margem_padrao: number | null
          moeda: string | null
          notificacoes_email: boolean | null
          notificacoes_whatsapp: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custo_hora_trabalho?: number | null
          fuso_horario?: string | null
          id?: string
          margem_padrao?: number | null
          moeda?: string | null
          notificacoes_email?: boolean | null
          notificacoes_whatsapp?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          custo_hora_trabalho?: number | null
          fuso_horario?: string | null
          id?: string
          margem_padrao?: number | null
          moeda?: string | null
          notificacoes_email?: boolean | null
          notificacoes_whatsapp?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      creditos_ia: {
        Row: {
          created_at: string
          creditos_totais: number
          creditos_usados: number
          data_reset: string
          id: string
          plano: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          creditos_totais?: number
          creditos_usados?: number
          data_reset?: string
          id?: string
          plano?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          creditos_totais?: number
          creditos_usados?: number
          data_reset?: string
          id?: string
          plano?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ebooks: {
        Row: {
          arquivo_url: string | null
          ativo: boolean | null
          autor: string
          capa_url: string | null
          categoria: string | null
          created_at: string
          descricao: string | null
          id: string
          preco: number
          tags: string[] | null
          titulo: string
          updated_at: string
        }
        Insert: {
          arquivo_url?: string | null
          ativo?: boolean | null
          autor: string
          capa_url?: string | null
          categoria?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          preco?: number
          tags?: string[] | null
          titulo: string
          updated_at?: string
        }
        Update: {
          arquivo_url?: string | null
          ativo?: boolean | null
          autor?: string
          capa_url?: string | null
          categoria?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          preco?: number
          tags?: string[] | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      gastos_planejados: {
        Row: {
          categoria: string
          created_at: string
          data_vencimento: string | null
          id: string
          nome: string
          observacoes: string | null
          pago: boolean | null
          updated_at: string
          user_id: string
          valor_estimado: number
        }
        Insert: {
          categoria: string
          created_at?: string
          data_vencimento?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          pago?: boolean | null
          updated_at?: string
          user_id: string
          valor_estimado: number
        }
        Update: {
          categoria?: string
          created_at?: string
          data_vencimento?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          pago?: boolean | null
          updated_at?: string
          user_id?: string
          valor_estimado?: number
        }
        Relationships: []
      }
      historico_ia: {
        Row: {
          created_at: string
          creditos_usados: number | null
          id: string
          metadados: Json | null
          prompt_usuario: string
          resposta_ia: string
          tipo_operacao: string
          user_id: string
        }
        Insert: {
          created_at?: string
          creditos_usados?: number | null
          id?: string
          metadados?: Json | null
          prompt_usuario: string
          resposta_ia: string
          tipo_operacao: string
          user_id: string
        }
        Update: {
          created_at?: string
          creditos_usados?: number | null
          id?: string
          metadados?: Json | null
          prompt_usuario?: string
          resposta_ia?: string
          tipo_operacao?: string
          user_id?: string
        }
        Relationships: []
      }
      ingredientes_usuario: {
        Row: {
          categoria: string
          created_at: string
          data_ultima_compra: string | null
          estoque: number | null
          fornecedor: string | null
          id: string
          nome: string
          preco_medio: number
          unidade_padrao: string
          updated_at: string
          user_id: string
        }
        Insert: {
          categoria: string
          created_at?: string
          data_ultima_compra?: string | null
          estoque?: number | null
          fornecedor?: string | null
          id?: string
          nome: string
          preco_medio?: number
          unidade_padrao: string
          updated_at?: string
          user_id: string
        }
        Update: {
          categoria?: string
          created_at?: string
          data_ultima_compra?: string | null
          estoque?: number | null
          fornecedor?: string | null
          id?: string
          nome?: string
          preco_medio?: number
          unidade_padrao?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      orcamentos: {
        Row: {
          cliente_id: string | null
          created_at: string
          data_evento: string | null
          desconto: number | null
          id: string
          itens: Json
          local_evento: string | null
          numero: string
          observacoes: string | null
          quantidade_pessoas: number | null
          status: string
          updated_at: string
          user_id: string
          valido_ate: string | null
          valor_final: number | null
          valor_total: number | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          data_evento?: string | null
          desconto?: number | null
          id?: string
          itens?: Json
          local_evento?: string | null
          numero: string
          observacoes?: string | null
          quantidade_pessoas?: number | null
          status?: string
          updated_at?: string
          user_id: string
          valido_ate?: string | null
          valor_final?: number | null
          valor_total?: number | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          data_evento?: string | null
          desconto?: number | null
          id?: string
          itens?: Json
          local_evento?: string | null
          numero?: string
          observacoes?: string | null
          quantidade_pessoas?: number | null
          status?: string
          updated_at?: string
          user_id?: string
          valido_ate?: string | null
          valor_final?: number | null
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          created_at: string
          dados_pagamento: Json | null
          data_pagamento: string | null
          data_vencimento: string | null
          id: string
          observacoes: string | null
          plano: string
          referencia_externa: string | null
          status: string
          tipo_pagamento: string
          updated_at: string
          user_id: string
          valor: number
        }
        Insert: {
          created_at?: string
          dados_pagamento?: Json | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          id?: string
          observacoes?: string | null
          plano: string
          referencia_externa?: string | null
          status?: string
          tipo_pagamento: string
          updated_at?: string
          user_id: string
          valor: number
        }
        Update: {
          created_at?: string
          dados_pagamento?: Json | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          id?: string
          observacoes?: string | null
          plano?: string
          referencia_externa?: string | null
          status?: string
          tipo_pagamento?: string
          updated_at?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis_profissionais: {
        Row: {
          ativo: boolean | null
          cidade: string | null
          created_at: string | null
          email: string
          especialidades: string[] | null
          estado: string | null
          id: string
          instagram: string | null
          nome: string
          nome_negocio: string | null
          whatsapp: string | null
        }
        Insert: {
          ativo?: boolean | null
          cidade?: string | null
          created_at?: string | null
          email: string
          especialidades?: string[] | null
          estado?: string | null
          id?: string
          instagram?: string | null
          nome: string
          nome_negocio?: string | null
          whatsapp?: string | null
        }
        Update: {
          ativo?: boolean | null
          cidade?: string | null
          created_at?: string | null
          email?: string
          especialidades?: string[] | null
          estado?: string | null
          id?: string
          instagram?: string | null
          nome?: string
          nome_negocio?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ativo: boolean | null
          bio: string | null
          cep: string | null
          cidade: string | null
          created_at: string | null
          email: string
          endereco: string | null
          estado: string | null
          foto_perfil: string | null
          id: string
          instagram: string | null
          nome: string
          nome_negocio: string | null
          password: string
          plano: string | null
          subscription_status: string | null
          telefone: string | null
          updated_at: string | null
          valor_hora: number | null
          whatsapp: string | null
        }
        Insert: {
          ativo?: boolean | null
          bio?: string | null
          cep?: string | null
          cidade?: string | null
          created_at?: string | null
          email: string
          endereco?: string | null
          estado?: string | null
          foto_perfil?: string | null
          id?: string
          instagram?: string | null
          nome: string
          nome_negocio?: string | null
          password: string
          plano?: string | null
          subscription_status?: string | null
          telefone?: string | null
          updated_at?: string | null
          valor_hora?: number | null
          whatsapp?: string | null
        }
        Update: {
          ativo?: boolean | null
          bio?: string | null
          cep?: string | null
          cidade?: string | null
          created_at?: string | null
          email?: string
          endereco?: string | null
          estado?: string | null
          foto_perfil?: string | null
          id?: string
          instagram?: string | null
          nome?: string
          nome_negocio?: string | null
          password?: string
          plano?: string | null
          subscription_status?: string | null
          telefone?: string | null
          updated_at?: string | null
          valor_hora?: number | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      receitas: {
        Row: {
          categoria_id: string | null
          created_at: string
          custo_total: number | null
          descricao: string | null
          id: string
          ingredientes: Json
          margem_lucro: number | null
          modo_preparo: string | null
          nome: string
          observacoes: string | null
          preco_sugerido: number | null
          rendimento: string | null
          tempo_preparo: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          categoria_id?: string | null
          created_at?: string
          custo_total?: number | null
          descricao?: string | null
          id?: string
          ingredientes?: Json
          margem_lucro?: number | null
          modo_preparo?: string | null
          nome: string
          observacoes?: string | null
          preco_sugerido?: number | null
          rendimento?: string | null
          tempo_preparo?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          categoria_id?: string | null
          created_at?: string
          custo_total?: number | null
          descricao?: string | null
          id?: string
          ingredientes?: Json
          margem_lucro?: number | null
          modo_preparo?: string | null
          nome?: string
          observacoes?: string | null
          preco_sugerido?: number | null
          rendimento?: string | null
          tempo_preparo?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "receitas_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          customer_id: string
          id: string
          plan_id: string
          status: string
          subscription_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          customer_id: string
          id?: string
          plan_id?: string
          status?: string
          subscription_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          customer_id?: string
          id?: string
          plan_id?: string
          status?: string
          subscription_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transacoes_financeiras: {
        Row: {
          categoria: string
          comprovante_url: string | null
          created_at: string
          dados_ocr: Json | null
          data_transacao: string
          descricao: string | null
          id: string
          metodo_pagamento: string | null
          tipo: string
          updated_at: string
          user_id: string
          valor: number
        }
        Insert: {
          categoria: string
          comprovante_url?: string | null
          created_at?: string
          dados_ocr?: Json | null
          data_transacao: string
          descricao?: string | null
          id?: string
          metodo_pagamento?: string | null
          tipo: string
          updated_at?: string
          user_id: string
          valor: number
        }
        Update: {
          categoria?: string
          comprovante_url?: string | null
          created_at?: string
          dados_ocr?: Json | null
          data_transacao?: string
          descricao?: string | null
          id?: string
          metodo_pagamento?: string | null
          tipo?: string
          updated_at?: string
          user_id?: string
          valor?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      reset_monthly_credits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
