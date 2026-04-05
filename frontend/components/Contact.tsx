'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface Profile {
  name: string
  contactEmail: string
  phone: string
  whatsapp: string
  location: string
  social: {
    youtube: string
    instagram: string
    linkedin: string
    github: string
    twitter: string
  }
}

export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    fetch(`${API}/api/profile`)
      .then(r => r.json())
      .then(d => { if (d.success) setProfile(d.data) })
      .catch(() => {})
  }, [])

  const email    = profile?.contactEmail || 'bhumilprajapati4@gmail.com'
  const whatsapp = profile?.whatsapp     || '918511872920'
  const location = profile?.location     || 'India (Available Worldwide)'

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { toast.error('Please fill all fields'); return }
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Message sent! I'll get back to you soon.")
        setForm({ name: '', email: '', message: '' })
      } else toast.error(data.message || 'Something went wrong')
    } catch { toast.error('Server offline. Use WhatsApp or Email directly.') }
    finally { setLoading(false) }
  }

  return (
    <section id="contact" className="section-padding relative overflow-hidden bg-dark-100">
      <Toaster position="top-right" toastOptions={{
        style: { background: '#0f172a', color: '#fff', border: '1px solid rgba(0,245,255,0.2)', fontFamily: 'monospace' }
      }} />

      <div className="absolute inset-0 bg-gradient-to-b from-dark to-dark-100" />
      <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #00F5FF, transparent)' }}
        animate={{ opacity: [0.05, 0.15, 0.05] }} transition={{ duration: 4, repeat: Infinity }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-neon" />
            <span className="text-neon font-mono text-xs tracking-[0.4em]">GET IN TOUCH</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-neon" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
            Let&apos;s Work <span className="neon-text">Together</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-white/30 font-mono text-sm max-w-xl mx-auto">
            Have a project in mind? Let&apos;s create something extraordinary.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — contact info */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="text-white font-display font-bold text-2xl mb-8">Ready to start?</h3>
            <div className="space-y-6 mb-10">
              {[
                { icon: '📧', label: 'EMAIL',    value: email,    href: `mailto:${email}` },
                { icon: '💬', label: 'WHATSAPP', value: `+${whatsapp}`, href: `https://wa.me/${whatsapp}` },
                { icon: '📍', label: 'LOCATION', value: location, href: '#' },
              ].map(item => (
                <a key={item.label} href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                  className="flex items-center gap-4 group">
                  <div className="w-12 h-12 glass-cyan rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:glow-cyan transition-all">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-white/30 font-mono text-xs tracking-widest">{item.label}</p>
                    <p className="text-white group-hover:text-cyan transition-colors font-mono text-sm">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer"
                className="btn-primary flex items-center justify-center gap-2"
                style={{ background: '#25D366', color: '#fff' }}>
                💬 WHATSAPP ME
              </a>
              <a href={`mailto:${email}`}
                className="btn-outline flex items-center justify-center gap-2">
                ✉️ SEND EMAIL
              </a>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <form onSubmit={onSubmit} className="glass p-8 rounded-2xl border border-white/5 space-y-6">
              {[
                { name: 'name',  label: 'YOUR NAME',      type: 'text',  placeholder: 'Your name' },
                { name: 'email', label: 'EMAIL ADDRESS',  type: 'email', placeholder: 'your@email.com' },
              ].map(f => (
                <div key={f.name}>
                  <label className="text-white/50 font-mono text-xs tracking-widest block mb-2">{f.label}</label>
                  <input type={f.type} name={f.name} value={(form as any)[f.name]} onChange={onChange}
                    placeholder={f.placeholder}
                    className="contact-input w-full px-4 py-3 font-mono text-sm focus:outline-none transition-colors rounded-lg" />
                </div>
              ))}
              <div>
                <label className="text-white/50 font-mono text-xs tracking-widest block mb-2">YOUR MESSAGE</label>
                <textarea name="message" value={form.message} onChange={onChange}
                  placeholder="Tell me about your project..." rows={5}
                  className="contact-input w-full px-4 py-3 font-mono text-sm focus:outline-none transition-colors rounded-lg resize-none" />
              </div>
              <button type="submit" disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'SENDING...' : 'SEND MESSAGE →'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
