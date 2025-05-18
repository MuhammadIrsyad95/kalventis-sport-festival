import { Database } from '@/types/supabase'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Match = Database['public']['Tables']['matches']['Row']
type Team = Database['public']['Tables']['teams']['Row']
type Sport = Database['public']['Tables']['sports']['Row']

interface MatchCardProps {
  match: Match
}

export default function MatchCard({ match }: MatchCardProps) {
  const [team1, setTeam1] = useState<Team | null>(null)
  const [team2, setTeam2] = useState<Team | null>(null)
  const [sport, setSport] = useState<Sport | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (match.team1_id) {
        const { data: team1Data } = await supabase
          .from('teams')
          .select('*')
          .eq('id', match.team1_id)
          .single()
        setTeam1(team1Data)
      }

      if (match.team2_id) {
        const { data: team2Data } = await supabase
          .from('teams')
          .select('*')
          .eq('id', match.team2_id)
          .single()
        setTeam2(team2Data)
      }

      if (match.sport_id) {
        const { data: sportData } = await supabase
          .from('sports')
          .select('*')
          .eq('id', match.sport_id)
          .single()
        setSport(sportData)
      }
    }

    fetchData()
  }, [match])

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-lg p-6 hover:bg-white/15 transition cursor-pointer"
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-blue-400 truncate block max-w-[120px] sm:max-w-none">{sport?.name || 'Loading...'}</span>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold truncate">{team1?.name || 'Loading...'}</p>
            <p className="text-sm text-gray-400 truncate">{team1?.company || ''}</p>
          </div>
          <div className="px-4 text-gray-400 flex flex-col items-center">
            <span>VS</span>
            {(typeof match.team1_score === 'number' && typeof match.team2_score === 'number') && (
              <span className="text-lg font-bold text-white">{match.team1_score} : {match.team2_score}</span>
            )}
          </div>
          <div className="flex-1 text-right min-w-0">
            <p className="text-white font-semibold truncate">{team2?.name || 'Loading...'}</p>
            <p className="text-sm text-gray-400 truncate">{team2?.company || ''}</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Round: {match.round || 'TBD'}</span>
            {match.match_time && (
              <span>{new Date(match.match_time).toLocaleString()}</span>
            )}
            {match.winner_id && (
              <span>Winner: {match.winner_id === team1?.id ? team1.name : team2?.name}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )

  return match.sport_id ? (
    <Link
      href={`/sports/${match.sport_id}`}
      style={{ display: 'block', textDecoration: 'none' }}
    >
      {cardContent}
    </Link>
  ) : cardContent;
} 