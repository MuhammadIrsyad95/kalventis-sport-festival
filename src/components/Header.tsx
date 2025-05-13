'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase/client';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabaseClient.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
    window.location.href = '/';
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-2' : 'bg-blue-600 py-4'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className={`text-2xl font-bold ${
            scrolled ? 'text-blue-600' : 'text-white'
          }`}>
            SportsLive
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            href="/" 
            className={`font-medium hover:text-blue-500 transition-colors ${
              scrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/rules" 
            className={`font-medium hover:text-blue-500 transition-colors ${
              scrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            Rules
          </Link>
          
          {user && user.id === '785c4a54-4af1-4f5b-89a3-b070677f1a17' && (
            <Link 
              href="/admin/dashboard" 
              className={`font-medium hover:text-blue-500 transition-colors ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Admin
            </Link>
          )}
          
          {user ? (
            <button 
              onClick={handleSignOut} 
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                scrolled 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-white text-blue-600 hover:bg-gray-100'
              }`}
            >
              Sign Out
            </button>
          ) : (
            <Link 
              href="/admin/login" 
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                scrolled 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-white text-blue-600 hover:bg-gray-100'
              }`}
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}