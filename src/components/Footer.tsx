// src/components/Footer.tsx

export default function Footer() {
  return (
    <footer className="bg-white shadow-inner rounded-t-2xl border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-gray-700 text-sm">
        
        {/* Kiri: Info Developer */}
        <div className="w-full md:w-auto text-left mb-2 md:mb-0">
          Sport Festival © {new Date().getFullYear()} — Built by{' '}
          <a
            href="https://github.com/MuhammadIrsyad95/kalventis-sport-festival"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-700 hover:underline"
          >
            MuhammadIrsyad95
          </a>. All rights reserved.
        </div>

        {/* Kanan: Versi */}
        <div className="w-full md:w-auto text-left md:text-right text-indigo-700 font-semibold">
          Version 1.0.0
        </div>
      </div>
    </footer>
  );
}
