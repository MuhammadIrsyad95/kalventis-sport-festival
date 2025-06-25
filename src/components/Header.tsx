'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isHome = pathname === '/';

  return (
    <header className="w-full z-50 fixed top-0 left-0 bg-white shadow-xl rounded-b-2xl py-4">
      <nav className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between w-full mb-2">
          {!isAdmin && (
            <button
              className="text-indigo-700 mr-2"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka menu"
            >
              <Menu className="h-7 w-7" />
            </button>
          )}

          <Link href="/" className="ml-auto">
            <div className="flex items-center space-x-3">
              <img src="/images/ksf2.jpg" alt="Logo KSF" className="h-16 w-auto object-contain" />
              <span className="text-gray-400 text-xl font-light">|</span>
              <img src="/images/kalventis.jpg" alt="Logo Kalventis" className="h-16 w-auto object-contain" />
            </div>
          </Link>
        </div>

        {/* Menu kiri desktop */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-900 hover:text-indigo-700">Beranda</Link>
          <Link href={isHome ? '#matches-section' : '/#matches-section'} className="text-gray-900 hover:text-indigo-700">Pertandingan</Link>
          <Link href={isHome ? '#medals-section' : '/#medals-section'} className="text-gray-900 hover:text-indigo-700">Medali</Link>
          <Link href={isHome ? '#sports-section' : '/#sports-section'} className="text-gray-900 hover:text-indigo-700">Cabang Olahraga</Link>
        </div>

        {/* Logo kanan desktop */}
        <div className="hidden md:flex items-center">
          <Link href="/">
            <div className="flex items-center space-x-3">
              <img src="/images/ksf2.jpg" alt="Logo KSF" className="h-14 w-auto object-contain" />
              <span className="text-gray-400 text-xl font-light">|</span>
              <img src="/images/kalventis.jpg" alt="Logo Kalventis" className="h-14 w-auto object-contain" />
            </div>
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex">
          <div className="w-64 bg-white h-full flex flex-col shadow-xl animate-slideInLeft relative rounded-r-2xl">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-indigo-700"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Tutup menu"
            >
              <X className="h-7 w-7" />
            </button>

            {/* Logo dalam drawer */}
            <div className="flex items-center justify-center h-24 border-b border-gray-200 px-4">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center space-x-3">
                  <img src="/images/ksf2.png" alt="Logo KSF" className="h-14 w-auto object-contain" />
                  <span className="text-gray-400 text-xl font-light">|</span>
                  <img src="/images/kalventis.png" alt="Logo Kalventis" className="h-14 w-auto object-contain" />
                </div>
              </Link>
            </div>

            {/* Isi menu drawer */}
            <nav className="flex-1 px-2 py-4 space-y-1">
              <Link
                href="/"
                className="block px-4 py-3 text-gray-900 rounded hover:bg-indigo-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href={isHome ? '#matches-section' : '/#matches-section'}
                className="block px-4 py-3 text-gray-900 rounded hover:bg-indigo-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pertandingan
              </Link>
              <Link
                href={isHome ? '#medals-section' : '/#medals-section'}
                className="block px-4 py-3 text-gray-900 rounded hover:bg-indigo-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Medali
              </Link>
              <Link
                href={isHome ? '#sports-section' : '/#sports-section'}
                className="block px-4 py-3 text-gray-900 rounded hover:bg-indigo-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cabang Olahraga
              </Link>
            </nav>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}
