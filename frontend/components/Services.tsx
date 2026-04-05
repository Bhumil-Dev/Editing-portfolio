'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Service } from '@/data'

gsap.registerPlugin(ScrollTrigger)

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`${API}/api/services`)
      .then(r => r.json())
      .then(d => { if (d.success) setServices(d.data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!services.length) return
    const cards = cardsRef.current?.querySelectorAll('.service-card')
    if (!cards?.length) return
    gsap.set(cards, {
      opacity: 0,
      y: (i: number) => [80, -80, 120, -60, 100, -90][i] ?? 80,
      x: (i: number) => [-100, 100, -80, 120, -60, 90][i] ?? 0,
      rotation: (i: number) => [-8, 8, -5, 10, -7, 6][i] ?? 0,
      scale: 0.7,
    })
    ScrollTrigger.create({
      trigger: cardsRef.current,
      start: 'top 75%',
      onEnter: () => {
        gsap.to(cards, { opacity: 1, y: 0, x: 0, rotation: 0, scale: 1, stagger: 0.1, duration: 0.9, ease: 'power4.out' })
      },
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [services])

  return (
    <section id="services" className="section-padding relative overflow-hidden bg-dark-100">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-cyan" />
            <span className="text-cyan font-mono text-xs tracking-[0.4em]">WHAT I DO</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-cyan" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-display font-bold text-white">
            Services I <span className="cyan-text">Offer</span>
          </motion.h2>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-16 text-white/20 font-mono text-sm">
            Add services from the Admin Panel.
          </div>
        ) : (
          <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={s._id} className="service-card group relative glass p-8 rounded-xl overflow-hidden cursor-pointer"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = (e.clientX - rect.left) / rect.width - 0.5
                  const y = (e.clientY - rect.top) / rect.height - 0.5
                  e.currentTarget.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg) translateY(-8px)`
                }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = '' }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(0,245,255,0.08), transparent 70%)' }} />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/0 to-transparent group-hover:via-cyan/50 transition-all duration-500" />
                <span className="absolute top-4 right-5 font-mono text-5xl font-bold text-white/4 group-hover:text-white/8 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="text-3xl mb-5 transform group-hover:scale-110 transition-transform duration-300">{s.icon}</div>
                <h3 className="text-white font-display font-bold text-lg mb-3 group-hover:text-cyan transition-colors duration-300">{s.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/60 transition-colors duration-300">{s.description}</p>
                <div className="mt-6 flex items-center gap-2 text-cyan/0 group-hover:text-cyan transition-all duration-300 text-xs font-mono tracking-wider">
                  <span>EXPLORE</span>
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1, repeat: Infinity }}>→</motion.span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
