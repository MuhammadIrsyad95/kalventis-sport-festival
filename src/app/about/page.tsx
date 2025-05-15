import React from 'react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8 bg-white/10 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">About Kalventis Sport Festival</h1>
        <p className="text-gray-200 text-lg mb-6">
          Kalventis Sport Festival is an annual sports event organized by Kalventis, bringing together teams and companies to compete in a spirit of sportsmanship, unity, and excellence. The festival aims to foster healthy competition, strengthen camaraderie, and celebrate achievements in various sports disciplines.
        </p>
        <div className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Kalventis Sport Festival
        </div>
      </div>
    </main>
  );
} 