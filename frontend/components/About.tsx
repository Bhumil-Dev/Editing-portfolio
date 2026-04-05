'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { useInView as useIO } from 'react-intersection-observer'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface Profile { name: string; title: string; about: string; profilePhoto: string; location: string }
interface StatsData { projects: number; clients: number; years: number; views: number }

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }

export default function About() {
  const { ref: countRef, inView } = useIO({ triggerOnce: true })
  const [profile, setProfile] = useState<Profile>({ name: 'Bhumil Prajapati', title: 'Video Editor & MERN Stack Developer', about: '', profilePhoto: '', location: 'India' })
  const [stats, setStats] = useState<StatsData>({ projects: 50, clients: 20, years: 3, views: 1 })

  useEffect(() => {
    fetch(`${API}/api/profile`).then(r => r.json()).then(d => { if (d.success && d.data) setProfile(d.data) }).catch(() => {})
    fetch(`${API}/api/stats`).then(r => r.json()).then(d => { if (d.success && d.data) setStats(d.data) }).catch(() => {})
  }, [])

  const initials = profile.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'BP'
  const about = profile.about || `Professional Video Editor and MERN Stack Developer based in ${profile.location || 'India'}. Creating cinematic content that drives real results.`

  const statItems = [
    { value: stats.projects, label: 'Projects', suffix: '+' },
    { value: stats.clients,  label: 'Clients',  suffix: '+' },
    { value: stats.years,    label: 'Years Exp', suffix: '+' },
    { value: stats.views,    label: 'M+ Views',  suffix: 'M+' },
  ]

  return (
    <section id="about" className="section-padding relative" style={{ background: '#0d0d0d' }}>
      <div className="max-w-5xl mx-auto px-6">

        {/* Label */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex items-center gap-3 mb-12">
          <div className="w-8 h-px bg-indigo-500" />
          <span className="text-indigo-400 text-xs font-medium tracking-widest uppercase">About Me</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — photo */}
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden max-w-sm"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {profile.profilePhoto ? (
                <img src={profile.profilePhoto.startsWith('/uploads') ? `${API}${profile.profilePhoto}` : profile.profilePhoto}
                  alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
                  <div className="w-24 h-24 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                    <span className="text-indigo-400 text-3xl font-bold">{initials}</span>
                  </div>
                  <p className="text-white/20 text-xs">Upload photo in Admin Panel</p>
                </div>
              )}
              {/* Exp badge */}
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute bottom-5 right-5 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', backdropFilter: 'blur(12px)' }}>
                <p className="text-indigo-300 font-bold text-xl leading-none">{stats.years}+</p>
                <p className="text-white/40 text-xs mt-0.5">Years Exp.</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right — text */}
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="space-y-5 pt-2">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight"
              style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}>
              Crafting Stories That<br />
              <span style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Leave an Impact
              </span>
            </h2>

            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              I&apos;m <span className="text-indigo-400 font-semibold">{profile.name}</span>
              {profile.title ? `, ${profile.title}.` : '.'} {about}
            </p>

            <div className="space-y-2.5">
              {['Cinematic quality with commercial results', 'Fast turnaround, no compromise on quality', 'Direct communication, no middlemen', 'Revisions until you are 100% satisfied'].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
                    <div className="w-1.5 h-1.5 rounded-sm bg-indigo-400" />
                  </div>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{item}</span>
                </motion.div>
              ))}
            </div>

            <motion.a href="#contact" whileHover={{ x: 4 }}
              className="inline-flex items-center gap-2 text-indigo-400 text-sm font-medium transition-colors hover:text-indigo-300">
              Work with me <span>→</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Stats */}
        <div ref={countRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {statItems.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="p-5 rounded-xl text-center" style={card}>
              <p className="text-3xl font-bold mb-1"
                style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}>
                {inView ? <CountUp end={s.value} duration={2} suffix={s.suffix} /> : `0${s.suffix}`}
              </p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
