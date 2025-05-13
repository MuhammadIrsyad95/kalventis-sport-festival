'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Sport, Team, Match } from '@/types/database.types'
import { PlusCircle, Edit, Trash2 } from 'lucide-react'
import Modal from '@/components/Modal'
import MatchForm from '@/components/forms/MatchForm'
import TeamForm from '@/components/forms/TeamForm'
import SportForm from '@/components/forms/SportForm'
import { useRouter } from 'next/navigation'

type FormMode = 'create' | 'edit'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'matches' | 'medals' | 'sports' | 'teams'>('matches')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>('create')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [sports, setSports] = useState<Sport[]>([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    switch (activeTab) {
      case 'matches':
        const { data: matchesData } = await supabase.from('matches').select('*')
        if (matchesData) setMatches(matchesData)
        break
      case 'teams':
        const { data: teamsData } = await supabase.from('teams').select('*')
        if (teamsData) setTeams(teamsData)
        break
      case 'sports':
        const { data: sportsData } = await supabase.from('sports').select('*')
        if (sportsData) setSports(sportsData)
        break
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Error logging in:', error)
      alert('Login failed. Please check your credentials.')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-white/10 p-8 rounded-lg backdrop-blur-lg w-96">
          <h1 className="text-2xl font-bold text-white mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded bg-white/5 border border-white/20 text-white"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded bg-white/5 border border-white/20 text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              setIsAuthenticated(false)
            }}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-white/10 rounded-lg backdrop-blur-lg p-6">
          <div className="flex space-x-4 mb-6">
            {(['matches', 'medals', 'sports', 'teams'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-white/80 hover:bg-white/10'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Content area */}
          <div className="mt-6">
            {activeTab === 'matches' && <MatchesManager />}
            {activeTab === 'medals' && <MedalsManager />}
            {activeTab === 'sports' && <SportsManager />}
            {activeTab === 'teams' && <TeamsManager />}
          </div>
        </div>
      </div>
    </div>
  )
}

function MatchesManager() {
  const [activeTab, setActiveTab] = useState<'matches' | 'teams' | 'sports'>('matches')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>('create')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [sports, setSports] = useState<Sport[]>([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    switch (activeTab) {
      case 'matches':
        const { data: matchesData } = await supabase.from('matches').select('*')
        if (matchesData) setMatches(matchesData)
        break
      case 'teams':
        const { data: teamsData } = await supabase.from('teams').select('*')
        if (teamsData) setTeams(teamsData)
        break
      case 'sports':
        const { data: sportsData } = await supabase.from('sports').select('*')
        if (sportsData) setSports(sportsData)
        break
    }
  }

  const handleAdd = () => {
    setFormMode('create')
    setSelectedItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item: any) => {
    setFormMode('edit')
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = (item: any) => {
    setItemToDelete(item)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    const table = activeTab
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', itemToDelete.id)

    if (!error) {
      await fetchData()
      setIsDeleteModalOpen(false)
      setItemToDelete(null)
    }
  }

  const handleSubmit = async (data: Partial<Match | Team | Sport>) => {
    const table = activeTab
    
    if (formMode === 'create') {
      await supabase.from(table).insert([data])
    } else {
      await supabase
        .from(table)
        .update(data)
        .eq('id', selectedItem.id)
    }

    await fetchData()
    setIsModalOpen(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('matches')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'matches'
              ? 'bg-blue-600 text-white'
              : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          Matches
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'teams'
              ? 'bg-blue-600 text-white'
              : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          Teams
        </button>
        <button
          onClick={() => setActiveTab('sports')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'sports'
              ? 'bg-blue-600 text-white'
              : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          Sports
        </button>
      </div>

      {/* Content */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          <button
            onClick={handleAdd}
            className="btn btn-primary flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4">ID</th>
                {activeTab === 'matches' && (
                  <>
                    <th className="text-left py-3 px-4">Teams</th>
                    <th className="text-left py-3 px-4">Sport</th>
                    <th className="text-left py-3 px-4">Round</th>
                  </>
                )}
                {activeTab === 'teams' && (
                  <>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Company</th>
                  </>
                )}
                {activeTab === 'sports' && (
                  <>
                    <th className="text-left py-3 px-4">Name</th>
                  </>
                )}
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'matches' &&
                matches.map((match) => (
                  <tr key={match.id} className="border-b border-white/5">
                    <td className="py-3 px-4 text-gray-400">{match.id}</td>
                    <td className="py-3 px-4">
                      {match.team1_id} vs {match.team2_id}
                    </td>
                    <td className="py-3 px-4">{match.sport_id}</td>
                    <td className="py-3 px-4">{match.round}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(match)}
                          className="p-2 hover:bg-white/10 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(match)}
                          className="p-2 hover:bg-white/10 rounded-lg text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {activeTab === 'teams' &&
                teams.map((team) => (
                  <tr key={team.id} className="border-b border-white/5">
                    <td className="py-3 px-4 text-gray-400">{team.id}</td>
                    <td className="py-3 px-4">{team.name}</td>
                    <td className="py-3 px-4">{team.company}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(team)}
                          className="p-2 hover:bg-white/10 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(team)}
                          className="p-2 hover:bg-white/10 rounded-lg text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {activeTab === 'sports' &&
                sports.map((sport) => (
                  <tr key={sport.id} className="border-b border-white/5">
                    <td className="py-3 px-4 text-gray-400">{sport.id}</td>
                    <td className="py-3 px-4">{sport.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(sport)}
                          className="p-2 hover:bg-white/10 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sport)}
                          className="p-2 hover:bg-white/10 rounded-lg text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${formMode === 'create' ? 'Add' : 'Edit'} ${activeTab.slice(0, -1)}`}
      >
        {activeTab === 'matches' && (
          <MatchForm
            match={selectedItem}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
        {activeTab === 'teams' && (
          <TeamForm
            team={selectedItem}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
        {activeTab === 'sports' && (
          <SportForm
            sport={selectedItem}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function MedalsManager() {
  return <div className="text-white">Medals management interface coming soon...</div>
}

function SportsManager() {
  return <div className="text-white">Sports management interface coming soon...</div>
}

function TeamsManager() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>('create')
  const [selectedItem, setSelectedItem] = useState<Team | undefined>(undefined)
  const [teams, setTeams] = useState<Team[]>([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<Team | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data, error } = await supabase.from('teams').select('*')
    if (error) {
      console.error('Error fetching teams:', error)
      return
    }
    setTeams(data || [])
  }

  const handleAdd = () => {
    setFormMode('create')
    setSelectedItem(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (team: Team) => {
    setFormMode('edit')
    setSelectedItem(team)
    setIsModalOpen(true)
  }

  const handleDelete = (team: Team) => {
    setItemToDelete(team)
    setIsDeleteModalOpen(true)
  }

  const handleSubmit = async (data: Partial<Team>) => {
    try {
      if (formMode === 'create') {
        const { id, ...createData } = data
        const { error } = await supabase.from('teams').insert(createData)
        if (error) throw error
      } else if (data.id) {
        const { id, ...updateData } = data
        const { error } = await supabase
          .from('teams')
          .update(updateData)
          .eq('id', id)
        if (error) throw error
      }
      
      await fetchData()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving team:', error)
      alert('Error saving team. Please try again.')
    }
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', itemToDelete.id)
      
      if (error) throw error
      
      setIsDeleteModalOpen(false)
      fetchData()
    } catch (error) {
      console.error('Error deleting team:', error)
      alert('Error deleting team. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Teams</h2>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Team</span>
        </button>
      </div>

      <div className="bg-white/5 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4">ID</th>
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Company</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id} className="border-b border-white/5">
                <td className="py-3 px-4 text-gray-400">{team.id}</td>
                <td className="py-3 px-4">{team.name}</td>
                <td className="py-3 px-4">{team.company}</td>
                <td className="py-3 px-4">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(team)}
                      className="p-2 hover:bg-white/10 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(team)}
                      className="p-2 hover:bg-white/10 rounded-lg text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${formMode === 'create' ? 'Add' : 'Edit'} Team`}
      >
        <TeamForm
          team={selectedItem}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this team? This action cannot be undone.</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
} 