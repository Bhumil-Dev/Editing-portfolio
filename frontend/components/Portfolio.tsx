'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Project } from '@/data'

const API  = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const cats = ['All', 'Video Editing', 'Motion Graphics', 'Web Development']

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filter, setFilter]     = useState('All')
  const [selected, setSelected] = useState<Project | null>(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch(`${API}/api/projects`)
      .then(r => r.json())
      .then(d => { if (d.success) setProjects(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter)
  const imgSrc   = (url: string) => url?.startsWith('/uploads') ? `${API}${url}` : url || ''

  return (
    <section id="portfolio" className="section-padding relative" style={{ background: '#0a0a0a' }}>
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-indigo-500" />
          <span className="text-indigo-400 text-xs font-medium tracking-widest uppercase">My Work</span>
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-white mb-8"
          style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}>
          Featured{' '}
          <span style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Projects
          </span>
        </motion.h2>

        {/* Filter buttons — FIXED */}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-10">
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background:   filter === c ? '#6366f1'                    : 'rgba(255,255,255,0.04)',
                color:        filter === c ? '#ffffff'                    : 'rgba(255,255,255,0.45)',
                border:       filter === c ? '1px solid #6366f1'          : '1px solid rgba(255,255,255,0.08)',
                boxShadow:    filter === c ? '0 4px 14px rgba(99,102,241,0.25)' : 'none',
              }}
              onMouseEnter={e => { if (filter !== c) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)' } }}
              onMouseLeave={e => { if (filter !== c) { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' } }}
            >
              {c}
            </button>
          ))}
        </motion.div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden animate-pulse"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="aspect-video" style={{ background: 'rgba(255,255,255,0.04)' }} />
                <div className="p-4 space-y-2">
                  <div className="h-4 rounded w-3/4" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  <div className="h-3 rounded w-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>
            No projects yet. Add them from the Admin Panel.
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((p, i) => (
                <motion.div key={p._id} layout
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  onClick={() => setSelected(p)}
                  className="group rounded-xl overflow-hidden cursor-pointer transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
                  whileHover={{ y: -4, borderColor: 'rgba(99,102,241,0.3)' }}>

                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {imgSrc(p.thumbnail) ? (
                      <img src={imgSrc(p.thumbnail)} alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-4xl"
                        style={{ color: 'rgba(255,255,255,0.1)' }}>🎬</div>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'rgba(0,0,0,0.4)' }}>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: '#6366f1', boxShadow: '0 0 20px rgba(99,102,241,0.5)' }}>
                        <span className="text-white text-lg">▶</span>
                      </div>
                    </div>
                    {/* Category badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', backdropFilter: 'blur(8px)' }}>
                      {p.category}
                    </div>
                    {/* Featured badge */}
                    {p.featured && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7', backdropFilter: 'blur(8px)' }}>
                        ★ Featured
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-indigo-300 transition-colors">{p.title}</h3>
                    <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'rgba(255,255,255,0.35)' }}>{p.description}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
            onClick={() => setSelected(null)}>
            <motion.div
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full max-w-2xl rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{ background: '#0f0f17', border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={e => e.stopPropagation()}>

              {/* Media */}
              <div className="relative aspect-video" style={{ background: '#000' }}>
                {selected.videoUrl
                  ? <iframe src={selected.videoUrl} className="w-full h-full" allowFullScreen title={selected.title} />
                  : <img src={imgSrc(selected.thumbnail)} alt={selected.title} className="w-full h-full object-cover" />}
                {/* Top bar */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, #6366f1, transparent)' }} />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)' }}>
                      {selected.category}
                    </span>
                    <h3 className="text-white font-bold text-xl mt-2"
                      style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}>
                      {selected.title}
                    </h3>
                  </div>
                  <button onClick={() => setSelected(null)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all flex-shrink-0 ml-4"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}>
                    ×
                  </button>
                </div>

                <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {selected.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {selected.tools?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold tracking-widest mb-2.5" style={{ color: 'rgba(255,255,255,0.25)' }}>TOOLS USED</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.tools.map(t => (
                          <span key={t} className="px-2.5 py-1 rounded-lg text-xs font-medium"
                            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selected.result && (
                    <div>
                      <p className="text-xs font-semibold tracking-widest mb-2.5" style={{ color: 'rgba(255,255,255,0.25)' }}>RESULT</p>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{selected.result}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
