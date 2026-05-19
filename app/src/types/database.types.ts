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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      checklist_registros: {
        Row: {
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
          created_at: string | null
          id: string
          itens: Json
          nome: string
          turno: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          itens?: Json
          nome: string
          turno: string
        }
        Update: {
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
          emoji: string | null
          id: string
          nome: string
          ordem: number | null
        }
        Insert: {
          emoji?: string | null
          id?: string
          nome: string
          ordem?: number | null
        }
        Update: {
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
          categoria_id: string | null
          id: string
          nome: string
          unidade: string | null
        }
        Insert: {
          ativo?: boolean | null
          categoria_id?: string | null
          id?: string
          nome: string
          unidade?: string | null
        }
        Update: {
          ativo?: boolean | null
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
          created_at: string | null
          funcao: string
          id: string
          nome: string
          turno: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          funcao: string
          id?: string
          nome: string
          turno?: string | null
        }
        Update: {
          ativo?: boolean | null
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
          confirmado: boolean | null
          data: string
          id: string
          membro_id: string | null
          observacao: string | null
          turno: string
        }
        Insert: {
          confirmado?: boolean | null
          data: string
          id?: string
          membro_id?: string | null
          observacao?: string | null
          turno: string
        }
        Update: {
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
          emoji: string | null
          id: string
          nome: string
          ordem: number | null
        }
        Insert: {
          emoji?: string | null
          id?: string
          nome: string
          ordem?: number | null
        }
        Update: {
          emoji?: string | null
          id?: string
          nome?: string
          ordem?: number | null
        }
        Relationships: []
      }
      estoque_contagens: {
        Row: {
          created_at: string | null
          id: string
          item_id: string | null
          quantidade: number
          responsavel: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id?: string | null
          quantidade: number
          responsavel?: string | null
        }
        Update: {
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
      rodada_itens: {
        Row: {
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
          created_at: string | null
          data: string
          id: string
          nome: string
          status: string | null
          total: number | null
        }
        Insert: {
          created_at?: string | null
          data?: string
          id?: string
          nome: string
          status?: string | null
          total?: number | null
        }
        Update: {
          created_at?: string | null
          data?: string
          id?: string
          nome?: string
          status?: string | null
          total?: number | null
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
  T extends keyof DefaultSchema["Tables"],
> = DefaultSchema["Tables"][T]["Row"]

export type TablesInsert<
  T extends keyof DefaultSchema["Tables"],
> = DefaultSchema["Tables"][T]["Insert"]

export type TablesUpdate<
  T extends keyof DefaultSchema["Tables"],
> = DefaultSchema["Tables"][T]["Update"]
