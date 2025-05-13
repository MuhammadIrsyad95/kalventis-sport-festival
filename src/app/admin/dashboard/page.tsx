'use client';

  import { useState, useEffect } from 'react';
  import { supabaseClient } from '@/lib/supabase/client';
  import { createSupabaseServerClient } from '@/lib/supabase/server';
  import { useRouter } from 'next/navigation';
  import { Match, Medal, Sport, Team } from '@/types';

  export default function AdminDashboard() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [sports, setSports] = useState<Sport[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
      const checkAdmin = async () => {
        const supabase = createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || user.id !== '785c4a54-4af1-4f5b-89a3-b070677f1a17') {
          router.push('/admin/login');
        }
      };
      checkAdmin();

      const fetchData = async () => {
        const { data: matches } = await supabaseClient
          .from('matches')
          .select('*, team1:teams!team1_id(name), team2:teams!team2_id(name), sport:sports(name)');
        const { data: sports } = await supabaseClient.from('sports').select('*');
        const { data: teams } = await supabaseClient.from('teams').select('*');
        setMatches(matches || []);
        setSports(sports || []);
        setTeams(teams || []);
      };
      fetchData();
    }, [router]);

    const handleUpdateMatch = async (matchId: number, score_team1: number, score_team2: number, status: Match['status']) => {
      const { error } = await supabaseClient
        .from('matches')
        .update({ score_team1, score_team2, status })
        .eq('id', matchId);
      if (error) {
        setError(error.message);
      } else {
        setMatches(matches.map((m) => (m.id === matchId ? { ...m, score_team1, score_team2, status } : m)));
      }
    };

    const handleAddMedal = async (team_id: number, sport_id: number, medal_type: Medal['medal_type']) => {
      const { error } = await supabaseClient
        .from('medals')
        .insert({ team_id, sport_id, medal_type });
      if (error) {
        setError(error.message);
      }
    };

    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <h2 className="text-2xl font-semibold mb-4">Manage Matches</h2>
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="border p-4 rounded-lg shadow">
              <p className="font-semibold">{(match as any).sport.name}</p>
              <p>
                {(match as any).team1.name} vs {(match as any).team2.name}
              </p>
              <div className="flex space-x-4 mt-2">
                <input
                  type="number"
                  value={match.score_team1 ?? 0}
                  onChange={(e) => handleUpdateMatch(match.id, +e.target.value, match.score_team2 ?? 0, match.status)}
                  className="w-20 p-2 border rounded"
                  placeholder="Team 1 Score"
                />
                <input
                  type="number"
                  value={match.score_team2 ?? 0}
                  onChange={(e) => handleUpdateMatch(match.id, match.score_team1 ?? 0, +e.target.value, match.status)}
                  className="w-20 p-2 border rounded"
                  placeholder="Team 2 Score"
                />
                <select
                  value={match.status}
                  onChange={(e) => handleUpdateMatch(match.id, match.score_team1 ?? 0, match.score_team2 ?? 0, e.target.value as Match['status'])}
                  className="p-2 border rounded"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Add Medal</h2>
        <div className="border p-4 rounded-lg shadow">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Sport</label>
              <select
                className="w-full p-2 border rounded"
                onChange={(e) => handleAddMedal(teams[0]?.id, +e.target.value, 'gold')}
              >
                <option value="">Select Sport</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>{sport.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Team</label>
              <select
                className="w-full p-2 border rounded"
                onChange={(e) => handleAddMedal(+e.target.value, sports[0]?.id, 'gold')}
              >
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Medal Type</label>
              <select
                className="w-full p-2 border rounded"
                onChange={(e) => handleAddMedal(teams[0]?.id, sports[0]?.id, e.target.value as Medal['medal_type'])}
              >
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
              </select>
            </div>
            <button
              onClick={() => handleAddMedal(teams[0]?.id, sports[0]?.id, 'gold')}
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Add Medal
            </button>
          </div>
        </div>
      </div>
    );
  }