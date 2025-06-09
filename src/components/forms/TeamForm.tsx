'use client'

import { useState, useEffect } from 'react'
import { Team } from '@/types/database.types'
import { supabase } from '@/lib/supabase/client'

interface TeamFormProps {
  team?: Team
  onSubmit: (data: Partial<Team>) => void
  onCancel: () => void
}

export default function TeamForm({ team, onSubmit, onCancel }: TeamFormProps) {
  const [formData, setFormData] = useState<Partial<Team>>({
    id: team?.id || undefined,
    name: team?.name || '',
    company: team?.company || ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (team) {
      setFormData({
        id: team.id,
        name: team.name,
        company: team.company
      })
    }
  }, [team])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form data to submit:', formData)
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2 text-gray-200 font-medium">Nama Tim</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Enter team name"
          required
        />
      </div>

      <div>
        <label className="block mb-2 text-gray-200 font-medium">Pic (Person In Charge)</label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="w-full p-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Enter company name"
          required
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          {team ? 'Update' : 'Create'} Team
        </button>
      </div>
    </form>
  )
} 