'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      console.log('[Logout] Attempting to sign out...');
      
      // Lakukan signout
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('[Logout] Error signing out:', error);
        return;
      }
      
      console.log('[Logout] Successfully signed out, redirecting to login page');
      
      // Hapus token dari storage secara manual untuk memastikan
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
      
      // Gunakan router untuk navigasi ke halaman login
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('[Logout] Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-700 text-red-400"
    >
      <LogOut className="h-4 w-4 mr-2" />
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
} 