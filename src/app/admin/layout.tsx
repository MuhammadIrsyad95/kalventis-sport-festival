'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Home, Trophy, Users, Award, BookOpen, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import LogoutButton from '@/components/LogoutButton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  // Aktifkan dark mode dan load user info jika ada session
  useEffect(() => {
    // Selalu gunakan dark mode untuk admin area
    document.documentElement.classList.add('dark');
    
    // Cek user info jika ada
    const getUserInfo = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };

    getUserInfo();
    
    // Listener untuk perubahan auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <Home className="w-5 h-5" /> },
    { name: 'Matches', path: '/admin/matches', icon: <Trophy className="w-5 h-5" /> },
    { name: 'Teams', path: '/admin/teams', icon: <Users className="w-5 h-5" /> },
    { name: 'Sports', path: '/admin/sports', icon: <Award className="w-5 h-5" /> },
    { name: 'Rules', path: '/admin/rules', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  // Login atau register page tidak membutuhkan layout admin
  if (pathname === '/admin/login' || pathname === '/admin/register') {
    return <div className="min-h-screen bg-gray-900">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gray-800 text-white border-r border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 bg-gray-900 border-b border-gray-700">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="ml-3 text-xl font-semibold text-white">Admin</span>
            </div>
          </div>
          
          {/* User info */}
          {user && (
            <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
              <div className="text-sm font-medium text-gray-300 truncate">
                {user.email}
              </div>
            </div>
          )}
          
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-md 
                    ${isActive(item.path)
                      ? 'bg-gray-700 text-white border-l-4 border-blue-400'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                  `}
                >
                  <div className={`mr-3 ${isActive(item.path) ? 'text-blue-400' : ''}`}>
                    {item.icon}
                  </div>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-700 space-y-2">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-gray-300 hover:text-white"
            >
              <Home className="mr-3 h-5 w-5" />
              Back to Site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-400" />
            <span className="ml-3 text-xl font-semibold text-white">Admin</span>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-gray-300 hover:text-white">
              <Home className="h-6 w-6" />
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6 text-white">
          {children}
        </main>
      </div>
    </div>
  );
} 