// src/app/sports/[id]/page.tsx

import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import SportRules from '@/components/SportRules'
import { Match } from '@/types/database.types'

// Tambahkan tipe eksplisit untuk parameter fungsi halaman
type PageProps = {
  params: {
    id: string
  }
}

// Tipe untuk pertandingan dengan data tim yang ditautkan
interface MatchWithTeams extends Match {
  team1: { name: string; company: string } | null
  team2: { name: string; company: string } | null
  winner: { name: string; company: string } | null
}

// Fungsi async untuk mengambil detail olahraga dari Supabase
async function getSportDetails(id: string) {
  const [sportRes, rulesRes, matchesRes] = await Promise.all([
    supabase.from('sports').select('*').eq('id', id).single(),
    supabase.from('rules').select('*').eq('sport_id', id),
    supabase
      .from('matches')
      .select(`
        *,
        team1:teams!matches_team1_id_fkey(name, company),
        team2:teams!matches_team2_id_fkey(name, company),
        winner:teams!matches_winner_id_fkey(name, company)
      `)
      .eq('sport_id', id)
      .order('round', { ascending: true })
  ])

  if (!sportRes.data) {
    return notFound()
  }

  return {
    sport: sportRes.data,
    rules: rulesRes.data || [],
    matches: (matchesRes.data || []) as MatchWithTeams[]
  }
}

// Fungsi halaman utama
export default async function SportDetailPage({ params }: PageProps) {
  if (!params?.id) return notFound()

  const { sport, rules, matches } = await getSportDetails(params.id)

  // Group pertandingan berdasarkan round
  const matchesByRound = matches.reduce((acc, match) => {
    const round = match.round || 'Unknown'
    if (!acc[round]) {
      acc[round] = []
    }
    acc[round].push(match)
    return acc
  }, {} as Record<string, MatchWithTeams[]>)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{sport.name}</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Rules Section */}
        <div>
          <SportRules rules={rules} sportName={sport.name} />
        </div>

        {/* Tournament Bracket Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-4">Tournament Bracket</h3>
          {Object.entries(matchesByRound).map(([round, roundMatches]) => (
            <div key={round} className="mb-8">
              <h4 className="text-xl font-semibold mb-4 text-blue-400">{round}</h4>
              <div className="space-y-4">
                {roundMatches.map((match) => (
                  <div
                    key={match.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex-1">
                        <p className="font-semibold">{match.team1?.name}</p>
                        <p className="text-sm text-gray-400">{match.team1?.company}</p>
                      </div>
                      <div className="px-4 text-xl font-bold">VS</div>
                      <div className="flex-1 text-right">
                        <p className="font-semibold">{match.team2?.name}</p>
                        <p className="text-sm text-gray-400">{match.team2?.company}</p>
                      </div>
                    </div>
                    {match.winner && (
                      <div className="mt-2 text-center text-green-400 text-sm">
                        Winner: {match.winner.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {matches.length === 0 && (
            <p className="text-gray-400">No matches scheduled yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
