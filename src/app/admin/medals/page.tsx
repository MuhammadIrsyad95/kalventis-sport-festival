"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import Modal from "@/components/Modal";
import MedalForm from "@/components/forms/MedalForm";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import { Medal, Team, Sport } from "@/types/database.types";

export default function MedalsPage() {
  const [medals, setMedals] = useState<Medal[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedMedal, setSelectedMedal] = useState<Medal | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [medalToDelete, setMedalToDelete] = useState<Medal | null>(null);

  const [teamFilter, setTeamFilter] = useState<string>("semua");
  const [sportFilter, setSportFilter] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    const [medalRes, teamRes, sportRes] = await Promise.all([
      supabase.from("medals").select("*"),
      supabase.from("teams").select("*"),
      supabase.from("sports").select("*"),
    ]);
    setMedals(medalRes.data || []);
    setTeams(teamRes.data || []);
    setSports(sportRes.data || []);
    setLoading(false);
  }

  const handleAdd = () => {
    setFormMode("create");
    setSelectedMedal(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (medal: Medal) => {
    setFormMode("edit");
    setSelectedMedal(medal);
    setIsModalOpen(true);
  };

  const handleDelete = (medal: Medal) => {
    setMedalToDelete(medal);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!medalToDelete) return;
    await supabase.from("medals").delete().eq("id", medalToDelete.id);
    fetchAll();
    setIsDeleteModalOpen(false);
  };

  const resetFilters = () => {
    setTeamFilter("semua");
    setSportFilter("semua");
    setSearchQuery("");
  };

  const filteredMedals = medals.filter((medal) => {
    const teamName = teams.find((t) => t.id === medal.team_id)?.name || "";
    const sportName = sports.find((s) => s.id === medal.sport_id)?.name || "";

    const matchesTeam = teamFilter === "semua" || medal.team_id === teamFilter;
    const matchesSport = sportFilter === "semua" || medal.sport_id === sportFilter;

    const matchesSearch =
      teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sportName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTeam && matchesSport && (searchQuery ? matchesSearch : true);
  });

  if (loading) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Manajemen Medali</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambahkan Medali
        </button>
      </div>

      {/* Filter dan Search */}
      <div className="flex flex-wrap justify-between gap-4 items-center mb-4">
        <div className="flex gap-4 flex-wrap">
          <select
            className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-600"
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
          >
            <option value="semua">Semua Tim</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          <select
            className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-600"
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
          >
            <option value="semua">Semua Olahraga</option>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.id}>
                {sport.name}
              </option>
            ))}
          </select>

          <button
            onClick={resetFilters}
            className="px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-500 text-sm"
          >
            Reset Filter
          </button>
        </div>

        <input
          type="text"
          placeholder="Cari tim atau olahraga..."
          className="px-3 py-1 rounded bg-gray-800 text-white border border-gray-600 w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabel Medali */}
      <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Grup
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Olahraga
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-yellow-300 uppercase tracking-wider">
                Emas
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                Perak
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-orange-400 uppercase tracking-wider">
                Perunggu
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {filteredMedals.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-400">
                  Tidak ada medali ditemukan. Tambahkan medali pertama.
                </td>
              </tr>
            ) : (
              filteredMedals.map((medal) => {
                const team = teams.find((t) => t.id === medal.team_id);
                const sport = sports.find((s) => s.id === medal.sport_id);
                return (
                  <tr key={medal.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                      {team?.name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {sport?.name || "-"}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-center text-yellow-300 font-bold">
                      {medal.gold}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-center text-gray-300 font-bold">
                      {medal.silver}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-center text-orange-400 font-bold">
                      {medal.bronze}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(medal)}
                        className="text-blue-400 hover:text-blue-300 mr-4"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(medal)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah/Edit */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${formMode === "create" ? "Tambah" : "Edit"} Medali`}
        >
          <MedalForm
            medal={selectedMedal}
            onSubmit={async (data) => {
              if (formMode === "create") {
                await supabase.from("medals").insert([data]);
              } else if (selectedMedal) {
                await supabase
                  .from("medals")
                  .update(data)
                  .eq("id", selectedMedal.id);
              }
              fetchAll();
              setIsModalOpen(false);
            }}
            onCancel={() => setIsModalOpen(false)}
            medals={medals}
          />
        </Modal>
      )}

      {/* Modal Konfirmasi Hapus */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Hapus Medali"
        >
          <div className="mt-2">
            <p className="text-sm text-gray-400">
              Yakin ingin menghapus medali ini? Tindakan ini tidak dapat dibatalkan.
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
    </div>
  );
}
