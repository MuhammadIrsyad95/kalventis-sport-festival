import { Sport } from '@/types/database.types';
import { Edit, Trash2 } from 'lucide-react';

interface SportTableProps {
  sports: Sport[];
  onEdit: (sport: Sport) => void;
  onDelete: (sport: Sport) => void;
}

export default function SportTable({ sports, onEdit, onDelete }: SportTableProps) {
  return (
    <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gambar</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nama</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {sports.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-400">
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
                <td className="px-6 py-4 whitespace-nowrap text-white">{sport.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <button onClick={() => onEdit(sport)} className="text-blue-400 hover:text-blue-300">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => onDelete(sport)} className="text-red-400 hover:text-red-300">
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
