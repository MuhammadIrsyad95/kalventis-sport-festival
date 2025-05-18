'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import Modal from '@/components/Modal';
import MatchForm from '@/components/forms/MatchForm';

interface Match {
  id: string;
  team1_id: string;
  team2_id: string;
  sport_id: string;
  winner_id?: string | null;
  round: string;
  team1?: any;
  team2?: any;
  sport?: any;
}

type FormMode = 'create' | 'edit';

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [selectedMatch, setSelectedMatch] = useState<Match | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState<Match | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching matches...');
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          sport:sports(*),
          team1:teams!matches_team1_id_fkey(*),
          team2:teams!matches_team2_id_fkey(*)
        `)
        .order('round', { ascending: true });
      
      if (error) {
        console.error('Error fetching matches:', error);
        setError(`Error fetching matches: ${error.message}`);
        throw error;
      }
      
      console.log('Matches fetched:', data);
      setMatches(data || []);
    } catch (error: any) {
      console.error('Error fetching matches:', error);
      setError(`Error fetching matches: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = () => {
    setError(null);
    setFormMode('create');
    setSelectedMatch(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (match: Match) => {
    setError(null);
    setFormMode('edit');
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const handleDelete = (match: Match) => {
    setError(null);
    setMatchToDelete(match);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!matchToDelete) return;

    try {
      setError(null);
      console.log('Deleting match:', matchToDelete.id);
      
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchToDelete.id);
      
      if (error) {
        console.error('Error deleting match:', error);
        setError(`Error deleting match: ${error.message}`);
        throw error;
      }
      
      console.log('Match deleted successfully');
      fetchMatches();
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      console.error('Error deleting match:', error);
      setError(`Error deleting match: ${error.message || 'Unknown error'}`);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      setError(null);
      console.log('Submitting match data:', data);
      
      // Make sure all required fields are present
      if (!data.team1_id || !data.team2_id || !data.sport_id || !data.round) {
        const missingFields = [];
        if (!data.team1_id) missingFields.push('Team 1');
        if (!data.team2_id) missingFields.push('Team 2');
        if (!data.sport_id) missingFields.push('Sport');
        if (!data.round) missingFields.push('Round');
        
        const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
        console.error(errorMsg);
        setError(errorMsg);
        return;
      }
      
      if (formMode === 'create') {
        const { data: result, error } = await supabase
          .from('matches')
          .insert([data])
          .select();
          
        if (error) {
          console.error('Error inserting match:', error);
          setError(`Error creating match: ${error.message}`);
          throw error;
        }
        
        console.log('Match created successfully:', result);
      } else if (selectedMatch) {
        const { data: result, error } = await supabase
          .from('matches')
          .update(data)
          .eq('id', selectedMatch.id)
          .select();
          
        if (error) {
          console.error('Error updating match:', error);
          setError(`Error updating match: ${error.message}`);
          throw error;
        }
        
        console.log('Match updated successfully:', result);
      }
      
      fetchMatches();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error saving match:', error);
      setError(`Error saving match: ${error.message || JSON.stringify(error)}`);
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
    <main className="px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Matches Management</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Match
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded text-red-400">
          {error}
        </div>
      )}

      <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Teams</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Sport</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Round</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {matches.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-400">
                  No matches available. Add your first match.
                </td>
              </tr>
            ) : (
              matches.map((match) => (
                <tr key={match.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      {match.team1?.name || 'Team 1'} vs {match.team2?.name || 'Team 2'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/50 text-blue-300">
                      {match.sport?.name || 'Sport'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {match.round}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(match)}
                      className="text-blue-400 hover:text-blue-300 mr-4"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(match)}
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
          title={`${formMode === 'create' ? 'Add' : 'Edit'} Match`}
        >
          <MatchForm
            match={selectedMatch}
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
              Are you sure you want to delete this match? This action cannot be undone.
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
    </main>
  );
} 