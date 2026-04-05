'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface Profile {
  contactEmail: string; phone: string; whatsapp: string; location: string
}

const inputCls = "w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none transition-all"
const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }

export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    fetch(`${API}/api/profile`).then(r => r.json()).then(d => { if (d.success) setProfile(d.data) }).catch(() => {})
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
      const res  = await fetch(`${API}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.success) { toast.success("Message sent! I'll get back to you soon."); setForm({ name: '', email: '', message: '' }) }
      else toast.error(data.message || 'Something went wrong')
    } catch { toast.error('Server offline. Use WhatsApp or Email directly.') }
    finally { setLoading(false) }
  }

  const contactItems = [
    { icon: '📧', label: 'Email',    value: email,         href: `mailto:${email}` },
    { icon: '💬', label: 'WhatsApp', value: `+${whatsapp}`, href: `https://wa.me/${whatsapp}` },
    { icon: '📍', label: 'Location', value: location,       href: '#' },
  ]

  return (
    <section id="contact" className="section-padding relative" style={{ background: '#0d0d0d' }}>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(99,102,241,0.3)', fontFamily: 'Inter, sans-serif', fontSize: 14 }
      }} />

      {/* Subtle glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.08), transparent)' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-indigo-500" />
          <span className="text-indigo-400 text-xs font-medium tracking-widest uppercase">Get In Touch</span>
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-white mb-2"
          style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}>
          Let&apos;s Work{' '}
          <span style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Together
          </span>
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
          className="text-sm mb-12" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Have a project in mind? Let&apos;s create something extraordinary.
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Left — contact info */}
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }} className="space-y-6">

            <h3 className="text-white font-semibold text-lg"
              style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}>
              Ready to start?
            </h3>

            {/* Contact items */}
            <div className="space-y-4">
              {contactItems.map(item => (
                <a key={item.label} href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                  className="flex items-center gap-4 group p-3 rounded-xl transition-all duration-200"
                  style={{ border: '1px solid transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{item.label.toUpperCase()}</p>
                    <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Quick buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: '#25D366' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1da851')}
                onMouseLeave={e => (e.currentTarget.style.background = '#25D366')}>
                💬 WhatsApp Me
              </a>
              <a href={`mailto:${email}`}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ border: '1.5px solid rgba(99,102,241,0.4)', color: '#a5b4fc' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a5b4fc' }}>
                ✉️ Send Email
              </a>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <form onSubmit={onSubmit} className="space-y-4 p-6 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>

              {[
                { name: 'name',  label: 'Your Name',      type: 'text',  placeholder: 'John Doe' },
                { name: 'email', label: 'Email Address',  type: 'email', placeholder: 'john@example.com' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{f.label}</label>
                  <input type={f.type} name={f.name} value={(form as any)[f.name]} onChange={onChange}
                    placeholder={f.placeholder} className={inputCls} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Your Message</label>
                <textarea name="message" value={form.message} onChange={onChange}
                  placeholder="Tell me about your project..." rows={5}
                  className={`${inputCls} resize-none`} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
                style={{ background: loading ? 'rgba(99,102,241,0.5)' : '#6366f1', fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}
                onMouseEnter={e => { if (!loading) (e.target as HTMLElement).style.background = '#4f46e5' }}
                onMouseLeave={e => { if (!loading) (e.target as HTMLElement).style.background = '#6366f1' }}>
                {loading ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
