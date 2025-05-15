'use client'

import { useEffect, useState } from 'react'
import { Match, Team, Sport } from '@/types/database.types'
import { supabase } from '@/lib/supabase'
import { Trophy } from 'lucide-react'

interface LiveMatchCardProps {
  match: Match
}

export default function LiveMatchCard({ match }: LiveMatchCardProps) {
  const [team1, setTeam1] = useState<Team | null>(null)
  const [team2, setTeam2] = useState<Team | null>(null)
  const [sport, setSport] = useState<Sport | null>(null)
  const [status, setStatus] = useState<string>('scheduled')
  const [score1, setScore1] = useState<number | null>(null)
  const [score2, setScore2] = useState<number | null>(null)

  useEffect(() => {
    fetchTeamsAndSport()
    
    // For demo purposes, generate random scores
    if (match) {
      setScore1(Math.floor(Math.random() * 10))
      setScore2(Math.floor(Math.random() * 10))
      
      // Set a random status
      const statuses = ['scheduled', 'live', 'finished']
      setStatus(statuses[Math.floor(Math.random() * statuses.length)])
    }
  }, [match])

  const fetchTeamsAndSport = async () => {
    const [team1Data, team2Data, sportData] = await Promise.all([
      supabase.from('teams').select('*').eq('id', match.team1_id).single(),
      supabase.from('teams').select('*').eq('id', match.team2_id).single(),
      supabase.from('sports').select('*').eq('id', match.sport_id).single()
    ])

    if (team1Data.data) setTeam1(team1Data.data)
    if (team2Data.data) setTeam2(team2Data.data)
    if (sportData.data) setSport(sportData.data)
  }

  const getStatusColor = () => {
    switch (status) {
      case 'live':
        return 'bg-red-500'
      case 'finished':
        return 'bg-gray-500'
      default:
        return 'bg-green-500'
    }
  }

  if (!team1 || !team2 || !sport) return null

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">{sport.name}</span>
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor()}`}>
            {status.toUpperCase()}
          </span>
        </div>
        <div className="mt-1 text-sm text-gray-400">{match.round}</div>
      </div>

      {/* Teams */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-lg font-semibold">{team1.name}</div>
            <div className="text-sm text-gray-400">{team1.company}</div>
          </div>
          <div className="text-2xl font-bold">{score1 ?? '-'}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-lg font-semibold">{team2.name}</div>
            <div className="text-sm text-gray-400">{team2.company}</div>
          </div>
          <div className="text-2xl font-bold">{score2 ?? '-'}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-white/5">
        <div className="text-sm text-gray-400">
          {match.created_at ? new Date(match.created_at).toLocaleString() : 'Date not available'}
        </div>
      </div>
    </div>
  )
} 