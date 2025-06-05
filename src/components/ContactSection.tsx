// src/components/ContactSection.tsx

export default function ContactSection() {
  return (
    <section
      id="contact-section"
      className="w-full bg-white shadow-inner rounded-t-2xl border-t border-gray-200 py-12 mt-8"
    >
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700 text-sm">

        {/* Kiri - Hubungi Kami */}
        <div>
          <h3 className="text-base md:text-lg font-semibold mb-2" style={{ color: 'rgb(0, 52, 98)' }}>
            Hubungi Kami
          </h3>
          <p className="mb-4">
            Apabila terdapat pertanyaan seputar KSF (Kalventis Sport Festival), silakan hubungi panitia Kalventis untuk informasi lebih lanjut.
          </p>
        </div>

        {/* Tengah - Kosong */}
        <div className="hidden md:block" />

        {/* Kanan - Follow Us */}
        <div>
          <h3 className="text-base md:text-lg font-semibold mb-4" style={{ color: 'rgb(0, 52, 98)' }}>
            Ikuti Kami
          </h3>
          <div className="flex flex-col space-y-2">
            <a
              href="https://instagram.com/kalventis"
              target="_blank"
              rel="noopener noreferrer"
              className="transition flex items-center gap-1 hover:underline"
              style={{ color: 'rgb(0, 52, 98)' }}
            >
              {/* Icon Instagram */}
              <svg xmlns="http://www.w3.org/2000/svg" className="lucide lucide-instagram" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              Instagram
            </a>
            <a
              href="https://www.youtube.com/@kalventis"
              target="_blank"
              rel="noopener noreferrer"
              className="transition flex items-center gap-1 hover:underline"
              style={{ color: 'rgb(0, 52, 98)' }}
            >
              {/* Icon YouTube */}
              <svg xmlns="http://www.w3.org/2000/svg" className="lucide lucide-youtube" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 17a2.49 2.49 0 0 1-2-2.49V9a2.49 2.49 0 0 1 2-2.49C4.64 6 10 6 12 6s7.36 0 9.5 2.02A2.5 2.5 0 0 1 24 9v5.51a2.5 2.5 0 0 1-2.5 2.49C19.36 17 14 17 12 17s-7.36 0-9.5-2.02Z" />
                <path d="m10 15 5-3-5-3v6Z" />
              </svg>
              YouTube
            </a>
            <a
              href="https://www.linkedin.com/company/kalventis/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className="transition flex items-center gap-1 hover:underline"
              style={{ color: 'rgb(0, 52, 98)' }}
            >
              {/* Icon LinkedIn */}
              <svg xmlns="http://www.w3.org/2000/svg" className="lucide lucide-linkedin" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2c-1 0-2 1-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
