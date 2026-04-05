'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Project } from '@/data'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Main tabs — Web vs Video/Editing
const TABS = [
  { key: 'video', label: '🎬 Video Editing', cats: ['Video Editing', 'Motion Graphics'] },
  { key: 'web',   label: '💻 Web Projects',  cats: ['Web Development'] },
]

// Sub-filters per tab
const SUB_FILTERS: Record<string, string[]> = {
  video: ['All', 'Video Editing', 'Motion Graphics'],
  web:   ['All', 'Web Development'],
}

function isYouTube(url: string) { return url?.includes('youtube.com') || url?.includes('youtu.be') }
function isVimeo(url: string)   { return url?.includes('vimeo.com') }

function toEmbedUrl(url: string): string {
  if (!url) return ''
  // Already embed
  if (url.includes('/embed/')) return url
  // YouTube watch → embed
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
  return url
}

function isDirectLink(url: string): boolean {
  // Not a known embed platform — treat as external link
  if (!url) return false
  return !isYouTube(url) && !isVimeo(url) && !url.includes('/embed/')
}

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([])
  const [tab, setTab]           = useState('video')
  const [subFilter, setSubFilter] = useState('All')
  const [selected, setSelected] = useState<Project | null>(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch(`${API}/api/projects`)
      .then(r => r.json())
      .then(d => { if (d.success) setProjects(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Reset sub-filter when tab changes
  const switchTab = (key: string) => { setTab(key); setSubFilter('All') }

  const currentTab  = TABS.find(t => t.key === tab)!
  const tabProjects = projects.filter(p => currentTab.cats.includes(p.category))
  const filtered    = subFilter === 'All' ? tabProjects : tabProjects.filter(p => p.category === subFilter)

  const imgSrc = (url: string) => url?.startsWith('/uploads') ? `${API}${url}` : url || ''

  const openProject = (p: Project) => {
    // If video project with a direct external link → open in new tab
    if (tab === 'video' && p.videoUrl && isDirectLink(p.videoUrl)) {
      window.open(p.videoUrl, '_blank', 'noopener,noreferrer')
      return
    }
    setSelected(p)
  }

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

        {/* ── Main Tabs: Video vs Web ── */}
        <div className="flex gap-2 mb-6 p-1 rounded-xl w-fit"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => switchTab(t.key)}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                background: tab === t.key ? '#6366f1' : 'transparent',
                color:      tab === t.key ? '#fff'    : 'rgba(255,255,255,0.45)',
                boxShadow:  tab === t.key ? '0 4px 14px rgba(99,102,241,0.3)' : 'none',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Sub-filters ── */}
        {SUB_FILTERS[tab].length > 2 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {SUB_FILTERS[tab].map(f => (
              <button key={f} onClick={() => setSubFilter(f)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                style={{
                  background:   subFilter === f ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                  color:        subFilter === f ? '#a5b4fc'                : 'rgba(255,255,255,0.4)',
                  border:       subFilter === f ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(255,255,255,0.07)',
                }}>
                {f}
              </button>
            ))}
          </div>
        )}

        {/* ── Video tab hint ── */}
        {tab === 'video' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg w-fit"
            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <span className="text-violet-400 text-xs">▶</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Click any project to watch the video
            </span>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden animate-pulse"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="aspect-video" style={{ background: 'rgba(255,255,255,0.04)' }} />
                <div className="p-4 space-y-2">
                  <div className="h-4 rounded w-3/4" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  <div className="h-3 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>
            No {tab === 'video' ? 'video' : 'web'} projects yet. Add them from the Admin Panel.
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div key={tab + subFilter} layout
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p, i) => (
                <motion.div key={p._id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => openProject(p)}
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
                        style={{ color: 'rgba(255,255,255,0.1)' }}>
                        {tab === 'video' ? '🎬' : '💻'}
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'rgba(0,0,0,0.45)' }}>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white"
                        style={{ background: tab === 'video' ? '#8b5cf6' : '#6366f1', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
                        {tab === 'video' ? (
                          <><span>▶</span> Watch Video</>
                        ) : (
                          <><span>→</span> View Project</>
                        )}
                      </div>
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: tab === 'video' ? 'rgba(139,92,246,0.2)' : 'rgba(99,102,241,0.2)',
                        border:     tab === 'video' ? '1px solid rgba(139,92,246,0.35)' : '1px solid rgba(99,102,241,0.35)',
                        color:      tab === 'video' ? '#c4b5fd' : '#a5b4fc',
                        backdropFilter: 'blur(8px)',
                      }}>
                      {p.category}
                    </div>

                    {/* External link indicator for video */}
                    {tab === 'video' && p.videoUrl && isDirectLink(p.videoUrl) && (
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs"
                        style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)' }}>
                        ↗ External
                      </div>
                    )}

                    {/* Featured */}
                    {p.featured && (
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7', backdropFilter: 'blur(8px)' }}>
                        ★ Featured
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-indigo-300 transition-colors">{p.title}</h3>
                    <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'rgba(255,255,255,0.35)' }}>{p.description}</p>
                    {/* Tools */}
                    {p.tools?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {p.tools.slice(0, 3).map(t => (
                          <span key={t} className="px-2 py-0.5 rounded text-xs"
                            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)' }}>
                            {t}
                          </span>
                        ))}
                        {p.tools.length > 3 && (
                          <span className="px-2 py-0.5 rounded text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                            +{p.tools.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* ── Modal — for embed videos and web projects ── */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(16px)' }}
            onClick={() => setSelected(null)}>
            <motion.div
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full max-w-2xl rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{ background: '#0f0f17', border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={e => e.stopPropagation()}>

              {/* Video / Image */}
              <div className="relative aspect-video" style={{ background: '#000' }}>
                {selected.videoUrl && !isDirectLink(selected.videoUrl) ? (
                  <iframe
                    src={toEmbedUrl(selected.videoUrl)}
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay; encrypted-media; picture-in-picture"
                    title={selected.title}
                  />
                ) : (
                  <img src={imgSrc(selected.thumbnail)} alt={selected.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, #6366f1, transparent)' }} />
              </div>

              {/* Details */}
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

                {/* External link button for video projects */}
                {selected.videoUrl && (
                  <div className="mt-5 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <a href={selected.videoUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#c4b5fd' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.2)'; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.12)'; e.currentTarget.style.color = '#c4b5fd' }}>
                      ▶ Watch on {isYouTube(selected.videoUrl) ? 'YouTube' : isVimeo(selected.videoUrl) ? 'Vimeo' : 'External Site'}
                      <span className="text-xs opacity-60">↗</span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
