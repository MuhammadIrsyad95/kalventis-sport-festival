'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import SportForm from '@/components/forms/SportForm';
import SportTable from '@/components/table/SportTable';
import Modal from '@/components/Modal';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal';
import { PlusCircle } from 'lucide-react';
import { deleteOldImage } from '@/lib/storage';
import { Sport } from '@/types/database.types';

type FormMode = 'create' | 'edit';

const kategoriOptions = [
  { label: 'Semua', value: 'semua' },
  { label: 'Sport', value: 'sport' },
  { label: 'Esport', value: 'esport' },
  { label: 'Fun Games', value: 'fungames' },
];

export default function SportsPage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [selectedSport, setSelectedSport] = useState<Sport | undefined>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sportToDelete, setSportToDelete] = useState<Sport | null>(null);
  const [kategoriFilter, setKategoriFilter] = useState<string>('semua');

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    const { data, error } = await supabase.from('sports').select('*').order('name');
    if (!error && data) setSports(data);
    setLoading(false);
  };

  const handleSubmit = async (data: Partial<Sport>) => {
    try {
      if (formMode === 'create') {
        const { error } = await supabase.from('sports').insert([data]);
        if (error) throw error;
      } else if (selectedSport) {
        const { error } = await supabase.from('sports').update(data).eq('id', selectedSport.id);
        if (error) throw error;
      }

      fetchSports();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving sport:', error);
    }
  };

  const confirmDelete = async () => {
    if (!sportToDelete) return;

    try {
      if (sportToDelete.imageurl) await deleteOldImage(sportToDelete.imageurl);
      await supabase.from('sports').delete().eq('id', sportToDelete.id);
      fetchSports();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting sport:', error);
    }
  };

  const filteredSports = kategoriFilter === 'semua'
    ? sports
    : sports.filter((s) => s.kategori === kategoriFilter);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Manajemen Olahraga</h1>
        <button
          onClick={() => {
            setFormMode('create');
            setSelectedSport(undefined);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambahkan Olahraga
        </button>
      </div>

      {/* Kategori Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {kategoriOptions.map((item) => (
          <button
            key={item.value}
            onClick={() => setKategoriFilter(item.value)}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              kategoriFilter === item.value
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="animate-pulse h-96 bg-gray-700 rounded" />
      ) : (
        <SportTable
          sports={filteredSports}
          onEdit={(sport) => {
            setFormMode('edit');
            setSelectedSport(sport);
            setIsModalOpen(true);
          }}
          onDelete={(sport) => {
            setSportToDelete(sport);
            setIsDeleteModalOpen(true);
          }}
        />
      )}

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

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
