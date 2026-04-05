'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loader() {
  const [mounted, setMounted] = useState(false)
  const [show, setShow]       = useState(true)
  const [pct, setPct]         = useState(0)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    let p = 0
    const iv = setInterval(() => {
      p += Math.random() * 15 + 3
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => setShow(false), 400) }
      setPct(Math.round(p))
    }, 60)
    return () => clearInterval(iv)
  }, [mounted])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
          style={{ background: '#0a0a0a' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-8"
            style={{ boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}
          >
            <span className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}>BP</span>
          </motion.div>

          {/* Name */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-center mb-8">
            <p className="text-white font-semibold text-lg tracking-wide" style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}>
              Bhumil Prajapati
            </p>
            <p className="text-xs mt-1 tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
              VIDEO EDITOR & DEVELOPER
            </p>
          </motion.div>

          {/* Progress */}
          <div className="w-48 space-y-2">
            <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div className="h-full rounded-full bg-indigo-500"
                style={{ width: `${pct}%`, transition: 'width 0.08s linear' }} />
            </div>
            <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{pct}%</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
