'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Service } from '@/data'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function Services() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    fetch(`${API}/api/services`).then(r => r.json()).then(d => { if (d.success) setServices(d.data) }).catch(() => {})
  }, [])

  return (
    <section id="services" className="section-padding relative" style={{ background: '#0a0a0a' }}>
      <div className="max-w-5xl mx-auto px-6">

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-indigo-500" />
          <span className="text-indigo-400 text-xs font-medium tracking-widest uppercase">What I Do</span>
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-white mb-12"
          style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}>
          Services I <span style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Offer</span>
        </motion.h2>

        {services.length === 0 ? (
          <div className="text-center py-16 text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Add services from the Admin Panel.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <motion.div key={s._id}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4, borderColor: 'rgba(99,102,241,0.3)' }}
                className="p-6 rounded-xl cursor-default transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-2xl mb-4">{s.icon}</div>
                <h3 className="text-white font-semibold text-base mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
