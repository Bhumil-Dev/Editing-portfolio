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
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
        className={`fixed top-0 left-0 right-0 z-[50] transition-all duration-500 ${
          scrolled ? 'glass py-3 shadow-lg shadow-black/60' : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">

          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-full animated-border p-px">
              <div className="w-full h-full rounded-full bg-dark flex items-center justify-center">
                <span className="text-cyan font-display text-xs font-bold">BP</span>
              </div>
            </div>
            <span className="hidden sm:block font-display text-white text-sm tracking-[0.2em]">
              BHUMIL<span className="text-cyan">.</span>
            </span>
          </a>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onMouseEnter={() => setActive(l.label)}
                  onMouseLeave={() => setActive('')}
                  className="relative text-white/50 hover:text-cyan text-sm font-mono tracking-wider transition-colors duration-300"
                >
                  <span className="text-cyan/40 text-xs mr-1">{'>'}</span>
                  {l.label}
                  <span className={`absolute -bottom-1 left-0 h-px bg-gradient-to-r from-cyan to-purple-400 transition-all duration-300 ${active === l.label ? 'w-full' : 'w-0'}`} />
                </a>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* HIRE ME — desktop only */}
            <a
              href="#contact"
              className="hidden md:flex items-center gap-2 btn-outline text-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
              HIRE ME
            </a>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden flex flex-col justify-center gap-[5px] w-9 h-9 p-1.5"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full h-[2px] bg-cyan rounded-full block origin-center"
              />
              <motion.span
                animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="w-full h-[2px] bg-cyan rounded-full block"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full h-[2px] bg-cyan rounded-full block origin-center"
              />
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
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[40] bg-dark/97 backdrop-blur-2xl flex flex-col items-center justify-center gap-6 grid-bg"
          >
            {links.map((l, i) => (
              <motion.a
                key={l.label}
                href={l.href}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => setOpen(false)}
                className="font-display text-2xl text-white hover:text-cyan transition-colors tracking-widest"
              >
                <span className="text-cyan/40 text-base mr-2">0{i + 1}.</span>
                {l.label}
              </motion.a>
            ))}

            {/* Hire me inside mobile menu */}
            <motion.a
              href="#contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => setOpen(false)}
              className="mt-4 px-8 py-3 border border-cyan/40 text-cyan font-mono text-sm tracking-widest hover:bg-cyan hover:text-dark transition-all duration-300"
            >
              HIRE ME
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
