'use client'
import { useEffect, useState, useRef } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { api } from '@/lib/api'

const CATS = ['Video Editing', 'Motion Graphics', 'Web Development']
const empty = { title: '', description: '', category: 'Video Editing', videoUrl: '', tools: '', result: '', featured: false }

export default function PortfolioPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [form, setForm] = useState<any>(empty)
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [thumb, setThumb] = useState<File | null>(null)
  const [thumbPreview, setThumbPreview] = useState('')
  const [showForm, setShowForm] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => api.getProjects().then(r => setProjects(r.data))
  useEffect(() => { load() }, [])

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return
    setThumb(f); setThumbPreview(URL.createObjectURL(f))
  }

  const save = async () => {
    if (!form.title || !form.description || !form.category) return setMsg('✗ Title, description, category required')
    setLoading(true); setMsg('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)))
      if (thumb) fd.append('thumbnail', thumb)
      if (editing) await api.updateProject(editing, fd)
      else await api.createProject(fd)
      setMsg('✓ Project saved'); setForm(empty); setEditing(null); setThumb(null); setThumbPreview(''); setShowForm(false); load()
    } catch (e: any) { setMsg('✗ ' + e.message) }
    finally { setLoading(false) }
  }

  const del = async (id: string) => {
    if (!confirm('Delete this project?')) return
    await api.deleteProject(id); load()
  }

  const edit = (p: any) => {
    setEditing(p._id)
    setForm({ title: p.title, description: p.description, category: p.category, videoUrl: p.videoUrl || '', tools: Array.isArray(p.tools) ? p.tools.join(', ') : p.tools || '', result: p.result || '', featured: p.featured || false })
    setThumbPreview(p.thumbnail ? `http://localhost:5000${p.thumbnail}` : '')
    setThumb(null); setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancel = () => { setEditing(null); setForm(empty); setThumb(null); setThumbPreview(''); setShowForm(false); setMsg('') }

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">Portfolio Manager</h1>
            <p className="text-white/30 text-sm font-mono mt-1">Manage your projects</p>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs tracking-widest transition-all"
              style={{ background: 'linear-gradient(135deg, #00F5FF, #7B2FBE)', color: '#030712' }}>
              + ADD PROJECT
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="rounded-2xl p-6 border border-cyan-400/10 space-y-5" style={{ background: 'rgba(0,245,255,0.02)' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-white/60 text-xs font-mono tracking-widest">{editing ? 'EDIT PROJECT' : 'NEW PROJECT'}</h2>
              <button onClick={cancel} className="text-white/30 hover:text-white text-xs font-mono transition-colors">CANCEL ×</button>
            </div>

            {msg && (
              <div className={`px-3 py-2 rounded-lg text-xs font-mono border ${msg.startsWith('✓') ? 'text-green-400 border-green-400/20 bg-green-400/5' : 'text-red-400 border-red-400/20 bg-red-400/5'}`}>
                {msg}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-5">
              {/* Left */}
              <div className="space-y-4">
                <div>
                  <label className="text-white/30 text-xs font-mono tracking-widest block mb-2">THUMBNAIL</label>
                  <div className="relative aspect-video rounded-xl border-2 border-dashed border-white/10 overflow-hidden cursor-pointer hover:border-cyan-400/30 transition-colors"
                    onClick={() => fileRef.current?.click()}>
                    {thumbPreview
                      ? <img src={thumbPreview} alt="" className="w-full h-full object-cover" />
                      : <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                          <span className="text-3xl mb-2">🖼</span>
                          <span className="text-xs font-mono">CLICK TO UPLOAD</span>
                        </div>}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
                  </div>
                </div>

                <div>
                  <label className="text-white/30 text-xs font-mono tracking-widest block mb-2">VIDEO URL (OPTIONAL)</label>
                  <input value={form.videoUrl} onChange={e => setForm({ ...form, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/embed/..."
                    className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 px-3 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400/40 transition-colors" />
                </div>

                <div>
                  <label className="text-white/30 text-xs font-mono tracking-widest block mb-2">RESULT / IMPACT</label>
                  <input value={form.result} onChange={e => setForm({ ...form, result: e.target.value })}
                    placeholder="2M+ views, 40% increase..."
                    className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 px-3 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400/40 transition-colors" />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-10 h-5 rounded-full transition-colors relative ${form.featured ? 'bg-cyan-400' : 'bg-white/10'}`}
                    onClick={() => setForm({ ...form, featured: !form.featured })}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-white/50 text-xs font-mono">FEATURED PROJECT</span>
                </label>
              </div>

              {/* Right */}
              <div className="space-y-4">
                <div>
                  <label className="text-white/30 text-xs font-mono tracking-widest block mb-2">TITLE *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="Brand Story Film"
                    className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 px-3 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400/40 transition-colors" />
                </div>

                <div>
                  <label className="text-white/30 text-xs font-mono tracking-widest block mb-2">CATEGORY *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#0a0f1e] border border-white/8 text-white px-3 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400/40 transition-colors">
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-white/30 text-xs font-mono tracking-widest block mb-2">DESCRIPTION *</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe this project..." rows={4}
                    className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 px-3 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400/40 transition-colors resize-none" />
                </div>

                <div>
                  <label className="text-white/30 text-xs font-mono tracking-widest block mb-2">TOOLS USED (comma separated)</label>
                  <input value={form.tools} onChange={e => setForm({ ...form, tools: e.target.value })}
                    placeholder="Premiere Pro, After Effects, React"
                    className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 px-3 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400/40 transition-colors" />
                </div>
              </div>
            </div>

            <button onClick={save} disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm tracking-widest transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #00F5FF, #7B2FBE)', color: '#030712' }}>
              {loading ? 'SAVING...' : editing ? 'UPDATE PROJECT' : 'ADD PROJECT'}
            </button>
          </div>
        )}

        {/* Projects grid */}
        <div>
          <h2 className="text-white/60 text-xs font-mono tracking-widest mb-4">{projects.length} PROJECTS</h2>
          {projects.length === 0 ? (
            <div className="rounded-2xl p-12 border border-white/5 text-center text-white/20 font-mono text-sm"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              No projects yet. Add your first project →
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(p => (
                <div key={p._id} className="rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition-all group"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="relative aspect-video bg-white/5">
                    {p.thumbnail
                      ? <img src={`http://localhost:5000${p.thumbnail}`} alt={p.title} className="w-full h-full object-cover" />
                      : <div className="absolute inset-0 flex items-center justify-center text-white/10 text-4xl">🖼</div>}
                    {p.featured && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-mono bg-cyan-400/20 text-cyan-400 border border-cyan-400/30">
                        FEATURED
                      </span>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-mono bg-black/60 text-white/60">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-white font-medium text-sm mb-1 truncate">{p.title}</p>
                    <p className="text-white/30 text-xs mb-3 line-clamp-2">{p.description}</p>
                    <div className="flex gap-2">
                      <button onClick={() => edit(p)}
                        className="flex-1 py-1.5 rounded-lg border border-cyan-400/20 text-cyan-400 text-xs font-mono hover:bg-cyan-400/10 transition-colors">
                        EDIT
                      </button>
                      <button onClick={() => del(p._id)}
                        className="flex-1 py-1.5 rounded-lg border border-red-400/20 text-red-400 text-xs font-mono hover:bg-red-400/10 transition-colors">
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
