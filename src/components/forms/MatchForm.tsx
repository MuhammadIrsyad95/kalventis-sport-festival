'use client'

import { useState, useEffect } from 'react'
import { Match, Team, Sport } from '@/types/database.types'
import { supabase } from '@/lib/supabase'

interface MatchFormProps {
  match?: Match
  onSubmit: (data: Partial<Match>) => void
  onCancel: () => void
}

export default function MatchForm({ match, onSubmit, onCancel }: MatchFormProps) {
  const [teams, setTeams] = useState<Team[]>([])
  const [sports, setSports] = useState<Sport[]>([])
  const [formData, setFormData] = useState<Partial<Match>>({
    team1_id: match?.team1_id || '',
    team2_id: match?.team2_id || '',
    sport_id: match?.sport_id || '',
    round: match?.round || '',
    score1: match?.score1 || 0,
    score2: match?.score2 || 0,
    status: match?.status || 'upcoming',
    start_time: match?.start_time || new Date().toISOString(),
  })

  useEffect(() => {
    fetchTeamsAndSports()
  }, [])

  const fetchTeamsAndSports = async () => {
    const { data: teamsData } = await supabase.from('teams').select('*')
    const { data: sportsData } = await supabase.from('sports').select('*')
    if (teamsData) setTeams(teamsData)
    if (sportsData) setSports(sportsData)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Sport</label>
        <select
          value={formData.sport_id}
          onChange={(e) => setFormData({ ...formData, sport_id: e.target.value })}
          className="w-full p-2 rounded-lg bg-white/5"
          required
        >
          <option value="">Select Sport</option>
          {sports.map((sport) => (
            <option key={sport.id} value={sport.id}>
              {sport.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2">Team 1</label>
        <select
          value={formData.team1_id}
          onChange={(e) => setFormData({ ...formData, team1_id: e.target.value })}
          className="w-full p-2 rounded-lg bg-white/5"
          required
        >
          <option value="">Select Team 1</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2">Team 2</label>
        <select
          value={formData.team2_id}
          onChange={(e) => setFormData({ ...formData, team2_id: e.target.value })}
          className="w-full p-2 rounded-lg bg-white/5"
          required
        >
          <option value="">Select Team 2</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2">Round</label>
        <input
          type="text"
          value={formData.round}
          onChange={(e) => setFormData({ ...formData, round: e.target.value })}
          className="w-full p-2 rounded-lg bg-white/5"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Score 1</label>
        <input
          type="number"
          value={formData.score1}
          onChange={(e) => setFormData({ ...formData, score1: parseInt(e.target.value) })}
          className="w-full p-2 rounded-lg bg-white/5"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Score 2</label>
        <input
          type="number"
          value={formData.score2}
          onChange={(e) => setFormData({ ...formData, score2: parseInt(e.target.value) })}
          className="w-full p-2 rounded-lg bg-white/5"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as Match['status'] })}
          className="w-full p-2 rounded-lg bg-white/5"
          required
        >
          <option value="upcoming">Upcoming</option>
          <option value="live">Live</option>
          <option value="finished">Finished</option>
        </select>
      </div>

      <div>
        <label className="block mb-2">Start Time</label>
        <input
          type="datetime-local"
          value={formData.start_time?.slice(0, 16)}
          onChange={(e) => setFormData({ ...formData, start_time: new Date(e.target.value).toISOString() })}
          className="w-full p-2 rounded-lg bg-white/5"
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
        >
          {match ? 'Update' : 'Create'} Match
        </button>
      </div>
    </form>
  )
} 