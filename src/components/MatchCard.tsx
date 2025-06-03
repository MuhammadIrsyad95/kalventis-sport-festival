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
      className="bg-white rounded-2xl p-6 transition cursor-pointer flex flex-col gap-4"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-base text-indigo-600 font-semibold truncate block max-w-[120px] sm:max-w-none">{sport?.name || 'Loading...'}</span>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 font-bold text-lg truncate">{team1?.name || 'Loading...'}</p>
            <p className="text-sm text-gray-500 truncate">{team1?.company || ''}</p>
          </div>
          <div className="px-6 flex flex-col items-center">
            <span className="text-indigo-500 font-bold text-xl">VS</span>
            {(typeof match.team1_score === 'number' && typeof match.team2_score === 'number') && (
              <span className="text-2xl font-extrabold text-indigo-700 mt-1">{match.team1_score} : {match.team2_score}</span>
            )}
          </div>
          <div className="flex-1 text-right min-w-0">
            <p className="text-gray-900 font-bold text-lg truncate">{team2?.name || 'Loading...'}</p>
            <p className="text-sm text-gray-500 truncate">{team2?.company || ''}</p>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-4 flex flex-wrap justify-between text-sm text-gray-500 gap-2">
          <span>Round: <span className="font-semibold text-gray-700">{match.round || 'TBD'}</span></span>
          {match.match_time && (
            <span>{new Date(match.match_time).toLocaleString()}</span>
          )}
          {match.winner_id && (
            <span className="text-indigo-600 font-semibold">Winner: {match.winner_id === team1?.id ? team1.name : team2?.name}</span>
          )}
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