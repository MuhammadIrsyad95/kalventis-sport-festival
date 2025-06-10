'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
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
  const [sports, setSports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [selectedMatch, setSelectedMatch] = useState<Match | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState<Match | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [filterSport, setFilterSport] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchMatches();
    fetchSports();
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

  async function fetchSports() {
    const { data, error } = await supabase.from('sports').select('*');
    if (!error && data) setSports(data);
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
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchToDelete.id);
      if (error) throw error;

      fetchMatches();
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      setError(`Gagal menghapus pertandingan: ${error.message || 'Kesalahan tidak diketahui'}`);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (!data.team1_id || !data.team2_id || !data.sport_id || !data.round) {
        const missingFields = [];
        if (!data.team1_id) missingFields.push('Tim 1');
        if (!data.team2_id) missingFields.push('Tim 2');
        if (!data.sport_id) missingFields.push('Olahraga');
        if (!data.round) missingFields.push('Babak');
        return setError(`Kolom wajib belum diisi: ${missingFields.join(', ')}`);
      }

      if (formMode === 'create') {
        const { error } = await supabase.from('matches').insert([data]);
        if (error) throw error;
      } else if (selectedMatch) {
        const { error } = await supabase
          .from('matches')
          .update(data)
          .eq('id', selectedMatch.id);
        if (error) throw error;
      }

      fetchMatches();
      setIsModalOpen(false);
    } catch (error: any) {
      setError(`Gagal menyimpan pertandingan: ${error.message || JSON.stringify(error)}`);
    }
  };

  const filteredMatches = matches.filter((m) => {
    const sportMatch = filterSport === 'all' || m.sport_id === filterSport;
    const teamMatch =
      m.team1?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.team2?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return sportMatch && (searchTerm.trim() === '' || teamMatch);
  });

  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);
  const paginatedMatches = filteredMatches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Manajemen Pertandingan</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Pertandingan
        </button>
      </div>

      {/* Filter dan Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          className="px-3 py-2 text-sm bg-gray-700 text-white rounded border border-gray-600"
          value={filterSport}
          onChange={(e) => setFilterSport(e.target.value)}
        >
          <option value="all">Semua Olahraga</option>
          {sports.map((sport) => (
            <option key={sport.id} value={sport.id}>
              {sport.name}
            </option>
          ))}
        </select>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Cari tim..."
            className="pl-10 pr-4 py-2 text-sm bg-gray-700 text-white border border-gray-600 rounded w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
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
            {paginatedMatches.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-400">
                  Tidak ada pertandingan ditemukan.
                </td>
              </tr>
            ) : (
              paginatedMatches.map((match) => (
                <tr key={match.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-white text-sm">
                    {match.team1?.name || 'Tim 1'} vs {match.team2?.name || 'Tim 2'}
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-300">
                    {match.sport?.name || 'Olahraga'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{match.round}</td>
                  <td className="px-3 py-4 text-center text-sm font-bold text-white">
                    {typeof match.team1_score === 'number' && typeof match.team2_score === 'number'
                      ? `${match.team1_score} : ${match.team2_score}`
                      : '-'}
                  </td>
                  <td className="px-3 py-4 text-center text-sm text-gray-300">
                    {match.match_time ? new Date(match.match_time).toLocaleString('id-ID') : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(match)} className="text-blue-400 hover:text-blue-300 mr-4">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(match)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 text-sm rounded border ${
              currentPage === i + 1
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
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

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Konfirmasi Hapus"
        >
          <div className="mt-2 text-sm text-gray-400">
            Apakah Anda yakin ingin menghapus pertandingan ini? Tindakan ini tidak dapat dibatalkan.
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              className="px-4 py-2 text-sm text-gray-200 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Batal
            </button>
            <button
              className="px-4 py-2 text-sm text-white bg-red-600 border rounded hover:bg-red-700"
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
