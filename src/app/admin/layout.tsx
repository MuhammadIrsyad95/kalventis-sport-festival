'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Home, Trophy, Users, Award, BookOpen, Settings, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import LogoutButton from '@/components/LogoutButton';
import { supabase } from '@/lib/supabase/client';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        // Skip auth check for login and register pages
      if (pathname === '/login') {
  setIsLoading(false);
  return;
}

        
        // Check for auth in localStorage first (fallback for Supabase issues)
        const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
        
        if (!isAuthenticated) {
          // Redirect to login
          console.log('User not authenticated, redirecting to login');
          router.push('/login');
          return;
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [pathname, router]);

  // Only apply dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <Home className="w-5 h-5" /> },
    { name: 'Matches', path: '/admin/matches', icon: <Trophy className="w-5 h-5" /> },
    { name: 'Teams', path: '/admin/teams', icon: <Users className="w-5 h-5" /> },
    { name: 'Sports', path: '/admin/sports', icon: <Award className="w-5 h-5" /> },
    { name: 'Medals', path: '/admin/medals', icon: <Award className="w-5 h-5" /> },
    { name: 'Rules', path: '/admin/rules', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  // Login or register pages get a simple layout without sidebar
  if (pathname === '/login') {
    return <div className="min-h-screen bg-gray-900">{children}</div>;
  }
  
  // Show loading indicator while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // All other admin pages get the full layout with sidebar
  return (
    <div className="min-h-screen flex bg-gray-900">
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
          <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
            <div className="text-sm font-medium text-gray-300 truncate">
              admin@example.com
            </div>
          </div>
          
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
      <div className="flex flex-col flex-1">
        {/* Mobile Header */}
        <div className="md:hidden bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-400" />
            <span className="ml-3 text-xl font-semibold text-white">Admin</span>
          </div>
          <button
            className="text-gray-300 hover:text-white focus:outline-none ml-2"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-7 w-7" />
          </button>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex">
            <div className="w-64 bg-gray-800 h-full flex flex-col shadow-lg animate-slideInLeft relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-7 w-7" />
              </button>
              <div className="flex items-center h-16 px-4 border-b border-gray-700">
                <Shield className="h-8 w-8 text-blue-400" />
                <span className="ml-3 text-xl font-semibold text-white">Admin</span>
              </div>
              <div className="flex-1 flex flex-col overflow-y-auto">
                <nav className="flex-1 px-2 py-4 space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${isActive(item.path)
                        ? 'bg-gray-700 text-white border-l-4 border-blue-400'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                      `}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className={`mr-3 ${isActive(item.path) ? 'text-blue-400' : ''}`}>{item.icon}</div>
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="p-4 border-t border-gray-700 space-y-2">
                <Link
                  href="/"
                  className="flex items-center text-sm font-medium text-gray-300 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="mr-3 h-5 w-5" />
                  Back to Site
                </Link>
                <LogoutButton />
              </div>
            </div>
            {/* Overlay click to close */}
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-900 text-white pt-20 md:pt-6 px-6 pb-6">
        {children}
      </main>

      </div>
    </div>
  );
} 