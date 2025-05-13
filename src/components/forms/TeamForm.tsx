'use client'

import { useState, useEffect } from 'react'
import { Team, Sport } from '@/types/database.types'
import { supabase } from '@/lib/supabase'

interface TeamFormProps {
  team?: Team
  onSubmit: (data: Partial<Team>) => void
  onCancel: () => void
}

export default function TeamForm({ team, onSubmit, onCancel }: TeamFormProps) {
  const [sports, setSports] = useState<Sport[]>([])
  const [formData, setFormData] = useState<Partial<Team>>({
    id: team?.id || undefined,
    name: team?.name || '',
    company: team?.company || '',
    sport_id: team?.sport_id || ''
  })

  useEffect(() => {
    fetchSports()
  }, [])

  useEffect(() => {
    if (team) {
      setFormData({
        id: team.id,
        name: team.name,
        company: team.company,
        sport_id: team.sport_id
      })
    }
  }, [team])

  const fetchSports = async () => {
    const { data } = await supabase.from('sports').select('*')
    if (data) setSports(data)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 rounded-lg bg-white/5"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Company</label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="w-full p-2 rounded-lg bg-white/5"
          required
        />
      </div>

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
          {team ? 'Update' : 'Create'} Team
        </button>
      </div>
    </form>
  )
} 