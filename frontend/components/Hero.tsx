'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import gsap from 'gsap'
import dynamic from 'next/dynamic'

// Load Three.js canvas only on client — avoids SSR crash
const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false })

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface Profile {
  name: string
  title: string
  tagline: string
  about: string
  profilePhoto: string
}

export default function Hero() {
  const headlineRef  = useRef<HTMLDivElement>(null)
  const [profile, setProfile] = useState<Profile>({
    name:         'Bhumil Prajapati',
    title:        'Video Editor & MERN Stack Developer',
    tagline:      'I Turn Ideas Into Visual Experiences',
    about:        '',
    profilePhoto: '',
  })

  // Fetch profile from API
  useEffect(() => {
    fetch(`${API}/api/profile`)
      .then(r => r.json())
      .then(d => { if (d.success && d.data) setProfile(d.data) })
      .catch(() => {})
  }, [])

  // GSAP headline entrance — runs after profile loads
  useEffect(() => {
    if (!headlineRef.current) return
    const words = headlineRef.current.querySelectorAll('.word')
    if (!words.length) return
    gsap.fromTo(words,
      { opacity: 0, y: 60, rotateX: -90 },
      { opacity: 1, y: 0, rotateX: 0, stagger: 0.12, duration: 1, delay: 1.2, ease: 'power4.out' }
    )
  }, [profile])

  // Split tagline into words for animation
  const taglineWords = (profile.tagline || 'I Turn Ideas Into Visual Experiences').split(' ')
  // Build TypeAnimation sequence from title
  const typeSequence = [
    profile.title || 'Video Editor & MERN Stack Developer', 2500,
    'Motion Graphics Artist', 2000,
    'Three.js & GSAP Specialist', 2000,
    'Creative Storyteller', 2000,
  ]

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <HeroCanvas />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-dark/60 to-dark z-[1]" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-dark to-transparent z-[1]" />

      {/* Glowing orbs */}
      <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00F5FF, transparent)' }}
        animate={{ scale: [1,1.3,1], opacity:[0.05,0.15,0.05] }} transition={{ duration:6, repeat:Infinity }} />
      <motion.div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10 z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7B2FBE, transparent)' }}
        animate={{ scale: [1.2,1,1.2], opacity:[0.08,0.18,0.08] }} transition={{ duration:8, repeat:Infinity }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">

        {/* Available badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-2 glass-accent px-4 py-2 rounded-full mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
          <span className="text-accent-light font-mono text-xs tracking-[0.2em]">AVAILABLE FOR PROJECTS</span>
        </motion.div>

        {/* Dynamic headline from tagline */}
        <div ref={headlineRef} className="perspective-1000 mb-6">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-tight">
            {taglineWords.slice(0, Math.ceil(taglineWords.length / 2)).map((w, i) => (
              <span key={i} className="word inline-block opacity-0 mr-3">{w}</span>
            ))}
            <br />
            {taglineWords.slice(Math.ceil(taglineWords.length / 2)).map((w, i) => (
              <span key={i} className="word inline-block opacity-0 mr-3 accent-text text-glow">{w}</span>
            ))}
          </h1>
        </div>

        {/* Dynamic type animation from title */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
          className="text-white/40 font-mono text-sm md:text-base mb-10 h-7"
        >
          <span className="text-accent-light/60">{'> '}</span>
          <TypeAnimation
            sequence={typeSequence}
            wrapper="span" speed={50} repeat={Infinity}
          />
          <span className="text-accent-light animate-pulse">_</span>
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#portfolio" className="btn-primary">View My Work</a>
          <a href="#contact"   className="btn-outline">Let&apos;s Talk →</a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
          className="hidden sm:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="text-white/20 font-mono text-xs tracking-[0.3em]">SCROLL</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-10 bg-gradient-to-b from-accent/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  )
}
