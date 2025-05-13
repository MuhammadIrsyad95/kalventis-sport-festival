'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/admin';

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('[Login] Checking if user is already logged in...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('[Login] User already logged in, redirecting to', returnUrl);
          // Use window.location for hard redirect
          window.location.href = returnUrl;
        } else {
          console.log('[Login] No session found, showing login form');
        }
      } catch (error) {
        console.error('[Login] Error checking session:', error);
      } finally {
        setCheckingAuth(false);
      }
    };
    
    checkSession();

    // Monitor auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Login] Auth state changed:', event);
      if (event === 'SIGNED_IN' && session) {
        console.log('[Login] User signed in, redirecting to', returnUrl);
        router.push(returnUrl);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [returnUrl, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('[Login] Attempting login for', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[Login] Login failed:', error.message);
        setError(error.message);
      } else if (data.session) {
        console.log('[Login] Login successful, redirecting to', returnUrl);
        // Use window.location for hard redirect
        window.location.href = returnUrl;
      }
    } catch (err: any) {
      console.error('[Login] Unexpected login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <h1 className="text-2xl font-bold mb-6 text-white">Admin Login</h1>
      {error && <p className="text-red-400 p-3 bg-red-900/20 border border-red-800 rounded mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="flex flex-col space-y-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:text-gray-400"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <Link 
            href="/admin/register" 
            className="text-blue-400 hover:text-blue-300 text-sm text-center"
          >
            Don't have an account? Register here
          </Link>
        </div>
      </form>
    </div>
  );
}