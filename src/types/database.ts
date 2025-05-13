export type Match = {
  id: string
  sport_id: string | null
  team1_id: string | null
  team2_id: string | null
  winner_id: string | null
  round: string | null
}

export type Medal = {
  id: string
  team_id: string | null
  sport_id: string | null
  gold: number
  silver: number
  bronze: number
}

export type Rule = {
  id: string
  sport_id: string | null
  content: string | null
}

export type Sport = {
  id: string
  name: string
}

export type Team = {
  id: string
  name: string
  company: string
}

// Join types for common queries
export type MatchWithTeams = Match & {
  sport: Sport
  team1: Team
  team2: Team
  winner: Team | null
}

export type MedalWithTeam = Medal & {
  team: Team
  sport: Sport
}

export type RuleWithSport = Rule & {
  sport: Sport
} 