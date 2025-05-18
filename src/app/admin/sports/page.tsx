'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import Modal from '@/components/Modal';
import SportForm from '@/components/forms/SportForm';

interface Sport {
  id: string;
  name: string;
  created_at: string;
  imageurl?: string;
}

type FormMode = 'create' | 'edit';

export default function SportsPage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [selectedSport, setSelectedSport] = useState<Sport | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sportToDelete, setSportToDelete] = useState<Sport | null>(null);

  useEffect(() => {
    fetchSports();
  }, []);

  async function fetchSports() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sports')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      setSports(data || []);
    } catch (error) {
      console.error('Error fetching sports:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = () => {
    setFormMode('create');
    setSelectedSport(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (sport: Sport) => {
    setFormMode('edit');
    setSelectedSport(sport);
    setIsModalOpen(true);
  };

  const handleDelete = (sport: Sport) => {
    setSportToDelete(sport);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!sportToDelete) return;

    try {
      const { error } = await supabase
        .from('sports')
        .delete()
        .eq('id', sportToDelete.id);
      
      if (error) throw error;
      
      fetchSports();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting sport:', error);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (formMode === 'create') {
        const { error } = await supabase.from('sports').insert([data]);
        if (error) throw error;
      } else if (selectedSport) {
        const { error } = await supabase
          .from('sports')
          .update(data)
          .eq('id', selectedSport.id);
        if (error) throw error;
      }
      
      fetchSports();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving sport:', error);
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
        <h1 className="text-2xl font-bold text-white">Sports Management</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Sport
        </button>
      </div>

      <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {sports.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-400">
                  No sports available. Add your first sport.
                </td>
              </tr>
            ) : (
              sports.map((sport) => (
                <tr key={sport.id} className="hover:bg-gray-700">
                  <td className="px-4 py-4 whitespace-nowrap">
                    {sport.imageurl ? (
                      <img src={sport.imageurl} alt={sport.name} className="w-10 h-10 object-cover rounded border" />
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{sport.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(sport)}
                      className="text-blue-400 hover:text-blue-300 mr-4"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sport)}
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
          title={`${formMode === 'create' ? 'Add' : 'Edit'} Sport`}
        >
          <SportForm
            sport={selectedSport}
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
              Are you sure you want to delete this sport? This action cannot be undone.
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