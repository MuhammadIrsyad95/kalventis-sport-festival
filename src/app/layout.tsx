import Header from '@/components/Header';
import '../styles/globals.css';
import { usePathname } from 'next/navigation';

export const metadata = {
  title: 'Sports Live Score',
  description: 'Live sports scores and medal tally',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isAdmin = pathname.startsWith('/admin');
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {!isAdmin && <Header />}
        <main className="flex-1 pt-16">
          {children}
        </main>
        <footer className="bg-gray-900 border-t border-gray-800 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <div className="w-full md:w-auto text-left mb-2 md:mb-0">Kalventis Sport Festival © {new Date().getFullYear()} - Kalventis. Hak cipta dilindungi undang-undang.</div>
            <div className="w-full md:w-auto text-left md:text-right">Version 1.1</div>
          </div>
        </footer>
      </body>
    </html>
  );
}