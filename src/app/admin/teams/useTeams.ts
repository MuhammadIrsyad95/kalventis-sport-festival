'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Team } from '@/types/database.types';

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Fetch error:', error.message);
    } else {
      setTeams(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return { teams, setTeams, loading, fetchTeams };
}
