import { supabase } from '@/lib/supabase'
import { MatchWithDetails } from '@/types/view.types'
import { CalendarDays } from 'lucide-react'

async function getAllMatches(): Promise<MatchWithDetails[]> {
  const { data: matches, error: matchError } = await supabase
    .from('matches')
    .select(`
      *,
      sport:sports(*),
      team1:teams!matches_team1_id_fkey(*),
      team2:teams!matches_team2_id_fkey(*),
      winner:teams!matches_winner_id_fkey(*)
    `)
    .order('round', { ascending: true })

  if (matchError) {
    console.error('Error fetching matches:', matchError)
    return []
  }

  return matches.map(match => ({
    match: {
      id: match.id,
      sport_id: match.sport_id,
      team1_id: match.team1_id,
      team2_id: match.team2_id,
      winner_id: match.winner_id,
      round: match.round
    },
    sport: match.sport,
    team1: match.team1,
    team2: match.team2,
    winner: match.winner
  }))
}

export default async function MatchesPage() {
  const matches = await getAllMatches()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">All Matches</h1>
      
      <div className="grid gap-6">
        {matches.map((matchDetails) => (
          <div key={matchDetails.match.id} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-lg font-semibold">{matchDetails.sport.name}</div>
                <div className="text-gray-400">{matchDetails.match.round}</div>
              </div>
              <CalendarDays className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="font-bold text-xl">{matchDetails.team1.name}</p>
                <p className="text-sm text-gray-400">{matchDetails.team1.company}</p>
              </div>
              
              <div className="px-4">
                <p className="text-xl font-bold">VS</p>
              </div>
              
              <div className="text-center flex-1">
                <p className="font-bold text-xl">{matchDetails.team2.name}</p>
                <p className="text-sm text-gray-400">{matchDetails.team2.company}</p>
              </div>
            </div>
            
            {matchDetails.winner && (
              <div className="mt-4 text-center">
                <p className="text-green-400">
                  Winner: {matchDetails.winner.name} ({matchDetails.winner.company})
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 