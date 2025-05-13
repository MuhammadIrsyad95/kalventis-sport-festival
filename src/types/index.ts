export interface Sport {
  id: string;  // UUID in PostgreSQL
  name: string;
  created_at: string;  // Timestamp in PostgreSQL
}

export interface Team {
  id: string;  // UUID in PostgreSQL
  name: string;
  company: string;
  created_at: string;  // Timestamp in PostgreSQL
}

export interface Match {
  id: string;  // UUID in PostgreSQL
  sport_id: string;  // UUID in PostgreSQL
  team1_id: string;  // UUID in PostgreSQL
  team2_id: string;  // UUID in PostgreSQL
  score_team1: number | null;
  score_team2: number | null;
  match_date: string;  // Timestamp in PostgreSQL
  status: 'scheduled' | 'ongoing' | 'completed';
  created_at: string;  // Timestamp in PostgreSQL
}

export interface Medal {
  id: string;  // UUID in PostgreSQL
  team_id: string;  // UUID in PostgreSQL
  sport_id: string;  // UUID in PostgreSQL
  medal_type: 'gold' | 'silver' | 'bronze';
  created_at: string;  // Timestamp in PostgreSQL
}

export interface Rule {
  id: string;  // UUID in PostgreSQL
  sport_id: string;  // UUID in PostgreSQL
  description: string;
  created_at: string;  // Timestamp in PostgreSQL
}
