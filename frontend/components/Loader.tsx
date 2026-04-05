'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

export default function Loader() {
  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(true)
  const [pct, setPct] = useState(0)
  const [phase, setPhase] = useState<'assembling' | 'loading' | 'done'>('assembling')
  const textRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  // Prevent SSR mismatch
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return

    // Phase 1: Logo assembly (0.8s)
    const tl = gsap.timeline()

    if (logoRef.current) {
      const parts = logoRef.current.querySelectorAll('.logo-part')
      tl.fromTo(parts,
        { opacity: 0, scale: 0, rotation: () => Math.random() * 360 - 180, x: () => (Math.random() - 0.5) * 200, y: () => (Math.random() - 0.5) * 200 },
        { opacity: 1, scale: 1, rotation: 0, x: 0, y: 0, stagger: 0.08, duration: 0.6, ease: 'back.out(1.7)' }
      )
    }

    // Phase 2: Loading bar after assembly
    tl.call(() => setPhase('loading'), [], 0.9)

    if (textRef.current) {
      const chars = textRef.current.querySelectorAll('.lc')
      tl.fromTo(chars,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.04, duration: 0.35, ease: 'power3.out' },
        0.9
      )
    }

    // Progress counter
    let p = 0
    const iv = setInterval(() => {
      p += Math.random() * 14 + 2
      if (p >= 100) {
        p = 100
        clearInterval(iv)
        setPhase('done')
        setTimeout(() => setShow(false), 500)
      }
      setPct(Math.round(p))
    }, 70)

    return () => { clearInterval(iv); tl.kill() }
  }, [mounted])

  if (!mounted) return null

  const name1 = 'BHUMIL'
  const name2 = 'PRAJAPATI'

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#030712] overflow-hidden"
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Grid */}
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

          {/* Energy pulse rings */}
          {phase === 'assembling' && [1, 2, 3].map(i => (
            <motion.div key={i}
              className="absolute rounded-full border border-cyan/20"
              initial={{ width: 0, height: 0, opacity: 0.8 }}
              animate={{ width: i * 120, height: i * 120, opacity: 0 }}
              transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }}
            />
          ))}

          {/* Logo assembly */}
          <div ref={logoRef} className="relative w-32 h-32 mb-8 flex items-center justify-center">
            {/* Outer ring */}
            <div className="logo-part absolute inset-0 rounded-full border border-cyan/20" />
            {/* Mid ring spinning */}
            <motion.div
              className="logo-part absolute inset-3 rounded-full border border-purple-400/30"
              animate={phase !== 'assembling' ? { rotate: 360 } : {}}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
            {/* Inner ring counter-spin */}
            <motion.div
              className="logo-part absolute inset-6 rounded-full border-2 border-cyan/60"
              animate={phase !== 'assembling' ? { rotate: -360 } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            {/* Center dot */}
            <motion.div
              className="logo-part w-3 h-3 rounded-full bg-cyan"
              animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ boxShadow: '0 0 20px #00F5FF, 0 0 40px #00F5FF40' }}
            />
            {/* Percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-cyan font-mono text-xs font-bold mt-1">{pct}%</span>
            </div>
          </div>

          {/* Name */}
          <div ref={textRef} className="flex flex-col items-center gap-1 mb-2">
            <div className="flex gap-1">
              {name1.split('').map((c, i) => (
                <span key={i} className="lc font-display text-2xl text-white tracking-[0.3em] opacity-0">{c}</span>
              ))}
            </div>
            <div className="flex gap-1">
              {name2.split('').map((c, i) => (
                <span key={i} className="lc font-display text-2xl tracking-[0.3em] opacity-0" style={{ color: '#00F5FF99' }}>{c}</span>
              ))}
            </div>
          </div>

          <p className="text-white/20 font-mono text-xs tracking-[0.5em] mb-8">VIDEO EDITOR & DEVELOPER</p>

          {/* Progress bar */}
          <div className="w-56 h-px bg-white/5 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, #00F5FF, #7B2FBE, #00FF88)',
                boxShadow: '0 0 8px #00F5FF80',
              }}
              transition={{ duration: 0.08 }}
            />
          </div>

          {/* Corner brackets */}
          {[
            'top-6 left-6 border-t border-l',
            'top-6 right-6 border-t border-r',
            'bottom-6 left-6 border-b border-l',
            'bottom-6 right-6 border-b border-r',
          ].map((cls, i) => (
            <div key={i} className={`absolute w-5 h-5 border-cyan/30 ${cls}`} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
