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
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    matchesCount: 0,
    teamsCount: 0,
    sportsCount: 0,
    rulesCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch counts from all tables
      const [matchesResponse, teamsResponse, sportsResponse, rulesResponse] = await Promise.all([
        supabase.from('matches').select('id', { count: 'exact', head: true }),
        supabase.from('teams').select('id', { count: 'exact', head: true }),
        supabase.from('sports').select('id', { count: 'exact', head: true }),
        supabase.from('rules').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        matchesCount: matchesResponse.count || 0,
        teamsCount: teamsResponse.count || 0,
        sportsCount: sportsResponse.count || 0,
        rulesCount: rulesResponse.count || 0
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
      icon: <Trophy className="h-8 w-8 text-blue-600" />,
      href: '/admin/matches',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    {
      name: 'Teams',
      value: stats.teamsCount,
      icon: <Users className="h-8 w-8 text-green-600" />,
      href: '/admin/teams',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300',
    },
    {
      name: 'Sports',
      value: stats.sportsCount,
      icon: <Award className="h-8 w-8 text-purple-600" />,
      href: '/admin/sports',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-300',
    },
    {
      name: 'Rules',
      value: stats.rulesCount,
      icon: <BookOpen className="h-8 w-8 text-yellow-600" />,
      href: '/admin/rules',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-700 dark:text-yellow-300',
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
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statsCards.map((card) => (
          <Link 
            href={card.href} 
            key={card.name}
            className={`${card.bgColor} overflow-hidden rounded-lg shadow transition-all hover:shadow-md hover:scale-105`}
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">{card.icon}</div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{card.name}</dt>
                    <dd>
                      <div className={`text-3xl font-bold ${card.textColor}`}>{card.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link 
              href="/admin/matches"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Manage Matches
            </Link>
            <Link 
              href="/admin/teams"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Manage Teams
            </Link>
            <Link 
              href="/admin/sports"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              Manage Sports
            </Link>
            <Link 
              href="/admin/rules"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
            >
              Manage Rules
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 