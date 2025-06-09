// src/app/admin/teams/page.tsx
'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useTeams } from './useTeams';
import Modal from '@/components/Modal';
import TeamForm from '@/components/forms/TeamForm';
import TeamTable from './TeamTable';
import DeleteConfirmModal from './DeleteConfirmModal';
import { Team } from '@/types/database.types';
import { supabase } from '@/lib/supabase';

export default function TeamsPage() {
  const { teams, setTeams, loading } = useTeams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedTeam, setSelectedTeam] = useState<Team | undefined>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);

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
    const { error } = await supabase.from('teams').delete().eq('id', teamToDelete.id);
    if (!error) {
      setTeams(teams.filter(t => t.id !== teamToDelete.id));
      setIsDeleteModalOpen(false);
    }
  };

  const handleSubmit = async (data: Partial<Team>) => {
    try {
      if (formMode === 'create') {
        const { data: newData, error } = await supabase.from('teams').insert({ name: data.name, company: data.company }).select();
        if (!error && newData?.length) setTeams([...teams, newData[0]]);
      } else if (selectedTeam) {
        const { data: updatedData, error } = await supabase
          .from('teams')
          .update({ name: data.name, company: data.company })
          .eq('id', selectedTeam.id)
          .select();
        if (!error && updatedData?.length) {
          setTeams(teams.map(t => t.id === selectedTeam.id ? updatedData[0] : t));
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error saving team:', err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Manajemen Grup</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambahkan Grup
        </button>
      </div>

      <TeamTable teams={teams} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${formMode === 'create' ? 'Add' : 'Edit'} Team`}>
          <TeamForm team={selectedTeam} onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
