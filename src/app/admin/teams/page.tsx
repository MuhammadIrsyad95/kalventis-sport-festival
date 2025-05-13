'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import Modal from '@/components/Modal';
import TeamForm from '@/components/forms/TeamForm';
import { Team } from '@/types/database.types';

type FormMode = 'create' | 'edit';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [selectedTeam, setSelectedTeam] = useState<Team | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    try {
      setLoading(true);
      console.log('Fetching teams...');
      
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Supabase teams query error:', error);
        throw error;
      }
      
      console.log('Teams data fetched:', data);
      setTeams(data || []);
    } catch (error: any) {
      console.error('Error fetching teams:', error);
      console.error('Error details:', error?.message, error?.code, error?.details);
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = () => {
    setFormMode('create');
    setSelectedTeam(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (team: Team) => {
    setFormMode('edit');
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  const handleDelete = (team: Team) => {
    setTeamToDelete(team);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!teamToDelete) return;

    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamToDelete.id);
      
      if (error) throw error;
      
      fetchTeams();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  const handleSubmit = async (data: Partial<Team>) => {
    try {
      // Log request data untuk debug
      console.log('Submitting team data:', data);
      
      if (formMode === 'create') {
        // Saat membuat data baru, jangan sertakan id atau created_at
        const { id, created_at, ...createData } = data as any;
        
        const { data: result, error } = await supabase
          .from('teams')
          .insert([createData])
          .select();
          
        if (error) {
          console.error('Insert error details:', error);
          throw error;
        }
        console.log('Insert result:', result);
      } else if (selectedTeam) {
        // Saat update, jangan include created_at
        const { created_at, ...updateData } = data as any;
        
        const { data: result, error } = await supabase
          .from('teams')
          .update(updateData)
          .eq('id', selectedTeam.id)
          .select();
          
        if (error) {
          console.error('Update error details:', error);
          throw error;
        }
        console.log('Update result:', result);
      }
      
      fetchTeams();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving team:', error);
      alert('Error saving team: ' + JSON.stringify(error));
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <h2 className="text-2xl font-bold mb-6 h-8 bg-gray-700 rounded w-1/4"></h2>
        <div className="bg-gray-700 h-96 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Teams Management</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Team
        </button>
      </div>

      <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {teams.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-400">
                  No teams available. Add your first team.
                </td>
              </tr>
            ) : (
              teams.map((team) => (
                <tr key={team.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{team.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {team.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(team)}
                      className="text-blue-400 hover:text-blue-300 mr-4"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(team)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${formMode === 'create' ? 'Add' : 'Edit'} Team`}
        >
          <TeamForm
            team={selectedTeam}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Delete"
        >
          <div className="mt-2">
            <p className="text-sm text-gray-400">
              Are you sure you want to delete this team? This action cannot be undone.
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
  );
} 