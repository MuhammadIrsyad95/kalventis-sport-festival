import { useState, useEffect } from 'react';
import { Team, Sport, Medal } from '@/types/database.types';
import { supabase } from '@/lib/supabase/client';

interface MedalFormProps {
  medal?: Medal;
  onSubmit: (data: Partial<Medal>) => void;
  onCancel: () => void;
  medals?: Medal[];
}

export default function MedalForm({ medal, onSubmit, onCancel, medals = [] }: MedalFormProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [formData, setFormData] = useState<Partial<Medal>>({
    team_id: medal?.team_id || '',
    sport_id: medal?.sport_id || '',
    gold: medal?.gold ?? 0,
    silver: medal?.silver ?? 0,
    bronze: medal?.bronze ?? 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamsAndSports();
  }, []);

  const fetchTeamsAndSports = async () => {
    const { data: teamsData } = await supabase.from('teams').select('*');
    const { data: sportsData } = await supabase.from('sports').select('*');

    if (sportsData) {
      const filteredSports: Sport[] = [];

      const fungamesSport = sportsData.find((sport) => sport.kategori === 'fungames');
      if (fungamesSport) {
        // Ubah nama jadi "FUN GAMES"
        filteredSports.push({ ...fungamesSport, name: 'FUN GAMES' });
      }

      const otherSports = sportsData.filter((sport) => sport.kategori !== 'esport' && sport.kategori !== 'fungames');
      filteredSports.push(...otherSports);

      setSports(filteredSports);
    }

    if (teamsData) setTeams(teamsData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { sport_id, gold, silver, bronze } = formData;
    if (!sport_id) return;

    const sameSportMedals = medals.filter(
      (m) => m.sport_id === sport_id && (!medal || m.id !== medal.id)
    );

    const alreadyTaken = {
      gold: sameSportMedals.find((m) => m.gold > 0),
      silver: sameSportMedals.find((m) => m.silver > 0),
      bronze: sameSportMedals.find((m) => m.bronze > 0),
    };

    const conflictMessages: string[] = [];

    if (gold && alreadyTaken.gold) {
      const teamName = teams.find(t => t.id === alreadyTaken.gold?.team_id)?.name ?? 'Tim lain';
      conflictMessages.push(`Emas untuk olahraga ini sudah diberikan ke ${teamName}.`);
    }
    if (silver && alreadyTaken.silver) {
      const teamName = teams.find(t => t.id === alreadyTaken.silver?.team_id)?.name ?? 'Tim lain';
      conflictMessages.push(`Perak untuk olahraga ini sudah diberikan ke ${teamName}.`);
    }
    if (bronze && alreadyTaken.bronze) {
      const teamName = teams.find(t => t.id === alreadyTaken.bronze?.team_id)?.name ?? 'Tim lain';
      conflictMessages.push(`Perunggu untuk olahraga ini sudah diberikan ke ${teamName}.`);
    }

    if (conflictMessages.length > 0) {
      setError(conflictMessages.join(' '));
      return;
    }

    setError(null);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Tim</label>
          <select
            value={formData.team_id}
            onChange={e => setFormData({ ...formData, team_id: e.target.value })}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            required
          >
            <option value="">Pilih Tim</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Olahraga</label>
          <select
            value={formData.sport_id}
            onChange={e => setFormData({ ...formData, sport_id: e.target.value })}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            required
          >
            <option value="">Pilih Olahraga</option>
            {sports.map(sport => (
              <option key={sport.id} value={sport.id}>{sport.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Emas</label>
          <input
            type="number"
            value={formData.gold ?? ''}
            onChange={e => setFormData({ ...formData, gold: Number(e.target.value) })}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            min={0}
            max={1}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Perak</label>
          <input
            type="number"
            value={formData.silver ?? ''}
            onChange={e => setFormData({ ...formData, silver: Number(e.target.value) })}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            min={0}
            max={1}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Perunggu</label>
          <input
            type="number"
            value={formData.bronze ?? ''}
            onChange={e => setFormData({ ...formData, bronze: Number(e.target.value) })}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            min={0}
            max={1}
            required
          />
        </div>
      </div>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white hover:bg-gray-600"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {medal ? 'Update' : 'Tambah'} Medali
        </button>
      </div>
    </form>
  );
}
