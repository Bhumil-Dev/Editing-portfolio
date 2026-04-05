'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import type { Skill } from '@/data'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const FALLBACK: Skill[] = [
  { _id: '1',  name: 'Premiere Pro',   logo: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg',  color: '#9999FF', category: 'video',  order: 0 },
  { _id: '2',  name: 'After Effects',  logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg', color: '#9999FF', category: 'video',  order: 1 },
  { _id: '3',  name: 'DaVinci Resolve',logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/DaVinci_Resolve_17_logo.svg',    color: '#FF6B6B', category: 'video',  order: 2 },
  { _id: '4',  name: 'CapCut',         logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Capcut-logo.svg/512px-Capcut-logo.svg.png', color: '#ffffff', category: 'video', order: 3 },
  { _id: '5',  name: 'Cinema 4D',      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Cinema4D_Logo.svg/512px-Cinema4D_Logo.svg.png', color: '#FF6B35', category: 'video', order: 4 },
  { _id: '6',  name: 'React',          logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',                 color: '#61DAFB', category: 'web',   order: 5 },
  { _id: '7',  name: 'Next.js',        logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg',               color: '#ffffff', category: 'web',   order: 6 },
  { _id: '8',  name: 'Node.js',        logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg',              color: '#68A063', category: 'web',   order: 7 },
  { _id: '9',  name: 'MongoDB',        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg',              color: '#47A248', category: 'web',   order: 8 },
  { _id: '10', name: 'TypeScript',     logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg',      color: '#3178C6', category: 'web',   order: 9 },
  { _id: '11', name: 'Three.js',       logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Three.js_Icon.svg',             color: '#ffffff', category: 'web',   order: 10 },
  { _id: '12', name: 'Figma',          logo: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',                color: '#F24E1E', category: 'design',order: 11 },
]

function SkillCard({ skill, index, inView }: { skill: Skill; index: number; inView: boolean }) {
  const scatter = { x: (Math.random()-0.5)*300, y: (Math.random()-0.5)*200, rotate: (Math.random()-0.5)*120, scale: 0.4, opacity: 0 }

  return (
    <motion.div
      initial={scatter}
      animate={inView ? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 14, delay: index * 0.05 } } : scatter}
      whileHover={{ scale: 1.1, y: -4 }}
      className="flex flex-col items-center gap-2.5 p-4 rounded-xl cursor-default transition-colors duration-200"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${skill.color}40`; e.currentTarget.style.background = `${skill.color}08` }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
    >
      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5 + index * 0.15, repeat: Infinity, ease: 'easeInOut', delay: index * 0.1 }}
        className="w-10 h-10 flex items-center justify-center">
        <img src={skill.logo?.startsWith('/uploads') ? `${API}${skill.logo}` : skill.logo}
          alt={skill.name} className="w-full h-full object-contain"
          style={{ filter: skill.color === '#ffffff' ? 'brightness(0) invert(1)' : 'none' }}
          onError={e => { const t = e.currentTarget as HTMLImageElement; t.style.display = 'none'; const p = t.parentElement; if (p) { const s = document.createElement('span'); s.style.color = skill.color; s.style.fontSize = '24px'; s.style.fontWeight = 'bold'; s.textContent = skill.name[0]; p.appendChild(s) } }}
        />
      </motion.div>
      <span className="text-xs font-medium text-center leading-tight" style={{ color: 'rgba(255,255,255,0.45)' }}>{skill.name}</span>
    </motion.div>
  )
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const gridRef = useRef<HTMLDivElement>(null)
  const inView  = useInView(gridRef, { once: true, margin: '-80px' })

  useEffect(() => {
    fetch(`${API}/api/skills`).then(r => r.json())
      .then(d => { setSkills(d.success && d.data.length > 0 ? d.data : FALLBACK) })
      .catch(() => setSkills(FALLBACK))
  }, [])

  const list = skills.length > 0 ? skills : FALLBACK

  return (
    <section id="skills" className="section-padding relative" style={{ background: '#0d0d0d' }}>
      <div className="max-w-5xl mx-auto px-6">

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-indigo-500" />
          <span className="text-indigo-400 text-xs font-medium tracking-widest uppercase">Expertise</span>
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-white mb-3"
          style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}>
          My <span style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Skills</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
          className="text-sm mb-10" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Hover to interact · Scroll to assemble
        </motion.p>

        <div ref={gridRef} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {list.map((skill, i) => <SkillCard key={skill._id} skill={skill} index={i} inView={inView} />)}
        </div>

        {/* Marquee */}
        <div className="mt-14 overflow-hidden">
          <p className="text-center text-xs mb-4 tracking-widest" style={{ color: 'rgba(255,255,255,0.15)' }}>TOOLS & TECHNOLOGIES</p>
          <div className="flex gap-8 marquee-track whitespace-nowrap">
            {[...list, ...list].map((s, i) => (
              <span key={i} className="text-xs cursor-default flex-shrink-0 transition-colors"
                style={{ color: 'rgba(255,255,255,0.18)' }}
                onMouseEnter={e => (e.currentTarget.style.color = s.color)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.18)')}>
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
