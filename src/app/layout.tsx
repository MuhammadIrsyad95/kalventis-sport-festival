import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../styles/globals.css';

export const metadata = {
  title: 'Kalventis Sport Festival 2025',
  
  description: 'Live sports scores and medal tally',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
