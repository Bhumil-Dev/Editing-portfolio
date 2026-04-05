'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project } from '@/data'

gsap.registerPlugin(ScrollTrigger)

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const cats = ['All', 'Video Editing', 'Motion Graphics', 'Web Development']

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filter, setFilter]     = useState('All')
  const [selected, setSelected] = useState<Project | null>(null)
  const [loading, setLoading]   = useState(true)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`${API}/api/projects`)
      .then(r => r.json())
      .then(d => { if (d.success) setProjects(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  useEffect(() => {
    if (!filtered.length) return
    const cards = gridRef.current?.querySelectorAll('.proj-card')
    if (!cards?.length) return
    gsap.set(cards, { opacity: 0, y: 60, scale: 0.85 })
    gsap.to(cards, { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out', delay: 0.1 })
  }, [filtered])

  const imgSrc = (url: string) =>
    url?.startsWith('/uploads') ? `${API}${url}` : url || ''

  return (
    <section id="portfolio" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-100 to-dark" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-purple-400" />
            <span className="text-purple-400 font-mono text-xs tracking-[0.4em]">MY WORK</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-purple-400" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-display font-bold text-white">
            Featured <span className="neon-text">Projects</span>
          </motion.h2>
        </div>

        {/* Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12">
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-5 py-2 font-mono text-xs tracking-widest transition-all duration-300 rounded-sm ${
                filter === c ? 'bg-cyan text-dark font-bold shadow-lg shadow-cyan/20'
                  : 'border border-white/10 text-white/40 hover:border-cyan/40 hover:text-cyan'}`}>
              {c.toUpperCase()}
            </button>
          ))}
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-white/5" />
                <div className="p-5 glass border-t border-white/5 space-y-2">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-white/20 font-mono text-sm">
            No projects yet. Add them from the Admin Panel.
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <motion.div ref={gridRef} layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((p, i) => (
                <motion.div key={p._id} layout
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className="proj-card group relative overflow-hidden rounded-xl cursor-pointer"
                  onClick={() => setSelected(p)}>
                  <div className="relative aspect-video bg-dark-200 overflow-hidden">
                    {imgSrc(p.thumbnail) ? (
                      <img src={imgSrc(p.thumbnail)} alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/10 text-5xl">🎬</div>
                    )}
                    <div className="absolute inset-0 bg-dark/50 group-hover:bg-dark/20 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 rounded-full border-2 border-cyan flex items-center justify-center bg-dark/60 backdrop-blur-sm glow-cyan">
                        <span className="text-cyan text-xl">▶</span>
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 glass-cyan px-3 py-1 rounded-full">
                      <span className="text-cyan font-mono text-xs">{p.category}</span>
                    </div>
                  </div>
                  <div className="p-5 glass border-t border-white/5">
                    <h3 className="text-white font-display font-bold mb-1 group-hover:text-cyan transition-colors">{p.title}</h3>
                    <p className="text-white/30 text-xs font-mono line-clamp-2">{p.description}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[30] flex items-center justify-center p-4 bg-dark/95 backdrop-blur-2xl"
            onClick={() => setSelected(null)}>
            <motion.div
              initial={{ scale: 0.85, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 50 }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              className="glass w-full max-w-3xl rounded-2xl overflow-hidden border border-cyan/10 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>
              <div className="relative aspect-video bg-dark-200">
                {selected.videoUrl
                  ? <iframe src={selected.videoUrl} className="w-full h-full" allowFullScreen title={selected.title} />
                  : <img src={imgSrc(selected.thumbnail)} alt={selected.title} className="w-full h-full object-cover" />}
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-cyan font-mono text-xs tracking-widest">{selected.category}</span>
                    <h3 className="text-white font-display font-bold text-xl md:text-2xl mt-1">{selected.title}</h3>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-white/30 hover:text-cyan text-3xl leading-none transition-colors ml-4">×</button>
                </div>
                <p className="text-white/50 mb-6 leading-relaxed text-sm">{selected.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-cyan font-mono text-xs tracking-widest mb-3">TOOLS USED</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.tools?.map(t => (
                        <span key={t} className="glass-cyan px-3 py-1 text-cyan/70 font-mono text-xs rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                  {selected.result && (
                    <div>
                      <p className="text-neon font-mono text-xs tracking-widest mb-3">RESULT</p>
                      <p className="text-white/60 text-sm">{selected.result}</p>
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
