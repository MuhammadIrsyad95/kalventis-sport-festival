'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { Match, Team, Sport } from '@/types';

export default function LiveMatches() {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveMatches = async () => {
      const { data: matches } = await supabaseClient
        .from('matches')
        .select('*, team1:teams!team1_id(name, country), team2:teams!team2_id(name, country), sport:sports(name)')
        .eq('status', 'ongoing')
        .order('match_date', { ascending: true });
      
      setLiveMatches(matches || []);
      setLoading(false);
    };
    
    fetchLiveMatches();
    
    // Set up real-time subscription
    const subscription = supabaseClient
      .channel('live-matches')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'matches'
      }, fetchLiveMatches)
      .subscribe();

    return () => {
      supabaseClient.removeChannel(subscription);
    };
  }, []);

  if (loading) return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (liveMatches.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-800">
        <h3 className="text-lg font-medium text-white flex items-center">
          <span className="w-3 h-3 rounded-full bg-red-500 mr-2 animate-pulse"></span>
          LIVE MATCHES
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {liveMatches.map((match) => (
          <div key={match.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 font-medium">
                  LIVE
                </span>
                <span className="ml-2 text-sm text-gray-500">{(match as any).sport.name}</span>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(match.match_date).toLocaleTimeString()}
              </div>
            </div>
            
            <div className="mt-3 grid grid-cols-3 items-center">
              <div className="text-center">
                <p className="font-bold text-gray-900">{(match as any).team1.name}</p>
                <p className="text-sm text-gray-500">{(match as any).team1.country}</p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center items-center space-x-4">
                  <span className="text-2xl font-bold text-gray-900">{match.score_team1 ?? 0}</span>
                  <span className="text-gray-400">-</span>
                  <span className="text-2xl font-bold text-gray-900">{match.score_team2 ?? 0}</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="font-bold text-gray-900">{(match as any).team2.name}</p>
                <p className="text-sm text-gray-500">{(match as any).team2.country}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}