'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { useInView as useIO } from 'react-intersection-observer'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface Profile {
  name: string; title: string; tagline: string
  about: string; profilePhoto: string; location: string
}
interface StatsData { projects: number; clients: number; years: number; views: number }

export default function About() {
  const { ref: countRef, inView } = useIO({ triggerOnce: true })
  const [profile, setProfile] = useState<Profile>({
    name: 'Bhumil Prajapati', title: 'Video Editor & MERN Stack Developer',
    tagline: 'I Turn Ideas Into Visual Experiences', about: '', profilePhoto: '', location: 'India',
  })
  const [statsData, setStatsData] = useState<StatsData>({ projects: 50, clients: 20, years: 3, views: 1 })

  useEffect(() => {
    fetch(`${API}/api/profile`).then(r=>r.json()).then(d=>{ if(d.success&&d.data) setProfile(d.data) }).catch(()=>{})
    fetch(`${API}/api/stats`).then(r=>r.json()).then(d=>{ if(d.success&&d.data) setStatsData(d.data) }).catch(()=>{})
  }, [])

  const displayStats = [
    { value: statsData.projects, label: 'Projects Completed', suffix: '+' },
    { value: statsData.clients,  label: 'Happy Clients',       suffix: '+' },
    { value: statsData.years,    label: 'Years Experience',    suffix: '+' },
    { value: statsData.views,    label: 'Million Views',       suffix: 'M+' },
  ]

  const initials = profile.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'BP'

  const aboutText = profile.about ||
    `I'm a professional Video Editor and MERN Stack Developer based in ${profile.location || 'India'}. I create cinematic visual content that tells powerful stories and drives real results.`

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark to-dark-100" />
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="flex items-center gap-4 mb-16">
          <div className="w-12 h-px bg-cyan" />
          <span className="text-cyan font-mono text-xs tracking-[0.4em]">ABOUT ME</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — profile photo */}
          <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute -top-4 -left-4 w-full h-full border border-cyan/10" />
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-purple-400/10" />

              <div className="relative aspect-[3/4] bg-dark-200 overflow-hidden rounded-lg">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,245,255,0.05), rgba(123,47,190,0.05))' }} />
                <div className="absolute inset-0 grid-bg opacity-30" />

                {/* Profile photo or initials */}
                {profile.profilePhoto ? (
                  <img
                    src={profile.profilePhoto.startsWith('/uploads')
                      ? `${API}${profile.profilePhoto}`
                      : profile.profilePhoto}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 rounded-full border-2 border-cyan/30 mx-auto mb-4 flex items-center justify-center"
                        style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.1), transparent)' }}>
                        <span className="text-cyan font-display text-4xl font-bold">{initials}</span>
                      </div>
                      <p className="text-white/20 font-mono text-xs">Upload photo in Admin Panel</p>
                    </div>
                  </div>
                )}

                {/* Floating badge */}
                <motion.div animate={{ y: [0,-8,0] }} transition={{ duration:3, repeat:Infinity }}
                  className="absolute bottom-6 right-6 glass-cyan p-4 rounded-xl">
                  <p className="text-cyan font-display text-2xl font-bold">5+</p>
                  <p className="text-white/40 font-mono text-xs">Years Exp.</p>
                </motion.div>

                {/* Scan line */}
                <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
                  <motion.div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan/40 to-transparent"
                    animate={{ y: [0, 400, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — dynamic text */}
          <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}>

            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
              Crafting Stories That
              <br /><span className="cyan-text">Leave an Impact</span>
            </h2>

            {/* Dynamic name + title */}
            <p className="text-white/50 leading-relaxed mb-5 text-sm">
              I&apos;m{' '}
              <span className="text-cyan font-semibold">{profile.name || 'Bhumil Prajapati'}</span>
              {profile.title ? `, ${profile.title}.` : ', a professional Video Editor and MERN Stack Developer.'}
              {' '}With 5+ years of experience, I create cinematic visual content that tells powerful stories and drives real results.
            </p>

            {/* Dynamic about text */}
            <p className="text-white/50 leading-relaxed mb-8 text-sm">
              {aboutText}
            </p>

            <div className="space-y-3 mb-10">
              {[
                'Cinematic quality with commercial results',
                'Fast turnaround without compromising quality',
                'Direct communication, no middlemen',
                'Unlimited revisions until 100% satisfied',
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded border border-cyan/30 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-sm bg-cyan" />
                  </div>
                  <span className="text-white/60 text-sm font-mono">{item}</span>
                </motion.div>
              ))}
            </div>

            <a href="#contact"
              className="inline-flex items-center gap-3 text-cyan font-mono text-sm tracking-widest border-b border-cyan/30 pb-1 hover:border-cyan transition-colors">
              WORK WITH ME <span>→</span>
            </a>
          </motion.div>
        </div>

        {/* Stats — from DB */}
        <div ref={countRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {displayStats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass p-6 text-center rounded-xl hover:glass-cyan transition-all duration-300">
              <div className="text-4xl font-bold font-display cyan-text mb-2">
                {inView ? <CountUp end={s.value} duration={2.5} suffix={s.suffix} /> : `0${s.suffix}`}
              </div>
              <p className="text-white/30 font-mono text-xs tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
