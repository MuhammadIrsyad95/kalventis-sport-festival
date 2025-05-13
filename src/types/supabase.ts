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
          sport_id: string | null
          team1_id: string | null
          team2_id: string | null
          winner_id: string | null
          round: string | null
        }
        Insert: {
          id?: string
          sport_id?: string | null
          team1_id?: string | null
          team2_id?: string | null
          winner_id?: string | null
          round?: string | null
        }
        Update: {
          id?: string
          sport_id?: string | null
          team1_id?: string | null
          team2_id?: string | null
          winner_id?: string | null
          round?: string | null
        }
      }
      medals: {
        Row: {
          id: string
          team_id: string | null
          sport_id: string | null
          gold: number
          silver: number
          bronze: number
        }
        Insert: {
          id?: string
          team_id?: string | null
          sport_id?: string | null
          gold?: number
          silver?: number
          bronze?: number
        }
        Update: {
          id?: string
          team_id?: string | null
          sport_id?: string | null
          gold?: number
          silver?: number
          bronze?: number
        }
      }
      sports: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          company: string
        }
        Insert: {
          id?: string
          name: string
          company: string
        }
        Update: {
          id?: string
          name?: string
          company?: string
        }
      }
      rules: {
        Row: {
          id: string
          sport_id: string | null
          content: string | null
        }
        Insert: {
          id?: string
          sport_id?: string | null
          content?: string | null
        }
        Update: {
          id?: string
          sport_id?: string | null
          content?: string | null
        }
      }
    }
  }
} 