import Link from 'next/link'
import { Trophy } from 'lucide-react'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'

export const metadata = {
  title: 'Kalventis Sport Festival',
  description: 'Real-time sports scores and statistics for Kalventis Sport Festival',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-gray-900 text-white">
        <ThemeProvider>
          {/* Navigation */}
          <nav className="fixed w-full top-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <Link href="/" className="flex items-center space-x-2">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <span className="text-xl font-bold text-white">Kalventis Sport Festival</span>
                </Link>

                <div className="hidden md:flex items-center space-x-6">
                  <Link
                    href="/"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Live
                  </Link>
                  <Link
                    href="/matches"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Matches
                  </Link>
                  <Link
                    href="/stats"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Stats
                  </Link>
                  <Link
                    href="/rules"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Rules
                  </Link>
                </div>

           
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <div className="pt-16 min-h-screen bg-gray-900">
            {children}
          </div>

          {/* Footer */}
          <footer className="bg-gray-800 border-t border-gray-700 py-8 text-white">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-bold mb-4 text-white">About Kalventis Sport Festival</h3>
                  <p className="text-gray-400">
                    Your ultimate destination for real-time sports updates and scores
                    from the Kalventis Sport Festival.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Live Scores
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/matches"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        All Matches
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/stats"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Statistics
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/rules"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Rules
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4 text-white">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Twitter
                    </a>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Facebook
                    </a>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
                <p>© {new Date().getFullYear()} Kalventis Sport Festival. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}