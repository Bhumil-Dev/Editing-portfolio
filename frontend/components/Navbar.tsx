'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'Home',     href: '#home' },
  { label: 'About',    href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work',     href: '#portfolio' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Contact',  href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const [active, setActive]     = useState('')

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { threshold: 0.4 }
    )
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-[50] transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          padding: scrolled ? '12px 0' : '20px 0',
        }}
      >
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">

          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center transition-all group-hover:bg-indigo-500"
              style={{ boxShadow: '0 0 16px rgba(99,102,241,0.3)' }}>
              <span className="text-white text-xs font-bold">BP</span>
            </div>
            <span className="hidden sm:block text-white font-semibold text-sm tracking-wide">
              Bhumil<span className="text-indigo-400">.</span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-7">
            {links.map(l => {
              const isActive = active === l.href.replace('#', '')
              return (
                <li key={l.label}>
                  <a href={l.href}
                    className="text-sm transition-colors duration-200 relative group"
                    style={{ color: isActive ? '#a5b4fc' : 'rgba(255,255,255,0.5)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = isActive ? '#a5b4fc' : 'rgba(255,255,255,0.5)')}>
                    {l.label}
                    <span className="absolute -bottom-0.5 left-0 h-px bg-indigo-400 transition-all duration-300"
                      style={{ width: isActive ? '100%' : '0%' }} />
                  </a>
                </li>
              )
            })}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Hire Me — desktop */}
            <a href="#contact"
              className="hidden md:flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all"
              style={{ background: '#6366f1', fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#4f46e5')}
              onMouseLeave={e => (e.currentTarget.style.background = '#6366f1')}>
              Hire Me
            </a>

            {/* Hamburger — mobile */}
            <button onClick={() => setOpen(!open)}
              className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 p-1" aria-label="Menu">
              <motion.span animate={open ? { rotate: 45, y: 7 }  : { rotate: 0, y: 0 }}  transition={{ duration: 0.2 }} className="w-full h-0.5 bg-white rounded-full block origin-center" />
              <motion.span animate={open ? { opacity: 0 }         : { opacity: 1 }}        transition={{ duration: 0.15 }} className="w-full h-0.5 bg-white rounded-full block" />
              <motion.span animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}  transition={{ duration: 0.2 }} className="w-full h-0.5 bg-white rounded-full block origin-center" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[40] flex flex-col items-center justify-center gap-5"
            style={{ background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(20px)' }}
          >
            {links.map((l, i) => (
              <motion.a key={l.label} href={l.href}
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setOpen(false)}
                className="text-2xl font-semibold transition-colors"
                style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#a5b4fc')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}>
                {l.label}
              </motion.a>
            ))}
            <motion.a href="#contact"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              onClick={() => setOpen(false)}
              className="mt-4 px-8 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: '#6366f1', fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}>
              Hire Me
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
