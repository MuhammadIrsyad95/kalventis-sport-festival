import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../styles/globals.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'Sports Live Score',
  description: 'Live sports scores and medal tally',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 to-white text-gray-900 font-sans">
        <Header />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
