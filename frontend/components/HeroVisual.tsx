'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Animated code lines data
const codeLines = [
  { text: 'const bhumil = {',         color: '#e2e8f0', indent: 0, delay: 0 },
  { text: '  role: "Video Editor",',  color: '#a78bfa', indent: 1, delay: 0.1 },
  { text: '  stack: "MERN",',         color: '#6ee7b7', indent: 1, delay: 0.2 },
  { text: '  passion: "Storytelling"',color: '#fbbf24', indent: 1, delay: 0.3 },
  { text: '}',                         color: '#e2e8f0', indent: 0, delay: 0.4 },
  { text: '',                          color: '',        indent: 0, delay: 0.45 },
  { text: 'bhumil.createMagic()',      color: '#818cf8', indent: 0, delay: 0.5 },
  { text: '// ✓ Output: Amazing work', color: '#4ade80', indent: 0, delay: 0.6 },
]

// Floating stat cards — now dynamic
const badges = [
  { label: 'Premiere Pro', color: '#9999FF', x: -20, y: -30, delay: 0.8 },
  { label: 'React',        color: '#61DAFB', x: 20,  y: 20,  delay: 1.0 },
  { label: 'After Effects',color: '#9999FF', x: -10, y: 60,  delay: 1.2 },
  { label: 'Node.js',      color: '#68A063', x: 15,  y: -60, delay: 1.4 },
]

export default function HeroVisual() {
  const [stats, setStats] = useState({ projects: 50, years: 5 })

  useEffect(() => {
    fetch(`${API}/api/stats`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setStats({ projects: d.data.projects || 50, years: d.data.years || 5 })
        }
      })
      .catch(() => {})
  }, [])

  const floatStats = [
    { value: `${stats.projects}+`, label: 'Projects', color: '#6366f1', pos: 'top-4 right-0',   delay: 0.9 },
    { value: `${stats.years}+`,   label: 'Yrs Exp',  color: '#10b981', pos: 'bottom-8 left-0', delay: 1.1 },
  ]
  return (
    <div className="relative w-full h-[480px] flex items-center justify-center select-none">

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 70%)' }} />

      {/* ── Main code editor card ── */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-sm"
      >
        {/* Editor window */}
        <div className="rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: '#0f0f17',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)',
          }}>

          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b"
            style={{ background: '#161622', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>portfolio.js</span>
            {/* Blinking cursor indicator */}
            <motion.div className="ml-auto w-1.5 h-3.5 rounded-sm bg-indigo-400"
              animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
          </div>

          {/* Code content */}
          <div className="p-5 font-mono text-sm space-y-1.5">
            {codeLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: line.delay + 0.5 }}
                className="flex items-center gap-2"
              >
                {/* Line number */}
                <span className="w-4 text-right text-xs flex-shrink-0"
                  style={{ color: 'rgba(255,255,255,0.15)' }}>
                  {line.text ? i + 1 : ''}
                </span>
                {/* Code */}
                <span style={{
                  color: line.color || 'transparent',
                  paddingLeft: line.indent * 16,
                  letterSpacing: '0.02em',
                }}>
                  {line.text}
                </span>
              </motion.div>
            ))}

            {/* Animated typing cursor */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center gap-2 mt-1"
            >
              <span className="w-4" />
              <motion.span className="inline-block w-2 h-4 bg-indigo-400 rounded-sm"
                animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
            </motion.div>
          </div>

          {/* Bottom status bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex items-center justify-between px-4 py-2 border-t"
            style={{ background: '#6366f1', borderColor: 'rgba(255,255,255,0.1)' }}>
            <span className="text-white text-xs font-medium">✓ Ready to create</span>
            <span className="text-white/70 text-xs">JavaScript</span>
          </motion.div>
        </div>

        {/* ── Floating stat cards ── */}
        {floatStats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
            transition={{
              opacity: { delay: s.delay, duration: 0.4 },
              scale:   { delay: s.delay, duration: 0.4 },
              y:       { delay: s.delay + 0.4, duration: 3 + i, repeat: Infinity, ease: 'easeInOut' },
            }}
            className={`absolute ${s.pos} px-4 py-3 rounded-xl text-center`}
            style={{
              background: 'rgba(15,15,23,0.95)',
              border: `1px solid ${s.color}30`,
              backdropFilter: 'blur(12px)',
              boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px ${s.color}20`,
              minWidth: 80,
            }}
          >
            <p className="font-bold text-lg leading-none" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</p>
          </motion.div>
        ))}

        {/* ── Floating skill badges ── */}
        {badges.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: [b.y, b.y - 8, b.y],
            }}
            transition={{
              opacity: { delay: b.delay, duration: 0.4 },
              y: { delay: b.delay + 0.3, duration: 2.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="absolute px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(15,15,23,0.9)',
              border: `1px solid ${b.color}40`,
              color: b.color,
              backdropFilter: 'blur(8px)',
              left: i % 2 === 0 ? '-60px' : 'auto',
              right: i % 2 !== 0 ? '-60px' : 'auto',
              top: `${20 + i * 22}%`,
              whiteSpace: 'nowrap',
            }}
          >
            {b.label}
          </motion.div>
        ))}
      </motion.div>

      {/* ── Orbiting ring ── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 340, height: 340,
          border: '1px dashed rgba(99,102,241,0.15)',
          top: '50%', left: '50%',
          marginTop: -170, marginLeft: -170,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {/* Dot on ring */}
        <motion.div className="absolute w-2.5 h-2.5 rounded-full bg-indigo-500"
          style={{ top: -5, left: '50%', marginLeft: -5, boxShadow: '0 0 10px #6366f1' }} />
      </motion.div>

      {/* ── Particle dots ── */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 3, height: 3,
            background: i % 2 === 0 ? '#6366f1' : '#8b5cf6',
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
            opacity: 0.4,
          }}
          animate={{ y: [0, -12, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        />
      ))}
    </div>
  )
}
