'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

const HeroVisual     = dynamic(() => import('./HeroVisual'),     { ssr: false })
const HeroVisualEdit = dynamic(() => import('./HeroVisualEdit'), { ssr: false })

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
  // Toggle between dev visual and editing visual every 6s
  const [showEdit, setShowEdit] = useState(false)

  useEffect(() => {
    fetch(`${API}/api/profile`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) setProfile({
          name:    d.data.name?.split(' ')[0] || 'Bhumil',
          title:   d.data.title   || 'Video Editor & MERN Stack Developer',
          tagline: d.data.about   || d.data.tagline || 'I create professional video edits, motion graphics, and modern web applications.',
        })
      }).catch(() => {})
  }, [])

  // Auto-switch visuals
  useEffect(() => {
    const t = setInterval(() => setShowEdit(p => !p), 7000)
    return () => clearInterval(t)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: '#0a0a0a' }}>

      {/* Static glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 65% 50%, rgba(99,102,241,0.07) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen py-24 lg:py-0">

          {/* ── LEFT — Animated Visuals (toggle) ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col items-center justify-center order-2 lg:order-1 gap-4"
          >
            {/* Visual switcher tabs */}
            <div className="flex items-center gap-2 p-1 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {[
                { label: '💻 Dev',    val: false },
                { label: '🎬 Editor', val: true  },
              ].map(tab => (
                <button key={String(tab.val)} onClick={() => setShowEdit(tab.val)}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                  style={{
                    background: showEdit === tab.val ? '#6366f1' : 'transparent',
                    color: showEdit === tab.val ? '#fff' : 'rgba(255,255,255,0.4)',
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Visual with crossfade */}
            <div className="relative w-full">
              <AnimatePresence mode="wait">
                {showEdit ? (
                  <motion.div key="edit"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}>
                    <HeroVisualEdit />
                  </motion.div>
                ) : (
                  <motion.div key="dev"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}>
                    <HeroVisual />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── RIGHT — Content ── */}
          <div className="order-1 lg:order-2 space-y-5">

            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full"
              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-indigo-300 text-xs font-medium">Available for work</span>
            </motion.div>

            {/* Heading */}
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold text-white leading-[1.08] tracking-tight"
              style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}>
              Hi, I&apos;m{' '}
              <span style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {profile.name}
              </span>
            </motion.h1>

            {/* Title */}
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
              className="text-lg sm:text-xl font-medium leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.55)' }}>
              {profile.title}
            </motion.p>

            {/* Description */}
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
              className="text-base leading-relaxed max-w-md"
              style={{ color: 'rgba(255,255,255,0.35)' }}>
              {profile.tagline}
            </motion.p>

            {/* Services */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {services.map((s, i) => (
                <motion.div key={s.text}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  whileHover={{ background: 'rgba(99,102,241,0.08)', borderColor: 'rgba(99,102,241,0.2)' }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-default transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-sm flex-shrink-0">{s.icon}</span>
                  <span className="text-xs font-medium leading-tight" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {s.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Buttons */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
              className="flex flex-wrap gap-3 pt-2">
              <motion.a href="#portfolio" whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: '#6366f1', fontFamily: 'var(--font-poppins), Poppins, sans-serif', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#4f46e5')}
                onMouseLeave={e => (e.currentTarget.style.background = '#6366f1')}>
                View Portfolio
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
              <motion.a href="#contact" whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                style={{ border: '1.5px solid rgba(99,102,241,0.4)', color: '#a5b4fc', fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a5b4fc' }}>
                Hire Me
              </motion.a>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}
