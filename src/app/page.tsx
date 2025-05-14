// src/app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import MatchCard from '@/components/MatchCard'
// import MedalTally from '@/components/MedalTally'
import SportsList from '@/components/SportsList'
import type { Database } from '@/types/supabase'

type Match = Database['public']['Tables']['matches']['Row']
// type Medal = Database['public']['Tables']['medals']['Row']
type Sport = Database['public']['Tables']['sports']['Row']

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  // const [medalTally, setMedalTally] = useState<Medal[]>([])
  const [sports, setSports] = useState<Sport[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [matchesRes, medalsRes, sportsRes] = await Promise.all([
          supabase
            .from('matches')
            .select('*')
            .order('round', { ascending: true }),
          supabase
            .from('medals')
            .select('*'),
          supabase
            .from('sports')
            .select('*')
        ])

        if (matchesRes.error) throw new Error(matchesRes.error.message)
        if (medalsRes.error) throw new Error(medalsRes.error.message)
        if (sportsRes.error) throw new Error(sportsRes.error.message)

        setMatches(matchesRes.data || [])
        // setMedalTally(medalsRes.data || [])
        setSports(sportsRes.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Kalventis Sport Festival
          </h1>
          <p className="text-gray-300 text-lg">
            Real-time scores and match details for the Kalventis Sport Festival
          </p>
        </motion.section>

        {/* Matches Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
            {matches.length === 0 && (
              <p className="text-gray-400 col-span-full text-center py-8">
                No matches available
              </p>
            )}
          </div>
        </section>

        {/* Medal Tally Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Medal Tally</h2>
          {/* <MedalTally medals={medalTally} /> */}
        </section>

        {/* Sports Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Sports</h2>
          <SportsList sports={sports} />
        </section>
      </div>
    </main>
  )
}
