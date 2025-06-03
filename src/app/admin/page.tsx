'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Sport, Team, Match } from '@/types/database.types'
import { PlusCircle, Edit, Trash2, Trophy, Users, Activity, Award, BookOpen } from 'lucide-react'
import Modal from '@/components/Modal'
import MatchForm from '@/components/forms/MatchForm'
import TeamForm from '@/components/forms/TeamForm'
import SportForm from '@/components/forms/SportForm'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type FormMode = 'create' | 'edit'

interface DashboardStats {
  matchesCount: number;
  teamsCount: number;
  sportsCount: number;
  rulesCount: number;
  medalsCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    matchesCount: 0,
    teamsCount: 0,
    sportsCount: 0,
    rulesCount: 0,
    medalsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch counts from all tables
      const [matchesResponse, teamsResponse, sportsResponse, rulesResponse, medalsResponse] = await Promise.all([
        supabase.from('matches').select('id', { count: 'exact', head: true }),
        supabase.from('teams').select('id', { count: 'exact', head: true }),
        supabase.from('sports').select('id', { count: 'exact', head: true }),
        supabase.from('rules').select('id', { count: 'exact', head: true }),
        supabase.from('medals').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        matchesCount: matchesResponse.count || 0,
        teamsCount: teamsResponse.count || 0,
        sportsCount: sportsResponse.count || 0,
        rulesCount: rulesResponse.count || 0,
        medalsCount: medalsResponse.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Stats cards data
  const statsCards = [
    {
      name: 'Matches',
      value: stats.matchesCount,
      icon: <Trophy className="h-8 w-8 text-blue-400" />,
      href: '/admin/matches',
      bgColor: 'bg-gray-800',
      textColor: 'text-white',
    },
    {
      name: 'Teams',
      value: stats.teamsCount,
      icon: <Users className="h-8 w-8 text-green-400" />,
      href: '/admin/teams',
      bgColor: 'bg-gray-800',
      textColor: 'text-white',
    },
    {
      name: 'Sports',
      value: stats.sportsCount,
      icon: <Award className="h-8 w-8 text-purple-400" />,
      href: '/admin/sports',
      bgColor: 'bg-gray-800',
      textColor: 'text-white',
    },
    {
      name: 'Medals',
      value: stats.medalsCount,
      icon: <Award className="h-8 w-8 text-yellow-400" />,
      href: '/admin/medals',
      bgColor: 'bg-gray-800',
      textColor: 'text-white',
    },
    {
      name: 'Rules',
      value: stats.rulesCount,
      icon: <BookOpen className="h-8 w-8 text-yellow-400" />,
      href: '/admin/rules',
      bgColor: 'bg-gray-800',
      textColor: 'text-white',
    }
  ];

  if (loading) {
    return (
      <div className="animate-pulse">
        <h2 className="text-2xl font-bold mb-6 h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 h-36 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-white">Admin Dashboard</h1>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
        {statsCards.slice(0, 4).map((card) => (
          <Link 
            href={card.href} 
            key={card.name}
            className="bg-gray-900 rounded-2xl shadow-xl p-8 flex flex-col items-center border border-gray-800 hover:shadow-2xl transition"
          >
            <div className="mb-4">{card.icon}</div>
            <div className="text-3xl font-extrabold text-indigo-300 mb-1">{card.value}</div>
            <div className="text-lg font-semibold text-white">{card.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
} 