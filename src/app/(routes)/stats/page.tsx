'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Trophy } from 'lucide-react'
import { supabase, type Team } from '@/lib/supabase'

export default function StatsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchTeams()
  }, [])

  async function fetchTeams() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) throw error
      setTeams(data || [])
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Team Statistics
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search teams..."
                className="bg-transparent text-gray-300 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-40 bg-white/5 rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : filteredTeams.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">No teams found</p>
            </div>
          ) : (
            filteredTeams.map((team) => (
              <motion.div
                key={team.id}
                className="card overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-16 h-16 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${team.logo_url})` }}
                    />
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {team.name}
                      </h2>
                      {/* <p className="text-gray-400">
                        {team.country_code}
                      </p> */}
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/5 rounded-lg p-3">
                      <Trophy className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                      <span className="text-2xl font-bold text-white">12</span>
                      <p className="text-xs text-gray-400">Trophies</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <span className="text-2xl font-bold text-white">76%</span>
                      <p className="text-xs text-gray-400">Win Rate</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <span className="text-2xl font-bold text-white">24</span>
                      <p className="text-xs text-gray-400">Players</p>
                    </div>
                  </div>
                  <button className="w-full mt-6 py-2 bg-white/5 hover:bg-white/10 transition-colors rounded-lg text-gray-300">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 