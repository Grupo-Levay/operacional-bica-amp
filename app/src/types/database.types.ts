export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bar_tables: {
        Row: {
          capacity: number
          created_at: string
          id: string
          is_active: boolean
          location: string | null
          number: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          capacity: number
          created_at?: string
          id?: string
          is_active?: boolean
          location?: string | null
          number: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          id?: string
          is_active?: boolean
          location?: string | null
          number?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      checklist_registros: {
        Row: {
          casa: string
          checklist_id: string | null
          concluido: boolean | null
          created_at: string | null
          data: string
          id: string
          itens_concluidos: Json | null
          responsavel: string | null
          turno: string
        }
        Insert: {
          casa?: string
          checklist_id?: string | null
          concluido?: boolean | null
          created_at?: string | null
          data?: string
          id?: string
          itens_concluidos?: Json | null
          responsavel?: string | null
          turno: string
        }
        Update: {
          casa?: string
          checklist_id?: string | null
          concluido?: boolean | null
          created_at?: string | null
          data?: string
          id?: string
          itens_concluidos?: Json | null
          responsavel?: string | null
          turno?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_registros_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      checklists: {
        Row: {
          casa: string
          created_at: string | null
          id: string
          itens: Json
          nome: string
          turno: string
        }
        Insert: {
          casa?: string
          created_at?: string | null
          id?: string
          itens?: Json
          nome: string
          turno: string
        }
        Update: {
          casa?: string
          created_at?: string | null
          id?: string
          itens?: Json
          nome?: string
          turno?: string
        }
        Relationships: []
      }
      compras_categorias: {
        Row: {
          casa: string
          emoji: string | null
          id: string
          nome: string
          ordem: number | null
        }
        Insert: {
          casa?: string
          emoji?: string | null
          id?: string
          nome: string
          ordem?: number | null
        }
        Update: {
          casa?: string
          emoji?: string | null
          id?: string
          nome?: string
          ordem?: number | null
        }
        Relationships: []
      }
      compras_itens: {
        Row: {
          ativo: boolean | null
          casa: string
          categoria_id: string | null
          id: string
          nome: string
          unidade: string | null
        }
        Insert: {
          ativo?: boolean | null
          casa?: string
          categoria_id?: string | null
          id?: string
          nome: string
          unidade?: string | null
        }
        Update: {
          ativo?: boolean | null
          casa?: string
          categoria_id?: string | null
          id?: string
          nome?: string
          unidade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compras_itens_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "compras_categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      equipe: {
        Row: {
          ativo: boolean | null
          casa: string
          created_at: string | null
          funcao: string
          id: string
          nome: string
          turno: string | null
        }
        Insert: {
          ativo?: boolean | null
          casa?: string
          created_at?: string | null
          funcao: string
          id?: string
          nome: string
          turno?: string | null
        }
        Update: {
          ativo?: boolean | null
          casa?: string
          created_at?: string | null
          funcao?: string
          id?: string
          nome?: string
          turno?: string | null
        }
        Relationships: []
      }
      escala: {
        Row: {
          casa: string
          confirmado: boolean | null
          data: string
          id: string
          membro_id: string | null
          observacao: string | null
          turno: string
        }
        Insert: {
          casa?: string
          confirmado?: boolean | null
          data: string
          id?: string
          membro_id?: string | null
          observacao?: string | null
          turno: string
        }
        Update: {
          casa?: string
          confirmado?: boolean | null
          data?: string
          id?: string
          membro_id?: string | null
          observacao?: string | null
          turno?: string
        }
        Relationships: [
          {
            foreignKeyName: "escala_membro_id_fkey"
            columns: ["membro_id"]
            isOneToOne: false
            referencedRelation: "equipe"
            referencedColumns: ["id"]
          },
        ]
      }
      estoque_categorias: {
        Row: {
          casa: string
          emoji: string | null
          id: string
          nome: string
          ordem: number | null
        }
        Insert: {
          casa?: string
          emoji?: string | null
          id?: string
          nome: string
          ordem?: number | null
        }
        Update: {
          casa?: string
          emoji?: string | null
          id?: string
          nome?: string
          ordem?: number | null
        }
        Relationships: []
      }
      estoque_contagens: {
        Row: {
          casa: string
          created_at: string | null
          id: string
          item_id: string | null
          quantidade: number
          responsavel: string | null
        }
        Insert: {
          casa?: string
          created_at?: string | null
          id?: string
          item_id?: string | null
          quantidade: number
          responsavel?: string | null
        }
        Update: {
          casa?: string
          created_at?: string | null
          id?: string
          item_id?: string | null
          quantidade?: number
          responsavel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estoque_contagens_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "estoque_itens"
            referencedColumns: ["id"]
          },
        ]
      }
      estoque_itens: {
        Row: {
          ativo: boolean | null
          atual: number | null
          casa: string
          categoria_id: string | null
          id: string
          minimo: number | null
          nome: string
          unidade: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          atual?: number | null
          casa?: string
          categoria_id?: string | null
          id?: string
          minimo?: number | null
          nome: string
          unidade?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          atual?: number | null
          casa?: string
          categoria_id?: string | null
          id?: string
          minimo?: number | null
          nome?: string
          unidade?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estoque_itens_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "estoque_categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      fichas_tecnicas: {
        Row: {
          ativo: boolean | null
          casa: string
          categoria: string | null
          cmv_pct: number | null
          created_at: string | null
          custo_total: number | null
          id: string
          ingredientes: Json | null
          nome: string
          preco_venda: number | null
          rendimento: number | null
          unidade_rendimento: string | null
        }
        Insert: {
          ativo?: boolean | null
          casa?: string
          categoria?: string | null
          cmv_pct?: number | null
          created_at?: string | null
          custo_total?: number | null
          id?: string
          ingredientes?: Json | null
          nome: string
          preco_venda?: number | null
          rendimento?: number | null
          unidade_rendimento?: string | null
        }
        Update: {
          ativo?: boolean | null
          casa?: string
          categoria?: string | null
          cmv_pct?: number | null
          created_at?: string | null
          custo_total?: number | null
          id?: string
          ingredientes?: Json | null
          nome?: string
          preco_venda?: number | null
          rendimento?: number | null
          unidade_rendimento?: string | null
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          created_by: string | null
          created_by_name: string | null
          customer_name: string
          customer_phone: string | null
          end_time: string
          guest_count: number
          id: string
          notes: string | null
          reservation_date: string
          start_time: string
          status: Database["public"]["Enums"]["reservation_status"]
          table_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          created_by_name?: string | null
          customer_name: string
          customer_phone?: string | null
          end_time: string
          guest_count: number
          id?: string
          notes?: string | null
          reservation_date: string
          start_time: string
          status?: Database["public"]["Enums"]["reservation_status"]
          table_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          created_by_name?: string | null
          customer_name?: string
          customer_phone?: string | null
          end_time?: string
          guest_count?: number
          id?: string
          notes?: string | null
          reservation_date?: string
          start_time?: string
          status?: Database["public"]["Enums"]["reservation_status"]
          table_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "bar_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      rodada_itens: {
        Row: {
          casa: string
          comprado: boolean | null
          id: string
          item_id: string | null
          nome: string
          preco_unit: number | null
          quantidade: number | null
          rodada_id: string | null
          total: number | null
          unidade: string | null
        }
        Insert: {
          casa?: string
          comprado?: boolean | null
          id?: string
          item_id?: string | null
          nome: string
          preco_unit?: number | null
          quantidade?: number | null
          rodada_id?: string | null
          total?: number | null
          unidade?: string | null
        }
        Update: {
          casa?: string
          comprado?: boolean | null
          id?: string
          item_id?: string | null
          nome?: string
          preco_unit?: number | null
          quantidade?: number | null
          rodada_id?: string | null
          total?: number | null
          unidade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rodada_itens_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "compras_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rodada_itens_rodada_id_fkey"
            columns: ["rodada_id"]
            isOneToOne: false
            referencedRelation: "rodadas"
            referencedColumns: ["id"]
          },
        ]
      }
      rodadas: {
        Row: {
          casa: string
          created_at: string | null
          data: string
          id: string
          nome: string
          status: string | null
          total: number | null
        }
        Insert: {
          casa?: string
          created_at?: string | null
          data?: string
          id?: string
          nome: string
          status?: string | null
          total?: number | null
        }
        Update: {
          casa?: string
          created_at?: string | null
          data?: string
          id?: string
          nome?: string
          status?: string | null
          total?: number | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          active: boolean
          casas: string[]
          created_at: string
          display_name: string
          email: string
          id: string
          last_login_at: string | null
          role: Database["public"]["Enums"]["team_role"]
          updated_at: string
        }
        Insert: {
          active?: boolean
          casas?: string[]
          created_at?: string
          display_name: string
          email: string
          id: string
          last_login_at?: string | null
          role?: Database["public"]["Enums"]["team_role"]
          updated_at?: string
        }
        Update: {
          active?: boolean
          casas?: string[]
          created_at?: string
          display_name?: string
          email?: string
          id?: string
          last_login_at?: string | null
          role?: Database["public"]["Enums"]["team_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_active_team_member: { Args: never; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      member_has_casa: { Args: { p_casa: string }; Returns: boolean }
    }
    Enums: {
      reservation_status: "pendente" | "confirmada" | "cancelada" | "concluida"
      team_role: "admin" | "atendente"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  T extends keyof DefaultSchema["Tables"],
> = DefaultSchema["Tables"][T]["Row"]

export type TablesInsert<
  T extends keyof DefaultSchema["Tables"],
> = DefaultSchema["Tables"][T]["Insert"]

export type TablesUpdate<
  T extends keyof DefaultSchema["Tables"],
> = DefaultSchema["Tables"][T]["Update"]

export type Enums<T extends keyof DefaultSchema["Enums"]> = DefaultSchema["Enums"][T]
