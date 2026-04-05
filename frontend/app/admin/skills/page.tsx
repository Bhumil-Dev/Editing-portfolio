'use client'
import { useEffect, useState, useRef } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { api } from '@/lib/api'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const CATS = ['web', 'video', 'design', 'other']
const empty = { name: '', color: '#00F5FF', category: 'web', logo: '', order: 0 }

function imgSrc(logo: string) {
  if (!logo) return ''
  if (logo.startsWith('/uploads')) return `${API}${logo}`
  return logo
}

export default function SkillsPage() {
  const [skills, setSkills]       = useState<any[]>([])
  const [form, setForm]           = useState<any>(empty)
  const [editing, setEditing]     = useState<string | null>(null)
  const [loading, setLoading]     = useState(false)
  const [msg, setMsg]             = useState('')
  const [logoFile, setLogoFile]   = useState<File | null>(null)
  const [preview, setPreview]     = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => api.getSkills().then(r => setSkills(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return
    setLogoFile(f); setPreview(URL.createObjectURL(f))
  }

  const save = async () => {
    if (!form.name) return setMsg('✗ Name is required')
    setLoading(true); setMsg('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)))
      if (logoFile) fd.append('logo', logoFile)
      if (editing) await api.updateSkill(editing, fd)
      else await api.createSkill(fd)
      setMsg('✓ Saved!'); reset(); load()
    } catch (e: any) { setMsg('✗ ' + e.message) }
    finally { setLoading(false) }
  }

  const del = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    try { await api.deleteSkill(id); load() }
    catch (e: any) { alert('Delete failed: ' + e.message) }
  }

  const edit = (s: any) => {
    setEditing(s._id)
    setForm({ name: s.name, color: s.color || '#00F5FF', category: s.category, logo: s.logo || '', order: s.order || 0 })
    setPreview(imgSrc(s.logo))
    setLogoFile(null)
  }

  const reset = () => { setEditing(null); setForm(empty); setLogoFile(null); setPreview('') }

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Skills Manager</h1>
          <p className="text-white/30 text-sm font-mono mt-1">Add, edit or delete skills</p>
        </div>

        {/* Form */}
        <div className="rounded-2xl p-6 border border-white/5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <h2 className="text-white/60 text-xs font-mono tracking-widest">{editing ? '✏ EDIT SKILL' : '+ ADD NEW SKILL'}</h2>

          {msg && (
            <div className={`px-3 py-2 rounded-lg text-xs font-mono border ${msg.startsWith('✓') ? 'text-green-400 border-green-400/20 bg-green-400/5' : 'text-red-400 border-red-400/20 bg-red-400/5'}`}>
              {msg}
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Name */}
            <div>
              <label className="text-white/40 text-xs font-mono block mb-1">SKILL NAME *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. React"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-cyan-400/40 transition-colors" />
            </div>

            {/* Category */}
            <div>
              <label className="text-white/40 text-xs font-mono block mb-1">CATEGORY</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#0a0f1e] border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-cyan-400/40 transition-colors">
                {CATS.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
              </select>
            </div>

            {/* Logo */}
            <div>
              <label className="text-white/40 text-xs font-mono block mb-1">LOGO / EMOJI</label>
              <div className="flex gap-2">
                <input value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })}
                  placeholder="⚛️ or URL"
                  className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/20 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-cyan-400/40 transition-colors" />
                <button onClick={() => fileRef.current?.click()}
                  className="px-3 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white text-xs transition-all whitespace-nowrap">
                  📁
                </button>
                <input ref={fileRef} type="file" accept="image/*,image/svg+xml" className="hidden" onChange={onFile} />
              </div>
              {preview && (
                <div className="mt-2 w-10 h-10 rounded-lg border border-white/10 overflow-hidden bg-white/5">
                  <img src={preview} alt="" className="w-full h-full object-contain p-1" />
                </div>
              )}
            </div>

            {/* Order */}
            <div>
              <label className="text-white/40 text-xs font-mono block mb-1">ORDER</label>
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: +e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-cyan-400/40 transition-colors" />
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={save} disabled={loading}
              className="px-6 py-2.5 rounded-xl font-bold text-sm tracking-widest disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(135deg, #00F5FF, #7B2FBE)', color: '#030712' }}>
              {loading ? 'SAVING...' : editing ? 'UPDATE SKILL' : 'ADD SKILL'}
            </button>
            {editing && (
              <button onClick={reset}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-all">
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Skills grid */}
        <div>
          <p className="text-white/40 text-xs font-mono tracking-widest mb-4">{skills.length} SKILLS</p>
          {skills.length === 0 ? (
            <div className="rounded-2xl p-12 border border-white/5 text-center text-white/20 text-sm"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              No skills yet. Add your first skill above.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {skills.map(s => (
                <div key={s._id}
                  className="rounded-xl p-4 border border-white/5 hover:border-white/15 transition-all group text-center"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {/* Logo */}
                  <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center overflow-hidden text-2xl"
                    style={{ background: `${s.color || '#00F5FF'}15`, border: `1px solid ${s.color || '#00F5FF'}30` }}>
                    {imgSrc(s.logo)
                      ? <img src={imgSrc(s.logo)} alt={s.name} className="w-full h-full object-contain p-1"
                          onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                      : <span>{s.logo || '⚡'}</span>}
                  </div>
                  <p className="text-white text-xs font-medium truncate mb-1">{s.name}</p>
                  <p className="text-white/30 text-xs mb-3">{s.category}</p>
                  {/* Actions */}
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => edit(s)}
                      className="flex-1 py-1 rounded-lg border border-cyan-400/30 text-cyan-400 text-xs hover:bg-cyan-400/10 transition-colors">
                      Edit
                    </button>
                    <button onClick={() => del(s._id)}
                      className="flex-1 py-1 rounded-lg border border-red-400/30 text-red-400 text-xs hover:bg-red-400/10 transition-colors">
                      Del
                    </button>
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
