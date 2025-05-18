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
      matches: {
        Row: {
          id: string
          sport_id: string
          team1_id: string
          team2_id: string
          winner_id: string | null
          round: string | null
          team1_score?: number | null
          team2_score?: number | null
          match_time?: string | null
        }
        Insert: {
          id?: string
          sport_id: string
          team1_id: string
          team2_id: string
          winner_id?: string | null
          round?: string | null
          team1_score?: number | null
          team2_score?: number | null
          match_time?: string | null
        }
        Update: {
          id?: string
          sport_id?: string
          team1_id?: string
          team2_id?: string
          winner_id?: string | null
          round?: string | null
          team1_score?: number | null
          team2_score?: number | null
          match_time?: string | null
        }
      }
      rules: {
        Row: {
          id: string
          sport_id: string
          rule_text: string
        }
        Insert: {
          id?: string
          sport_id: string
          rule_text: string
        }
        Update: {
          id?: string
          sport_id?: string
          rule_text?: string
        }
      }
      sports: {
        Row: {
          id: string
          name: string
          description: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          company: string
          logo_url: string | null
        }
        Insert: {
          id?: string
          name: string
          company: string
          logo_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          company?: string
          logo_url?: string | null
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