export interface Match {
  id: string
  team1_id: string
  team2_id: string
  sport_id: string
  winner_id?: string | null
  round: string
  created_at?: string
}

export interface Medal {
  id: string
  team_id: string
  sport_id: string
  medal_type: 'gold' | 'silver' | 'bronze'
  created_at: string
}

export interface Rule {
  id: string
  sport_id: string
  description: string
  created_at: string
}

export interface Sport {
  id: string
  name: string
  created_at: string
}

export interface Team {
  id: string
  name: string
  company: string
  created_at?: string
}

export interface News {
  id: number
  title: string
  content: string
  image_url: string
  category: string
  created_at: string
} 