'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { PlusCircle, Edit, Trash2, Book } from 'lucide-react'
import Modal from '@/components/Modal'

interface Rule {
  id: string
  sport_id: string
  content: string
  sport?: any
}

type FormMode = 'create' | 'edit'

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([])
  const [sports, setSports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>('create')
  const [selectedRule, setSelectedRule] = useState<Rule | undefined>(undefined)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [ruleToDelete, setRuleToDelete] = useState<Rule | null>(null)

  useEffect(() => {
    fetchRules()
    fetchSports()
  }, [])

  async function fetchRules() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('rules')
        .select(`
          *,
          sport:sports(*)
        `)
        .order('id')

      if (error) throw error
      setRules(data || [])
    } catch (error) {
      console.error('Error fetching rules:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchSports() {
    try {
      const { data, error } = await supabase
        .from('sports')
        .select('*')
        .order('name')

      if (error) throw error
      setSports(data || [])
    } catch (error) {
      console.error('Error fetching sports:', error)
    }
  }

  const handleAdd = () => {
    setFormMode('create')
    setSelectedRule(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (rule: Rule) => {
    setFormMode('edit')
    setSelectedRule(rule)
    setIsModalOpen(true)
  }

  const handleDelete = (rule: Rule) => {
    setRuleToDelete(rule)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!ruleToDelete) return

    try {
      const { error } = await supabase
        .from('rules')
        .delete()
        .eq('id', ruleToDelete.id)

      if (error) throw error
      fetchRules()
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error('Error deleting rule:', error)
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      if (formMode === 'create') {
        const { error } = await supabase.from('rules').insert([data])
        if (error) throw error
      } else if (selectedRule) {
        const { error } = await supabase
          .from('rules')
          .update(data)
          .eq('id', selectedRule.id)
        if (error) throw error
      }

      fetchRules()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving rule:', error)
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen p-6 animate-pulse">
        <h2 className="text-2xl font-bold mb-6 h-8 bg-gray-700 rounded w-1/4"></h2>
        <div className="bg-gray-700 h-96 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
        <h1 className="text-2xl font-bold">Manajemen Peraturan</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambahkan Peraturan
        </button>
      </div>

      {/* Rule List */}
      <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
        <div className="divide-y divide-gray-700">
          {rules.length === 0 ? (
            <div className="px-6 py-4 text-center text-sm text-gray-400">
              No rules available. Add your first rule.
            </div>
          ) : (
            rules.map((rule) => (
              <div key={rule.id} className="p-6 hover:bg-gray-700">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <Book className="h-5 w-5 text-yellow-500" />
                    <h3 className="text-lg font-medium">
                      {rule.sport?.name || 'General Rule'}
                    </h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(rule)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(rule)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-300 whitespace-pre-line">
                  {rule.content}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal: Form */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${formMode === 'create' ? 'Add' : 'Edit'} Rule`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const data = {
                sport_id: formData.get('sport_id'),
                content: formData.get('content')
              }
              handleSubmit(data)
            }}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Sport
              </label>
              <select
                name="sport_id"
                defaultValue={selectedRule?.sport_id || ''}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Select a sport</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Content
              </label>
              <textarea
                name="content"
                rows={5}
                defaultValue={selectedRule?.content || ''}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm bg-gray-700 border-gray-600 text-white rounded-md"
                required
              ></textarea>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
              >
                {formMode === 'create' ? 'Add' : 'Save'}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Delete Confirm */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Delete"
        >
          <div className="mt-2">
            <p className="text-sm text-gray-400">
              Are you sure you want to delete this rule? This action cannot be undone.
            </p>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
