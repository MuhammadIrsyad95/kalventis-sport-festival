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
  const [formMode, setFormMode] = useState<'create' | 'edit'>("create");
  const [selectedMedal, setSelectedMedal] = useState<Medal | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [medalToDelete, setMedalToDelete] = useState<Medal | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (data: Partial<Medal>) => {
    if (formMode === "create") {
      await supabase.from("medals").insert([data]);
    } else if (selectedMedal) {
      await supabase.from("medals").update(data).eq("id", selectedMedal.id);
    }
    fetchAll();
    setIsModalOpen(false);
  };

  if (loading) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Medals Management</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Medal
        </button>
      </div>
      <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Team</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Sport</th>
              <th className="px-3 py-3 text-center text-xs font-medium text-yellow-300 uppercase tracking-wider">Gold</th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Silver</th>
              <th className="px-3 py-3 text-center text-xs font-medium text-orange-400 uppercase tracking-wider">Bronze</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {medals.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-400">
                  No medals available. Add your first medal.
                </td>
              </tr>
            ) : (
              medals.map((medal) => {
                const team = teams.find((t) => t.id === medal.team_id);
                const sport = sports.find((s) => s.id === medal.sport_id);
                return (
                  <tr key={medal.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{team?.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{sport?.name || '-'}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-center text-yellow-300 font-bold">{medal.gold}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-center text-gray-300 font-bold">{medal.silver}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-center text-orange-400 font-bold">{medal.bronze}</td>
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
      {/* Form Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${formMode === 'create' ? 'Add' : 'Edit'} Medal`}
        >
          <MedalForm
            medal={selectedMedal}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            medals={medals}
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
              Are you sure you want to delete this medal? This action cannot be undone.
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