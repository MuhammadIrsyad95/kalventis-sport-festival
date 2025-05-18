'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <header className="w-full z-50 transition-all duration-300 bg-gray-900 py-4 md:fixed">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        {/* Mobile header bar */}
        <div className="flex md:hidden items-center justify-between w-full mb-2">
          <Link href="/" className="text-white mr-2">
            <Home className="h-7 w-7" />
          </Link>
          <span className="text-lg font-bold text-white flex-1 text-center">
            Kalventis Sport Festival
          </span>
          {!isAdmin && (
            <button
              className="text-white ml-2"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-7 w-7" />
            </button>
          )}
        </div>
        {/* Desktop menu */}
        <div className="hidden md:flex items-center mb-2 md:mb-0">
          <Link href="/" className="text-2xl font-bold text-white">
            Kalventis Sport Festival
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="font-medium hover:text-gray-300 transition-colors text-white">
            Home
          </Link>
          <Link href="/sports" className="font-medium hover:text-gray-300 transition-colors text-white">
            Cabang Olahraga
          </Link>
          <Link href="/rules" className="font-medium hover:text-gray-300 transition-colors text-white">
            Rules
          </Link>
          <Link href="/about" className="font-medium hover:text-gray-300 transition-colors text-white">
            Tentang
          </Link>
        </div>
        {/* Mobile hamburger (hidden, now in bar above) */}
      </nav>
      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex">
          <div className="w-64 bg-gray-900 h-full flex flex-col shadow-lg animate-slideInLeft relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-7 w-7" />
            </button>
            <div className="flex items-center h-16 px-4 border-b border-gray-700">
              <span className="text-2xl font-bold text-white">Kalventis Sport Festival</span>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              <Link href="/" className="block px-4 py-3 text-white font-medium rounded hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/sports" className="block px-4 py-3 text-white font-medium rounded hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>
                Cabang Olahraga
              </Link>
              <Link href="/rules" className="block px-4 py-3 text-white font-medium rounded hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>
                Rules
              </Link>
              <Link href="/about" className="block px-4 py-3 text-white font-medium rounded hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>
                Tentang
              </Link>
            </nav>
          </div>
          {/* Overlay click to close */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}