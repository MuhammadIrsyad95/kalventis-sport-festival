'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16"
    >
      <div className="flex-1 text-center md:text-left">
        <h1
          className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
          style={{ color: 'rgb(0, 52, 98)' }}
        >
          Kalventis Sport Festival
        </h1>
        <p className="text-gray-700 text-lg mb-8 max-w-xl">
          Sehat bersama menggapai asa.
        </p>
        <Link href="#sports-section">
          <button
            className="text-white bg-[rgb(0,52,98)] hover:bg-[rgb(0,42,88)] text-lg px-8 py-4 rounded-2xl shadow-xl transition"
          >
            Lihat Daftar Olahraga
          </button>
        </Link>
      </div>

      <div className="flex-1 flex justify-center">
        <img
          src="/images/3.svg"
          alt="Athlete Illustration"
          className="w-full max-w-md h-auto object-contain drop-shadow-xl"
        />
      </div>
    </motion.section>
  )
}
