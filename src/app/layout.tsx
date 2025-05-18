import Header from '@/components/Header';
import '../styles/globals.css';

export const metadata = {
  title: 'Sports Live Score',
  description: 'Live sports scores and medal tally',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <footer className="bg-gray-900 border-t border-gray-800 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Sports Live Score. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}