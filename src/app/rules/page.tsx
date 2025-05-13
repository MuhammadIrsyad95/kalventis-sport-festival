'use client';

import { useEffect, useState } from 'react';
import { Book } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Sport } from '@/types/database.types';

// Definisi ulang Rule sesuai database Supabase
interface Rule {
  id: string;
  sport_id: string;
  content: string;  // Menggunakan content bukan contenttext
  created_at?: string;
}

interface RuleWithSport extends Rule {
  sport?: Sport;
}

export default function RulesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rules, setRules] = useState<RuleWithSport[]>([]);

  useEffect(() => {
    async function fetchRules() {
      try {
        console.log('Fetching rules...');
        // Mengambil semua rules
        const { data: rulesData, error: rulesError } = await supabase
          .from('rules')
          .select('*');

        if (rulesError) {
          console.error('Rules fetch error:', rulesError);
          throw rulesError;
        }
        
        console.log('Rules data:', rulesData);

        if (!rulesData || rulesData.length === 0) {
          setRules([]);
          setLoading(false);
          return;
        }

        // Dapatkan semua sport ID yang diperlukan
        const sportIds = rulesData
          .map(rule => rule.sport_id)
          .filter(id => id !== null) as string[];

        if (sportIds.length === 0) {
          // Jika tidak ada sport_id yang valid, tampilkan rules tanpa sport
          setRules(rulesData);
          setLoading(false);
          return;
        }

        // Ambil data sports
        const { data: sportsData, error: sportsError } = await supabase
          .from('sports')
          .select('*')
          .in('id', sportIds);

        if (sportsError) {
          console.error('Sports fetch error:', sportsError);
          throw sportsError;
        }
        
        console.log('Sports data:', sportsData);

        // Gabungkan data
        const enrichedRules = rulesData.map(rule => {
          const sport = rule.sport_id 
            ? sportsData?.find(sport => sport.id === rule.sport_id)
            : undefined;
          
          return {
            ...rule,
            sport
          };
        });

        setRules(enrichedRules);
      } catch (err) {
        console.error('Error fetching rules:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchRules();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Sport Rules</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Sport Rules</h1>
        <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <h2 className="text-xl font-medium text-red-700">Error</h2>
          <p className="mt-2 text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Sport Rules</h1>
      
      {rules.length === 0 ? (
        <div className="p-6 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-medium text-gray-700">No rules available</h2>
          <p className="mt-2 text-gray-500">
            No sport rules have been added yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {rules.map((rule) => (
            <div key={rule.id} className="card p-6 border rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Book className="h-6 w-6 text-blue-500" />
                  <h3 className="text-xl font-semibold">{rule.sport?.name || 'General Rule'}</h3>
                </div>
                {rule.created_at && (
                  <span className="text-sm text-gray-500">
                    {new Date(rule.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{rule.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}