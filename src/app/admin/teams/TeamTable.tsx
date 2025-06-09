// src/app/admin/teams/TeamTable.tsx
'use client';

import { Edit, Trash2 } from 'lucide-react';
import { Team } from '@/types/database.types';

interface Props {
  teams: Team[];
  loading: boolean;
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void;
}

export default function TeamTable({ teams, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-700 h-8 w-1/4 mb-4 rounded" />
        <div className="bg-gray-700 h-96 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nama</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Perusahaan</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Aksi</th>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{team.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{team.company}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onEdit(team)} className="text-blue-400 hover:text-blue-300 mr-4">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => onDelete(team)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
