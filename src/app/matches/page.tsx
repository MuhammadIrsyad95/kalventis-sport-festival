'use client'

import { useEffect, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

type Match = Database['public']['Tables']['matches']['Row']
type Team = Database['public']['Tables']['teams']['Row']
type Sport = Database['public']['Tables']['sports']['Row']

interface MatchWithTeams extends Match {
  team1?: Team
  team2?: Team
  sport?: Sport
  winner?: Team
}

export default function MatchesPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [matches, setMatches] = useState<MatchWithTeams[]>([])

  useEffect(() => {
    async function fetchMatches() {
      try {
        // Mengambil semua match
        const { data: matchesData, error: matchesError } = await supabase
          .from('matches')
          .select('*')
          .order('round', { ascending: true })

        if (matchesError) throw matchesError

        // Dapatkan semua ID teams dan sports yang dibutuhkan
        const team1Ids = matchesData.map(match => match.team1_id)
        const team2Ids = matchesData.map(match => match.team2_id)
        const sportIds = matchesData.map(match => match.sport_id)

        // Ambil data teams
        const { data: teamsData, error: teamsError } = await supabase
          .from('teams')
          .select('*')
          .in('id', [...team1Ids, ...team2Ids])

        if (teamsError) throw teamsError

        // Ambil data sports
        const { data: sportsData, error: sportsError } = await supabase
          .from('sports')
          .select('*')
          .in('id', sportIds)

        if (sportsError) throw sportsError

        // Gabungkan data
        const enrichedMatches = matchesData.map(match => {
          const team1 = teamsData.find(team => team.id === match.team1_id)
          const team2 = teamsData.find(team => team.id === match.team2_id)
          const sport = sportsData.find(sport => sport.id === match.sport_id)
          const winner = match.winner_id ? teamsData.find(team => team.id === match.winner_id) : undefined

          return {
            ...match,
            team1,
            team2,
            sport,
            winner
          }
        })

        setMatches(enrichedMatches)
      } catch (err) {
        console.error('Error fetching matches:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">All Matches</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">All Matches</h1>
        <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <h2 className="text-xl font-medium text-red-700">Error</h2>
          <p className="mt-2 text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">All Matches</h1>
      
      {matches.length === 0 ? (
        <div className="p-6 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-medium text-gray-700">No matches available</h2>
          <p className="mt-2 text-gray-500">
            No matches have been scheduled yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {matches.map((match) => (
            <div key={match.id} className="card p-6 border rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-semibold">{match.sport?.name || 'Unknown Sport'}</div>
                  <div className="text-gray-400">{match.round}</div>
                </div>
                <CalendarDays className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="text-center flex-1">
                  <p className="font-bold text-xl">{match.team1?.name || 'Team 1'}</p>
                  <p className="text-sm text-gray-400">{match.team1?.company || ''}</p>
                </div>
                
                <div className="px-4">
                  <p className="text-xl font-bold">VS</p>
                </div>
                
                <div className="text-center flex-1">
                  <p className="font-bold text-xl">{match.team2?.name || 'Team 2'}</p>
                  <p className="text-sm text-gray-400">{match.team2?.company || ''}</p>
                </div>
              </div>
              
              {match.winner && (
                <div className="mt-4 text-center">
                  <p className="text-green-400">
                    Winner: {match.winner.name} ({match.winner.company})
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 