'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    setIsLoading(true);
    
    // Clear authentication from localStorage
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_email');
    
    // Redirect to login page
    window.location.href = '/login';
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