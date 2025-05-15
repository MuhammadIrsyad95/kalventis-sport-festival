'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed w-full z-50 transition-all duration-300 bg-gray-900 py-4">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-2 md:mb-0">
          <Link href="/" className="text-2xl font-bold text-white">
            Kalventis Sport Festival
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/" className="font-medium hover:text-gray-300 transition-colors text-white">
            Home
          </Link>
          <Link href="/rules" className="font-medium hover:text-gray-300 transition-colors text-white">
            Rules
          </Link>
          <Link href="/sports" className="font-medium hover:text-gray-300 transition-colors text-white">
            Sport
          </Link>
          <Link href="/about" className="font-medium hover:text-gray-300 transition-colors text-white">
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}