'use client'

import { useState, useEffect } from 'react'
import { Match, Team, Sport } from '@/types/database.types'
import { supabase } from '@/lib/supabase/client'

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
    winner_id: match?.winner_id || null,
    team1_score: match?.team1_score ?? 0,
    team2_score: match?.team2_score ?? 0,
    match_time: match?.match_time || '',
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
    // Log the form data untuk debugging
    console.log('Submitting match data:', formData);
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Sport</label>
          <select
            value={formData.sport_id}
            onChange={(e) => setFormData({ ...formData, sport_id: e.target.value })}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-blue-500 focus:border-blue-500"
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
          <label className="block text-sm font-medium text-gray-300 mb-1">Round</label>
          <input
            type="text"
            value={formData.round}
            onChange={(e) => setFormData({ ...formData, round: e.target.value })}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Team 1</label>
          <select
            value={formData.team1_id}
            onChange={(e) => setFormData({ ...formData, team1_id: e.target.value })}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-blue-500 focus:border-blue-500"
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
          <label className="block text-sm font-medium text-gray-300 mb-1">Team 2</label>
          <select
            value={formData.team2_id}
            onChange={(e) => setFormData({ ...formData, team2_id: e.target.value })}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-blue-500 focus:border-blue-500"
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
          <label className="block text-sm font-medium text-gray-300 mb-1">Team 1 Score</label>
          <input
            type="number"
            value={formData.team1_score ?? ''}
            onChange={e => setFormData({ ...formData, team1_score: e.target.value === '' ? undefined : Number(e.target.value) })}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-blue-500 focus:border-blue-500"
            min={0}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Team 2 Score</label>
          <input
            type="number"
            value={formData.team2_score ?? ''}
            onChange={e => setFormData({ ...formData, team2_score: e.target.value === '' ? undefined : Number(e.target.value) })}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-blue-500 focus:border-blue-500"
            min={0}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Match Time</label>
          <input
            type="datetime-local"
            value={formData.match_time ? formData.match_time.slice(0, 16) : ''}
            onChange={e => setFormData({ ...formData, match_time: e.target.value })}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Winner (Optional)</label>
          <select
            value={formData.winner_id || ''}
            onChange={(e) => setFormData({ ...formData, winner_id: e.target.value || null })}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">No Winner Yet</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {match ? 'Update' : 'Create'} Match
        </button>
      </div>
    </form>
  )
} 