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

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-[50] transition-all duration-300 ${
          scrolled ? 'glass py-3 shadow-xl shadow-black/40' : 'py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg animated-border p-px">
              <div className="w-full h-full rounded-lg bg-dark flex items-center justify-center">
                <span className="text-white text-xs font-bold">BP</span>
              </div>
            </div>
            <span className="hidden sm:block text-white font-semibold text-sm tracking-wide">
              Bhumil<span className="text-accent-light">.</span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-7">
            {links.map(l => (
              <li key={l.label}>
                <a href={l.href}
                  className="text-white/50 hover:text-white text-sm transition-colors duration-200 relative group">
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent-light group-hover:w-full transition-all duration-300" />
                </a>
              </li>
            ))}
          </ul>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <a href="#contact"
              className="hidden md:flex btn-primary text-xs py-2 px-5">
              Hire Me
            </a>
            <button onClick={() => setOpen(!open)}
              className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 p-1" aria-label="Menu">
              <motion.span animate={open ? { rotate: 45, y: 7 }  : { rotate: 0, y: 0 }}  transition={{ duration: 0.2 }} className="w-full h-0.5 bg-white rounded-full block origin-center" />
              <motion.span animate={open ? { opacity: 0 }         : { opacity: 1 }}        transition={{ duration: 0.15 }} className="w-full h-0.5 bg-white rounded-full block" />
              <motion.span animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}  transition={{ duration: 0.2 }} className="w-full h-0.5 bg-white rounded-full block origin-center" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[40] bg-dark/97 backdrop-blur-2xl flex flex-col items-center justify-center gap-5"
          >
            {links.map((l, i) => (
              <motion.a key={l.label} href={l.href}
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setOpen(false)}
                className="text-2xl font-semibold text-white/80 hover:text-white transition-colors">
                {l.label}
              </motion.a>
            ))}
            <motion.a href="#contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }} onClick={() => setOpen(false)}
              className="mt-4 btn-primary">
              Hire Me
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
