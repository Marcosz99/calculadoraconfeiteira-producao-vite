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
          telefone?: string | null
          updated_at?: string | null
          valor_hora?: number | null
          whatsapp?: string | null
        }
        Relationships: []
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
