'use client';

import { useEffect, useState, createContext, useContext } from 'react';

type ThemeContextType = {
  theme: 'dark';
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  // Set dark mode via class
  useEffect(() => {
    document.documentElement.classList.add('dark');
    setMounted(true);
  }, []);

  const value: ThemeContextType = {
    theme: 'dark',
  };

  // Prevent flash during hydration
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      <div className="relative">
        {children}
      </div>
    </ThemeContext.Provider>
  );
} 