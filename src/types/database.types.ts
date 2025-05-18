// src/types/database.types.ts

export interface Match {
  id: string;
  team1_id: string;
  team2_id: string;
  sport_id: string;
  winner_id?: string | null;
  round: string;
  created_at?: string;
  team1_score?: number;
  team2_score?: number;
  match_time?: string;
}

export interface Medal {
  id: string;
  team_id: string;
  sport_id: string;
  gold: number;
  silver: number;
  bronze: number;
}

export interface Rule {
  id: string;
  sport_id: string;
  description: string;
  created_at: string;
}

export interface Sport {
  id: string;
  name: string;
  created_at: string;
  imageurl?: string;
}

export interface Team {
  id: string;
  name: string;
  company: string;
  created_at?: string;
}


export type Database = {
  public: {
    Tables: {
      matches: {
        Row: Match;
        Insert: Omit<Match, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Match>;
      };
      medals: {
        Row: Medal;
        Insert: Omit<Medal, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Medal>;
      };
      rules: {
        Row: Rule;
        Insert: Omit<Rule, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Rule>;
      };
      sports: {
        Row: Sport;
        Insert: Omit<Sport, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Sport>;
      };
      teams: {
        Row: Team;
        Insert: Omit<Team, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Team>;
      };

    };
  };
};