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
  team1_score?: number;
  team2_score?: number;
  match_time?: string;
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
        setError(`Gagal mengambil data pertandingan: ${error.message}`);
        throw error;
      }

      setMatches(data || []);
    } catch (error: any) {
      setError(`Gagal mengambil data pertandingan: ${error.message || 'Kesalahan tidak diketahui'}`);
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

      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchToDelete.id);

      if (error) {
        setError(`Gagal menghapus pertandingan: ${error.message}`);
        throw error;
      }

      fetchMatches();
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      setError(`Gagal menghapus pertandingan: ${error.message || 'Kesalahan tidak diketahui'}`);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      setError(null);

      if (!data.team1_id || !data.team2_id || !data.sport_id || !data.round) {
        const missingFields = [];
        if (!data.team1_id) missingFields.push('Tim 1');
        if (!data.team2_id) missingFields.push('Tim 2');
        if (!data.sport_id) missingFields.push('Olahraga');
        if (!data.round) missingFields.push('Babak');

        const errorMsg = `Kolom wajib belum diisi: ${missingFields.join(', ')}`;
        setError(errorMsg);
        return;
      }

      if (formMode === 'create') {
        const { error } = await supabase
          .from('matches')
          .insert([data])
          .select();

        if (error) {
          setError(`Gagal menambahkan pertandingan: ${error.message}`);
          throw error;
        }
      } else if (selectedMatch) {
        const { error } = await supabase
          .from('matches')
          .update(data)
          .eq('id', selectedMatch.id)
          .select();

        if (error) {
          setError(`Gagal memperbarui pertandingan: ${error.message}`);
          throw error;
        }
      }

      fetchMatches();
      setIsModalOpen(false);
    } catch (error: any) {
      setError(`Gagal menyimpan pertandingan: ${error.message || JSON.stringify(error)}`);
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
        <h1 className="text-2xl font-bold text-white">Manajemen Pertandingan</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Pertandingan
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tim</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Olahraga</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Babak</th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Skor</th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Waktu</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {matches.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-400">
                  Belum ada pertandingan. Tambahkan pertandingan pertama Anda.
                </td>
              </tr>
            ) : (
              matches.map((match) => (
                <tr key={match.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      {match.team1?.name || 'Tim 1'} vs {match.team2?.name || 'Tim 2'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/50 text-blue-300">
                      {match.sport?.name || 'Olahraga'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {match.round}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center text-sm text-white font-bold">
                    {typeof match.team1_score === 'number' && typeof match.team2_score === 'number'
                      ? `${match.team1_score} : ${match.team2_score}`
                      : '-'}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center text-sm text-gray-300">
                    {match.match_time ? new Date(match.match_time).toLocaleString('id-ID') : '-'}
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
          title={`${formMode === 'create' ? 'Tambah' : 'Edit'} Pertandingan`}
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
          title="Konfirmasi Hapus"
        >
          <div className="mt-2">
            <p className="text-sm text-gray-400">
              Apakah Anda yakin ingin menghapus pertandingan ini? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Batal
            </button>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              onClick={confirmDelete}
            >
              Hapus
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}
