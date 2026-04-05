'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Skill } from '@/data'

gsap.registerPlugin(ScrollTrigger)

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Fallback static skills shown when DB is empty
const FALLBACK_SKILLS = [
  { _id: '1',  name: 'Premiere Pro',  logo: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg',  color: '#9999FF', category: 'video', order: 0 },
  { _id: '2',  name: 'After Effects', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg', color: '#9999FF', category: 'video', order: 1 },
  { _id: '3',  name: 'DaVinci Resolve',logo:'https://upload.wikimedia.org/wikipedia/commons/9/90/DaVinci_Resolve_17_logo.svg',    color: '#FF6B6B', category: 'video', order: 2 },
  { _id: '4',  name: 'CapCut',        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Capcut-logo.svg/512px-Capcut-logo.svg.png', color: '#ffffff', category: 'video', order: 3 },
  { _id: '5',  name: 'Cinema 4D',     logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Cinema4D_Logo.svg/512px-Cinema4D_Logo.svg.png', color: '#FF6B35', category: 'video', order: 4 },
  { _id: '6',  name: 'React',         logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',                 color: '#61DAFB', category: 'web',   order: 5 },
  { _id: '7',  name: 'Next.js',       logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg',               color: '#ffffff', category: 'web',   order: 6 },
  { _id: '8',  name: 'Node.js',       logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg',              color: '#68A063', category: 'web',   order: 7 },
  { _id: '9',  name: 'MongoDB',       logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg',              color: '#47A248', category: 'web',   order: 8 },
  { _id: '10', name: 'Express',       logo: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png',                 color: '#ffffff', category: 'web',   order: 9 },
  { _id: '11', name: 'Three.js',      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Three.js_Icon.svg',             color: '#00F5FF', category: 'web',   order: 10 },
  { _id: '12', name: 'TypeScript',    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg',      color: '#3178C6', category: 'web',   order: 11 },
  { _id: '13', name: 'Figma',         logo: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',                color: '#F24E1E', category: 'design',order: 12 },
  { _id: '14', name: 'GSAP',          logo: 'https://cdn.worldvectorlogo.com/logos/gsap-greensock.svg',                          color: '#88CE02', category: 'web',   order: 13 },
]

function SkillCard({ skill, index, inView }: { skill: Skill; index: number; inView: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3
    gsap.to(el, { x, y, duration: 0.3, ease: 'power2.out' })
  }
  const onMouseLeave = () => {
    gsap.to(cardRef.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
  }

  const scatter = {
    x: (Math.random() - 0.5) * 400,
    y: (Math.random() - 0.5) * 300,
    rotate: (Math.random() - 0.5) * 180,
    scale: 0.3,
    opacity: 0,
  }

  return (
    <motion.div
      ref={cardRef}
      initial={scatter}
      animate={inView ? {
        x: 0, y: 0, rotate: 0, scale: 1, opacity: 1,
        transition: { type: 'spring', stiffness: 120, damping: 14, delay: index * 0.06 }
      } : scatter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="group relative flex flex-col items-center gap-3 p-4 rounded-2xl glass border border-white/5 cursor-pointer select-none"
      style={{ willChange: 'transform' }}
      whileHover={{ scale: 1.12, zIndex: 10 }}
    >
      {/* Glow bg */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
        style={{ background: `radial-gradient(circle, ${skill.color}25, transparent 70%)` }} />

      {/* Logo image */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2.5 + index * 0.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.15 }}
        className="relative z-10 w-10 h-10 flex items-center justify-center"
      >
        <img
          src={skill.logo?.startsWith('/uploads') ? `${API}${skill.logo}` : skill.logo}
          alt={skill.name}
          className="w-full h-full object-contain drop-shadow-lg"
          style={{ filter: skill.color === '#ffffff' ? 'brightness(0) invert(1)' : 'none' }}
          onError={e => {
            // fallback to first letter if image fails
            const t = e.currentTarget as HTMLImageElement
            t.style.display = 'none'
            const parent = t.parentElement
            if (parent && !parent.querySelector('.fallback-text')) {
              const span = document.createElement('span')
              span.className = 'fallback-text text-2xl font-bold'
              span.style.color = skill.color
              span.textContent = skill.name[0]
              parent.appendChild(span)
            }
          }}
        />
      </motion.div>

      <span className="relative z-10 font-mono text-xs text-white/50 group-hover:text-white transition-colors text-center leading-tight">
        {skill.name}
      </span>

      {/* Border glow */}
      <div className="absolute inset-0 rounded-2xl border opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ borderColor: `${skill.color}40`, boxShadow: `0 0 20px ${skill.color}20` }} />
    </motion.div>
  )
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)
  const inView     = useInView(gridRef, { once: true, margin: '-100px' })

  useEffect(() => {
    fetch(`${API}/api/skills`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.length > 0) setSkills(d.data)
        else setSkills(FALLBACK_SKILLS)
      })
      .catch(() => setSkills(FALLBACK_SKILLS))
  }, [])

  const displaySkills = skills.length > 0 ? skills : FALLBACK_SKILLS
  const tools = displaySkills.map(s => s.name)

  return (
    <section id="skills" ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-100 to-dark" />

      {/* Ambient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7B2FBE, transparent)' }}
        animate={{ scale: [1, 1.3, 1], x: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00F5FF, transparent)' }}
        animate={{ scale: [1.2, 1, 1.2], x: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-purple-400" />
            <span className="text-purple-400 font-mono text-xs tracking-[0.4em]">EXPERTISE</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-purple-400" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold text-white"
          >
            My <span className="neon-text">Skills</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/30 font-mono text-sm mt-4"
          >
            Hover to interact · Scroll to assemble
          </motion.p>
        </div>

        {/* Skill icons grid */}
        <div ref={gridRef} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 mb-16">
          {displaySkills.map((skill, i) => (
            <SkillCard key={skill._id} skill={skill} index={i} inView={inView} />
          ))}
        </div>

        {/* Category labels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid grid-cols-3 gap-4 mb-16"
        >
          {[
            { label: 'Web Dev',  count: '7', color: '#00F5FF', desc: 'Full-stack MERN + modern frameworks' },
            { label: 'Video',    count: '5', color: '#9999FF', desc: 'Cinematic editing & color grading' },
            { label: 'Design',   count: '2', color: '#F24E1E', desc: 'UI/UX & motion design tools' },
          ].map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass p-5 rounded-xl border border-white/5 text-center group hover:border-white/10 transition-colors"
            >
              <div className="font-display font-bold text-3xl mb-1" style={{ color: cat.color }}>{cat.count}</div>
              <div className="text-white font-mono text-xs tracking-widest mb-2">{cat.label.toUpperCase()}</div>
              <div className="text-white/30 text-xs">{cat.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Marquee */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="overflow-hidden">
          <p className="text-center text-white/20 font-mono text-xs tracking-[0.4em] mb-6">TOOLS & TECHNOLOGIES</p>
          <div className="flex gap-8 marquee-track whitespace-nowrap">
            {[...tools, ...tools].map((t, i) => (
              <span key={i} className="text-white/20 font-mono text-sm hover:text-cyan/60 transition-colors cursor-default flex-shrink-0">
                <span className="text-cyan/20 mr-2">◆</span>{t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
