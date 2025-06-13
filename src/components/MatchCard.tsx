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

  const primaryColor = 'rgb(0, 52, 98)'

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4 transition cursor-pointer flex flex-col gap-3"
    >
      {/* Sport Name */}
      <div className="flex justify-between items-center mb-1">
        <span
          className="text-sm font-medium text-[rgb(0,52,98)] w-full break-words whitespace-normal"
        >
          {sport?.name || 'Loading...'}
        </span>
      </div>

      {/* Teams & Score */}
      <div className="flex justify-between items-center gap-3 flex-wrap sm:flex-nowrap">
        {/* Team 1 */}
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 font-semibold text-sm break-words whitespace-normal">
            {team1?.name || 'Loading...'}
          </p>
        </div>

        {/* VS & Score */}
        <div className="px-3 flex flex-col items-center min-w-fit">
          <span style={{ color: primaryColor }} className="font-bold text-sm">VS</span>
          {(typeof match.team1_score === 'number' && typeof match.team2_score === 'number') && (
            <span className="text-base font-bold mt-1" style={{ color: primaryColor }}>
              {match.team1_score} : {match.team2_score}
            </span>
          )}
        </div>

        {/* Team 2 */}
        <div className="flex-1 min-w-0 text-right">
          <p className="text-gray-900 font-semibold text-sm break-words whitespace-normal">
            {team2?.name || 'Loading...'}
          </p>
        </div>
      </div>

      {/* Info Bawah */}
      <div className="border-t border-gray-100 pt-2 flex flex-wrap justify-between text-xs text-gray-500 gap-2">
        <span>
          Round: <span className="font-medium text-gray-700 break-words whitespace-normal">{match.round || 'TBD'}</span>
        </span>
        {match.match_time && (
          <span>{new Date(match.match_time).toLocaleString()}</span>
        )}
        {match.winner_id && (
          <span style={{ color: primaryColor }} className="font-semibold">
            Winner: {match.winner_id === team1?.id ? team1.name : team2?.name}
          </span>
        )}
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
  ) : cardContent
}
