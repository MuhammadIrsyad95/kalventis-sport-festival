'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import ImageUploader from '@/components/upload/ImageUploader';
import Modal from '@/components/Modal';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal';
import ModalActionButtons from '@/components/modals/ModalActionButtons';
import { Sport } from '@/types/database.types';
import { deleteOldImage } from '@/lib/storage';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function BaganSportsPage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [filteredSports, setFilteredSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState<Sport | undefined>();
  const [isDeleteImageModalOpen, setIsDeleteImageModalOpen] = useState(false);
  const [sportToDeleteImage, setSportToDeleteImage] = useState<Sport | null>(null);
  const [baganUrl, setBaganUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');

  useEffect(() => {
    fetchSports();
  }, []);

  useEffect(() => {
    filterSports();
  }, [searchTerm, selectedFilter, sports]);

  const fetchSports = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('sports').select('*').order('name');
    if (!error && data) {
      setSports(data);
      setFilteredSports(data);
    }
    setLoading(false);
  };

  const filterSports = () => {
    let result = [...sports];
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(lower));
    }
    if (selectedFilter) {
      result = result.filter((s) => s.name === selectedFilter);
    }
    setFilteredSports(result);
  };

  const openEditModal = (sport: Sport) => {
    setSelectedSport(sport);
    setBaganUrl(sport.bagan_url || '');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedSport) return;
    if (!baganUrl) {
      alert('Upload gambar bagan dulu');
      return;
    }
    setUploading(true);
    try {
      const { error } = await supabase
        .from('sports')
        .update({ bagan_url: baganUrl })
        .eq('id', selectedSport.id);
      if (error) throw error;
      await fetchSports();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating bagan_url olahraga:', error);
    }
    setUploading(false);
  };

  const confirmDeleteImage = async () => {
    if (!sportToDeleteImage) return;
    try {
      if (sportToDeleteImage.bagan_url) {
        await deleteOldImage(sportToDeleteImage.bagan_url);
        await supabase
          .from('sports')
          .update({ bagan_url: null })
          .eq('id', sportToDeleteImage.id);
        await fetchSports();
      }
      setIsDeleteImageModalOpen(false);
    } catch (error) {
      console.error('Error menghapus gambar bagan olahraga:', error);
    }
  };

  const sportNames = Array.from(new Set(sports.map((s) => s.name))).sort();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Upload Bagan Disini</h1>

      {/* Search & Filter Bar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="px-3 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Olahraga</option>
          {sportNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setSearchTerm('');
            setSelectedFilter('');
          }}
          className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500 transition text-white"
        >
          Reset
        </button>

        <input
          type="text"
          placeholder="Cari olahraga..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ml-auto px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="animate-pulse h-96 bg-gray-700 rounded" />
      ) : (
        <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Bagan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nama Olahraga</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredSports.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-400">
                    Tidak ada olahraga yang cocok.
                  </td>
                </tr>
              ) : (
                filteredSports.map((sport) => (
                  <tr key={sport.id} className="hover:bg-gray-700">
                    <td className="px-4 py-4 whitespace-nowrap">
                      {sport.bagan_url ? (
                        <img
                          src={sport.bagan_url}
                          alt={`Bagan ${sport.name}`}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ) : (
                        <span className="text-gray-500 italic">Belum ada bagan</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{sport.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => openEditModal(sport)}
                        className={`p-1 rounded hover:bg-gray-700 transition ${
                          sport.bagan_url ? 'text-blue-400 hover:text-blue-300' : 'text-green-400 hover:text-green-300'
                        }`}
                        aria-label={`${sport.bagan_url ? 'Edit' : 'Tambah'} bagan olahraga ${sport.name}`}
                      >
                        {sport.bagan_url ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                      </button>

                      {sport.bagan_url && (
                        <button
                          onClick={() => {
                            setSportToDeleteImage(sport);
                            setIsDeleteImageModalOpen(true);
                          }}
                          className="ml-2 p-1 rounded text-red-400 hover:bg-gray-700 hover:text-red-300 transition"
                          aria-label={`Hapus gambar bagan olahraga ${sport.name}`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selectedSport && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${baganUrl ? 'Edit' : 'Tambah'} Bagan Olahraga: ${selectedSport.name}`}
        >
          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium text-gray-100">Upload Bagan (gambar)</label>
              <ImageUploader
                currentUrl={baganUrl}
                onUpload={setBaganUrl}
                folder="bagan"
                maxSizeMB={2}
              />
            </div>

            <ModalActionButtons
              onCancel={() => setIsModalOpen(false)}
              onSave={handleSave}
              saving={uploading}
              cancelText="Cancel"
              saveText="Simpan Perubahan"
              disabled={false}
            />
          </div>
        </Modal>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteImageModalOpen}
        onClose={() => setIsDeleteImageModalOpen(false)}
        onConfirm={confirmDeleteImage}
        title="Konfirmasi Hapus Gambar Bagan Olahraga"
        message={`Apakah Anda yakin ingin menghapus gambar bagan untuk "${sportToDeleteImage?.name}"?`}
      />
    </div>
  );
}
