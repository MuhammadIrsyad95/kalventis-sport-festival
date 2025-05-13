// File: src/types/view.types.ts
import { Match, Team, Sport } from './database.types';

export interface MatchWithDetails {
  match: Match;
  team1: Team;
  team2: Team;
  sport: Sport;
  winner: Team | null;
}

export interface MedalStanding {
  team: Team;
  sport: Sport;
  medals: {
    gold: number;
    silver: number;
    bronze: number;
    total: number;
  };
}