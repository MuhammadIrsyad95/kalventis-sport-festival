'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Match, Medal, Sport, Team } from '@/types';

export default function AdminDashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [medalForm, setMedalForm] = useState<{
    team_id: number | null;
    sport_id: number | null;
    medal_type: Medal['medal_type'];
  }>({
    team_id: null,
    sport_id: null,
    medal_type: 'gold',
  });
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.id !== '785c4a54-4af1-4f5b-89a3-b070677f1a17') {
        router.push('/admin/login');
      }
    };
    checkAdmin();

    const fetchData = async () => {
      try {
        const { data: matches } = await supabase
          .from('matches')
          .select('*, team1:teams!team1_id(name), team2:teams!team2_id(name), sport:sports(name)');
        const { data: sports } = await supabase.from('sports').select('*');
        const { data: teams } = await supabase.from('teams').select('*');
        setMatches(matches || []);
        setSports(sports || []);
        setTeams(teams || []);
      } catch (err) {
        setError('Error fetching data: ' + (err as Error).message);
      }
    };
    fetchData();
  }, [router]);

  const handleUpdateMatch = async (
    matchId: number,
    score_team1: number,
    score_team2: number,
    status: Match['status']
  ) => {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ score_team1, score_team2, status })
        .eq('id', matchId);
      if (error) {
        setError('Error updating match: ' + error.message);
      } else {
        setMatches(matches.map((m) => (String(m.id) === String(matchId) ? { ...m, score_team1, score_team2, status } : m)));
      }
    } catch (err) {
      setError('Error updating match: ' + (err as Error).message);
    }
  };

  const handleAddMedal = async () => {
    if (!medalForm.team_id || !medalForm.sport_id) {
      setError('Please select a team and sport.');
      return;
    }
    try {
      console.log('Inserting medal with:', {
        team_id: medalForm.team_id,
        sport_id: medalForm.sport_id,
        medal_type: medalForm.medal_type,
      });
      const { error } = await supabase
        .from('medals')
        .insert({
          team_id: medalForm.team_id,
          sport_id: medalForm.sport_id,
          medal_type: medalForm.medal_type,
        });
      if (error) {
        setError('Error saving medal: ' + error.message);
        console.error('Error saving medal:', error);
      } else {
        setMedalForm({ team_id: null, sport_id: null, medal_type: 'gold' });
        setError(null);
      }
    } catch (err) {
      setError('Error saving medal: ' + (err as Error).message);
      console.error('Error saving medal:', err);
    }
  };

  if (!matches.length || !sports.length || !teams.length) {
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
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
      </div>
      
      {error && <p className="text-red-400 mb-4 p-3 bg-red-900/20 border border-red-800 rounded">{error}</p>}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Manage Matches</h2>
        <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
          <div className="divide-y divide-gray-700">
            {matches.length === 0 ? (
              <div className="px-6 py-4 text-center text-sm text-gray-400">
                No matches available.
              </div>
            ) : (
              matches.map((match) => (
                <div key={match.id} className="p-4 hover:bg-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/50 text-blue-300">
                        {(match as any).sport?.name || 'Sport'}
                      </span>
                    </div>
                  </div>
                  <div className="font-medium text-white mb-3">
                    {(match as any).team1?.name || 'Team 1'} vs {(match as any).team2?.name || 'Team 2'}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 mb-1">Team 1 Score</label>
                      <input
                        type="number"
                        value={match.score_team1 ?? 0}
                        onChange={(e) =>
                          handleUpdateMatch(
                            Number(match.id),
                            +e.target.value,
                            match.score_team2 ?? 0,
                            match.status
                          )
                        }
                        className="w-20 p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Score"
                      />
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 mb-1">Team 2 Score</label>
                      <input
                        type="number"
                        value={match.score_team2 ?? 0}
                        onChange={(e) =>
                          handleUpdateMatch(
                            Number(match.id),
                            match.score_team1 ?? 0,
                            +e.target.value,
                            match.status
                          )
                        }
                        className="w-20 p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Score"
                      />
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 mb-1">Status</label>
                      <select
                        value={match.status}
                        onChange={(e) =>
                          handleUpdateMatch(
                            Number(match.id),
                            match.score_team1 ?? 0,
                            match.score_team2 ?? 0,
                            e.target.value as Match['status']
                          )
                        }
                        className="p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Add Medal</h2>
        <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Sport</label>
              <select
                value={medalForm.sport_id ?? ''}
                onChange={(e) =>
                  setMedalForm({
                    ...medalForm,
                    sport_id: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Sport</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.id.toString()}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Team</label>
              <select
                value={medalForm.team_id ?? ''}
                onChange={(e) =>
                  setMedalForm({
                    ...medalForm,
                    team_id: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id.toString()}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Medal Type</label>
              <select
                value={medalForm.medal_type}
                onChange={(e) =>
                  setMedalForm({
                    ...medalForm,
                    medal_type: e.target.value as Medal['medal_type'],
                  })
                }
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAddMedal}
                disabled={!medalForm.team_id || !medalForm.sport_id}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:text-gray-400 w-full"
              >
                Add Medal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}