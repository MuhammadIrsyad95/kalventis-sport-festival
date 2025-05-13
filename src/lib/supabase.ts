import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type Match = {
  id: number
  home_team: string
  away_team: string
  home_score: number
  away_score: number
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED'
  tournament: string
  start_time: string
  created_at: string
}

export type News = {
  id: number
  title: string
  content: string
  image_url: string
  category: string
  created_at: string
}

export type Team = {
  id: number
  name: string
  company_code: string
  logo_url: string
  created_at: string
} 