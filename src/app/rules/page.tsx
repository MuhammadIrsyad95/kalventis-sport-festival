'use client';

import { useState, useEffect } from 'react';
import { Rule, Sport } from '@/types/database.types';
import { supabase } from '@/lib/supabase';

interface RuleWithSport extends Rule {
  sport: Sport;
}

export default function RulesPage() {
  const [rules, setRules] = useState<RuleWithSport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const { data } = await supabase
        .from('rules')
        .select(`
          *,
          sport:sports(*)
        `)
        .order('sport_id');

      if (data) {
        setRules(data.map(rule => ({
          ...rule,
          sport: rule.sport as Sport
        })));
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Sport Rules</h1>

      {rules.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <p className="text-xl">No rules available</p>
          <p className="mt-2">Check back later for updates</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {rules.map((rule) => (
            <div key={rule.id} className="card p-6">
              <h2 className="text-2xl font-bold mb-4">{rule.sport.name}</h2>
              <div className="prose prose-invert max-w-none">
                {rule.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}