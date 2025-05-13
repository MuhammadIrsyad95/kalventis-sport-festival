'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Sport, Rule } from '@/types/database.types'

export default function RulesAdminPage() {
  const [sports, setSports] = useState<Sport[]>([])
  const [rules, setRules] = useState<Rule[]>([])
  const [selectedSport, setSelectedSport] = useState<string>('')
  const [newRule, setNewRule] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingRule, setEditingRule] = useState<Rule | null>(null)

  useEffect(() => {
    fetchSports()
    fetchRules()
  }, [])

  async function fetchSports() {
    const { data, error } = await supabase.from('sports').select('*')
    if (error) {
      console.error('Error fetching sports:', error)
      return
    }
    setSports(data || [])
  }

  async function fetchRules() {
    const { data, error } = await supabase.from('rules').select('*')
    if (error) {
      console.error('Error fetching rules:', error)
      return
    }
    setRules(data || [])
  }

  async function handleAddRule(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSport || !newRule.trim()) {
      setError('Please select a sport and enter a rule')
      return
    }

    setLoading(true)
    setError(null)

    if (editingRule) {
      // Update existing rule
      const { error } = await supabase
        .from('rules')
        .update({
          sport_id: selectedSport,
          description: newRule.trim()
        })
        .eq('id', editingRule.id)

      if (error) {
        setError(error.message)
      } else {
        setNewRule('')
        setEditingRule(null)
        fetchRules()
      }
    } else {
      // Add new rule
      const { error } = await supabase.from('rules').insert({
        sport_id: selectedSport,
        description: newRule.trim()
      })

      if (error) {
        setError(error.message)
      } else {
        setNewRule('')
        fetchRules()
      }
    }

    setLoading(false)
  }

  async function handleDeleteRule(ruleId: string) {
    if (!confirm('Are you sure you want to delete this rule?')) return

    setLoading(true)
    const { error } = await supabase.from('rules').delete().eq('id', ruleId)

    if (error) {
      setError(error.message)
    } else {
      fetchRules()
    }
    setLoading(false)
  }

  function handleEditRule(rule: Rule) {
    setEditingRule(rule)
    setSelectedSport(rule.sport_id)
    setNewRule(rule.description)
  }

  function handleCancelEdit() {
    setEditingRule(null)
    setNewRule('')
    setSelectedSport('')
  }

  const filteredRules = selectedSport
    ? rules.filter(rule => rule.sport_id === selectedSport)
    : rules

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Manage Sport Rules</h1>

      {/* Add/Edit Rule Form */}
      <form onSubmit={handleAddRule} className="mb-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Sport
            </label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              required
            >
              <option value="">Select a sport...</option>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Rule Description
            </label>
            <textarea
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              rows={3}
              required
              placeholder="Enter rule description..."
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 text-red-400 text-sm">{error}</div>
        )}

        <div className="mt-4 flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : editingRule ? 'Update Rule' : 'Add Rule'}
          </button>

          {editingRule && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Rules List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {selectedSport
            ? `Rules for ${sports.find(s => s.id === selectedSport)?.name}`
            : 'All Rules'}
        </h2>

        <div className="space-y-4">
          {filteredRules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-4 flex justify-between items-start"
            >
              <div>
                <h3 className="font-medium mb-1">
                  {sports.find(s => s.id === rule.sport_id)?.name}
                </h3>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {rule.description}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditRule(rule)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredRules.length === 0 && (
            <p className="text-gray-400">No rules found.</p>
          )}
        </div>
      </div>
    </div>
  )
} 