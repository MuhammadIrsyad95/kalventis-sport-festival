import Header from '@/components/Header';
import '../styles/globals.css';
import { usePathname } from 'next/navigation';
import { Poppins } from 'next/font/google';

export const metadata = {
  title: 'Sports Live Score',
  description: 'Live sports scores and medal tally',
};

const poppins = Poppins({ subsets: ['latin'], weight: ['400','600','700'], display: 'swap' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isAdmin = pathname.startsWith('/admin');
  return (
    <html lang="en" className={poppins.className}>
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 to-white text-gray-900 font-sans">
        {!isAdmin && <Header />}
        <main className="flex-1 pt-16">
          {children}
        </main>
        <footer className="bg-indigo-50 border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-gray-700 text-sm">
            <div className="w-full md:w-auto text-left mb-2 md:mb-0">Kalventis Sport Festival © {new Date().getFullYear()} - Kalventis. All rights reserved.</div>
            <div className="w-full md:w-auto text-left md:text-right text-indigo-700 font-semibold">Version 1.1</div>
          </div>
        </footer>
      </body>
    </html>
  );
}