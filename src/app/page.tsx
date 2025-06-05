'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'
import type { Medal } from '@/types/database.types'

import HeroSection from '@/components/home/HeroSection'
import MatchesSection from '@/components/home/MatchesSection'
import MedalsSection from '@/components/home/MedalsSection'
import SportsSection from '@/components/home/SportsSection'
import ContactSection from '@/components/ContactSection'

type Match = Database['public']['Tables']['matches']['Row']
type Sport = Database['public']['Tables']['sports']['Row']
type Team = Database['public']['Tables']['teams']['Row']

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [medalTally, setMedalTally] = useState<Medal[]>([])
  const [sports, setSports] = useState<Sport[]>([])
  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [matchesRes, medalsRes, sportsRes, teamsRes] = await Promise.all([
          supabase.from('matches').select('*').order('round', { ascending: true }),
          supabase.from('medals').select('*'),
          supabase.from('sports').select('*'),
          supabase.from('teams').select('*')
        ])

        if (matchesRes.error) throw new Error(matchesRes.error.message)
        if (medalsRes.error) throw new Error(medalsRes.error.message)
        if (sportsRes.error) throw new Error(sportsRes.error.message)
        if (teamsRes.error) throw new Error(teamsRes.error.message)

        setMatches(matchesRes.data || [])
        setMedalTally(medalsRes.data || [])
        setSports(sportsRes.data || [])
        setTeams(teamsRes.data || [])
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
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-white">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <HeroSection />
        <MatchesSection matches={matches} />
        <MedalsSection medals={medalTally} />
        <SportsSection sports={sports} />
      </div>
      <ContactSection />
    </main>
  )
}
