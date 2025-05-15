// app/login/page.tsx
'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Development bypass login
      if (email === 'admin@example.com' && password === 'admin123') {
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_email', email);
        router.push('/admin');
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_email', email);
      router.push('/admin');
    } catch (err: any) {
      console.error('Login error:', err.message);
      setError(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <h1 className="text-2xl font-bold mb-6 text-white">Admin Login</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

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
            Don&apos;t have an account? Register here
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
