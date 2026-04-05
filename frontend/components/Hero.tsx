'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const services = [
  { icon: '🎬', text: 'Product Video Editing' },
  { icon: '✨', text: 'Motion Graphics' },
  { icon: '▶️', text: 'YouTube Video Editing' },
  { icon: '📱', text: 'Instagram Reels Editing' },
  { icon: '📣', text: 'Social Media Management' },
  { icon: '💻', text: 'MERN Stack Web Development' },
]

interface Profile { name: string; title: string; tagline: string }

export default function Hero() {
  const [profile, setProfile] = useState<Profile>({
    name:    'Bhumil',
    title:   'Video Editor & MERN Stack Developer',
    tagline: 'I create professional video edits, motion graphics, and modern web applications.',
  })

  useEffect(() => {
    fetch(`${API}/api/profile`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setProfile({
            name:    d.data.name?.split(' ')[0] || 'Bhumil',
            title:   d.data.title   || 'Video Editor & MERN Stack Developer',
            tagline: d.data.about   || d.data.tagline || 'I create professional video edits, motion graphics, and modern web applications.',
          })
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Subtle radial glow — static, no motion */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(99,102,241,0.07) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-24 lg:py-0">

          {/* ── LEFT — Illustration ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex items-center justify-center order-2 lg:order-1"
          >
            <div className="relative w-full max-w-sm lg:max-w-md">
              {/* Floating card behind illustration */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                {/* Main illustration SVG */}
                <svg viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-2xl">
                  {/* Background circle */}
                  <circle cx="240" cy="240" r="220" fill="rgba(99,102,241,0.06)" />
                  <circle cx="240" cy="240" r="180" fill="rgba(99,102,241,0.04)" />

                  {/* Desk */}
                  <rect x="80" y="310" width="320" height="16" rx="8" fill="#1e1e2e" />
                  <rect x="100" y="326" width="12" height="60" rx="6" fill="#1e1e2e" />
                  <rect x="368" y="326" width="12" height="60" rx="6" fill="#1e1e2e" />

                  {/* Laptop base */}
                  <rect x="130" y="240" width="220" height="70" rx="8" fill="#2d2d3f" />
                  <rect x="140" y="248" width="200" height="54" rx="4" fill="#1a1a2e" />
                  {/* Screen glow */}
                  <rect x="144" y="252" width="192" height="46" rx="3" fill="#0f0f1a" />
                  <rect x="148" y="256" width="184" height="38" rx="2" fill="url(#screenGrad)" opacity="0.9" />

                  {/* Code lines on screen */}
                  <rect x="156" y="262" width="60" height="3" rx="1.5" fill="#6366f1" opacity="0.8" />
                  <rect x="156" y="270" width="100" height="3" rx="1.5" fill="#8b5cf6" opacity="0.6" />
                  <rect x="156" y="278" width="80" height="3" rx="1.5" fill="#10b981" opacity="0.7" />
                  <rect x="156" y="286" width="120" height="3" rx="1.5" fill="#6366f1" opacity="0.5" />

                  {/* Laptop lid */}
                  <path d="M130 240 L150 160 L330 160 L350 240 Z" fill="#2d2d3f" />
                  <path d="M138 238 L156 166 L324 166 L342 238 Z" fill="#1a1a2e" />
                  <rect x="160" y="170" width="160" height="62" rx="2" fill="url(#screenGrad2)" opacity="0.85" />

                  {/* Screen content */}
                  <rect x="168" y="178" width="50" height="3" rx="1.5" fill="#6366f1" opacity="0.9" />
                  <rect x="168" y="186" width="90" height="3" rx="1.5" fill="#8b5cf6" opacity="0.7" />
                  <rect x="168" y="194" width="70" height="3" rx="1.5" fill="#10b981" opacity="0.8" />
                  <rect x="168" y="202" width="110" height="3" rx="1.5" fill="#6366f1" opacity="0.6" />
                  <rect x="168" y="210" width="55" height="3" rx="1.5" fill="#f59e0b" opacity="0.7" />
                  <rect x="168" y="218" width="85" height="3" rx="1.5" fill="#8b5cf6" opacity="0.5" />

                  {/* Person body */}
                  <ellipse cx="240" cy="360" rx="55" ry="20" fill="#1a1a2e" opacity="0.4" />
                  {/* Torso */}
                  <rect x="205" y="270" width="70" height="80" rx="20" fill="#6366f1" />
                  {/* Collar */}
                  <path d="M225 270 L240 285 L255 270" fill="#4f46e5" />

                  {/* Left arm */}
                  <path d="M205 285 Q175 300 170 320" stroke="#f5d0a9" strokeWidth="18" strokeLinecap="round" fill="none" />
                  <circle cx="168" cy="324" r="10" fill="#f5d0a9" />

                  {/* Right arm */}
                  <path d="M275 285 Q305 300 310 320" stroke="#f5d0a9" strokeWidth="18" strokeLinecap="round" fill="none" />
                  <circle cx="312" cy="324" r="10" fill="#f5d0a9" />

                  {/* Head */}
                  <circle cx="240" cy="230" r="38" fill="#f5d0a9" />
                  {/* Hair */}
                  <path d="M202 220 Q205 190 240 188 Q275 190 278 220 Q270 205 240 204 Q210 205 202 220Z" fill="#2d1b00" />
                  {/* Eyes */}
                  <circle cx="228" cy="228" r="4" fill="#2d1b00" />
                  <circle cx="252" cy="228" r="4" fill="#2d1b00" />
                  <circle cx="229" cy="227" r="1.5" fill="#fff" />
                  <circle cx="253" cy="227" r="1.5" fill="#fff" />
                  {/* Smile */}
                  <path d="M230 240 Q240 248 250 240" stroke="#c0845a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  {/* Ears */}
                  <ellipse cx="202" cy="230" rx="6" ry="8" fill="#f5d0a9" />
                  <ellipse cx="278" cy="230" rx="6" ry="8" fill="#f5d0a9" />

                  {/* Floating badges */}
                  {/* Video badge */}
                  <g transform="translate(50, 140)">
                    <rect width="90" height="36" rx="18" fill="#1e1e2e" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
                    <circle cx="18" cy="18" r="10" fill="#6366f1" opacity="0.9" />
                    <text x="18" y="22" textAnchor="middle" fill="white" fontSize="10">▶</text>
                    <text x="52" y="22" fill="#e2e8f0" fontSize="11" fontWeight="600">Editor</text>
                  </g>

                  {/* Code badge */}
                  <g transform="translate(330, 120)">
                    <rect width="90" height="36" rx="18" fill="#1e1e2e" stroke="rgba(139,92,246,0.4)" strokeWidth="1" />
                    <circle cx="18" cy="18" r="10" fill="#8b5cf6" opacity="0.9" />
                    <text x="18" y="22" textAnchor="middle" fill="white" fontSize="9">{`</>`}</text>
                    <text x="52" y="22" fill="#e2e8f0" fontSize="11" fontWeight="600">Dev</text>
                  </g>

                  {/* Star badge */}
                  <g transform="translate(340, 300)">
                    <rect width="100" height="36" rx="18" fill="#1e1e2e" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
                    <circle cx="18" cy="18" r="10" fill="#10b981" opacity="0.9" />
                    <text x="18" y="22" textAnchor="middle" fill="white" fontSize="11">★</text>
                    <text x="52" y="22" fill="#e2e8f0" fontSize="11" fontWeight="600">5+ yrs</text>
                  </g>

                  <defs>
                    <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0f0f1a" />
                      <stop offset="100%" stopColor="#1a1a2e" />
                    </linearGradient>
                    <linearGradient id="screenGrad2" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0f0f1a" />
                      <stop offset="100%" stopColor="#1a1a2e" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            </div>
          </motion.div>

          {/* ── RIGHT — Text content ── */}
          <div className="order-1 lg:order-2 space-y-6">

            {/* Greeting badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-accent"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-indigo-300 text-xs font-medium tracking-wide">Available for work</span>
            </motion.div>

            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="font-poppins text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                Hi, I&apos;m{' '}
                <span className="accent-text">{profile.name}</span>
              </h1>
            </motion.div>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-lg sm:text-xl text-white/60 font-medium leading-relaxed"
            >
              {profile.title}
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="text-white/40 text-base leading-relaxed max-w-lg"
            >
              {profile.tagline}
            </motion.p>

            {/* Services list */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.55 }}
              className="grid grid-cols-2 gap-2"
            >
              {services.map((s, i) => (
                <motion.div
                  key={s.text}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
                  className="flex items-center gap-2.5 py-2 px-3 rounded-lg glass hover:glass-accent transition-all duration-200 group"
                >
                  <span className="text-base flex-shrink-0">{s.icon}</span>
                  <span className="text-white/60 text-xs font-medium group-hover:text-white/90 transition-colors leading-tight">
                    {s.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="flex flex-wrap gap-3 pt-2"
            >
              <a href="#portfolio" className="btn-primary">
                View Portfolio
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="#contact" className="btn-outline">
                Hire Me
              </a>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}
