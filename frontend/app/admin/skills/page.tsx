'use client'
import { useEffect, useState, useRef } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { api } from '@/lib/api'

const CATS = ['web', 'video', 'design', 'other']
const COLORS = ['#00F5FF', '#7B2FBE', '#00FF88', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#ffffff']

const empty = { name: '', color: '#00F5FF', category: 'web', logo: '', order: 0 }

export default function SkillsPage() {
  const [skills, setSkills] = useState<any[]>([])
  const [form, setForm] = useState<any>(empty)
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => api.getSkills().then(r => setSkills(r.data))
  useEffect(() => { load() }, [])

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setLogoFile(f)
    setLogoPreview(URL.createObjectURL(f))
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
      setMsg('✓ Skill saved'); setForm(empty); setEditing(null); setLogoFile(null); setLogoPreview('')
      load()
    } catch (e: any) { setMsg('✗ ' + e.message) }
    finally { setLoading(false) }
  }

  const del = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    await api.deleteSkill(id); load()
  }

  const edit = (s: any) => {
    setEditing(s._id); setForm({ name: s.name, color: s.color, category: s.category, logo: s.logo, order: s.order })
    setLogoPreview(s.logo ? `http://localhost:5000${s.logo}` : '')
    setLogoFile(null)
  }

  const cancel = () => { setEditing(null); setForm(empty); setLogoFile(null); setLogoPreview('') }

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">Skills Manager</h1>
          <p className="text-white/30 text-sm font-mono mt-1">Add and manage skill icons</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="rounded-2xl p-6 border border-white/5 space-y-4 h-fit" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <h2 className="text-white/60 text-xs font-mono tracking-widest">{editing ? 'EDIT SKILL' : 'ADD SKILL'}</h2>

            {msg && (
              <div className={`px-3 py-2 rounded-lg text-xs font-mono border ${msg.startsWith('✓') ? 'text-green-400 border-green-400/20 bg-green-400/5' : 'text-red-400 border-red-400/20 bg-red-400/5'}`}>
                {msg}
              </div>
            )}

            {/* Logo upload */}
            <div>
              <p className="text-white/30 text-xs font-mono tracking-widest mb-2">SKILL LOGO / ICON</p>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl border border-white/10 flex items-center justify-center bg-white/5 overflow-hidden">
                  {logoPreview
                    ? <img src={logoPreview} alt="" className="w-full h-full object-contain p-1" />
                    : <span className="text-white/20 text-xs">LOGO</span>}
                </div>
                <div className="flex-1">
                  <input ref={fileRef} type="file" accept="image/*,image/svg+xml" className="hidden" onChange={onFile} />
                  <button onClick={() => fileRef.current?.click()}
                    className="w-full px-3 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 text-xs font-mono transition-all">
                    UPLOAD IMAGE
                  </button>
                  <p className="text-white/20 text-xs mt-1">or enter emoji below</p>
                </div>
              </div>
              <input value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })}
                placeholder="Or paste emoji: ⚛️"
                className="w-full mt-2 bg-white/5 border border-white/8 text-white placeholder-white/20 px-3 py-2 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400/40 transition-colors" />
            </div>

            <div>
              <label className="text-white/30 text-xs font-mono tracking-widest block mb-2">SKILL NAME *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="React, After Effects..."
                className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 px-3 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400/40 transition-colors" />
            </div>

            <div>
              <label className="text-white/30 text-xs font-mono tracking-widest block mb-2">CATEGORY</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#0a0f1e] border border-white/8 text-white px-3 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400/40 transition-colors">
                {CATS.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
              </select>
            </div>

            <div>
              <label className="text-white/30 text-xs font-mono tracking-widest block mb-2">GLOW COLOR</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setForm({ ...form, color: c })}
                    className="w-7 h-7 rounded-full border-2 transition-all"
                    style={{ background: c, borderColor: form.color === c ? '#fff' : 'transparent' }} />
                ))}
              </div>
            </div>

            <div>
              <label className="text-white/30 text-xs font-mono tracking-widest block mb-2">ORDER</label>
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: +e.target.value })}
                className="w-full bg-white/5 border border-white/8 text-white px-3 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400/40 transition-colors" />
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={save} disabled={loading}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs tracking-widest transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #00F5FF, #7B2FBE)', color: '#030712' }}>
                {loading ? 'SAVING...' : editing ? 'UPDATE' : 'ADD SKILL'}
              </button>
              {editing && (
                <button onClick={cancel}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-xs font-mono transition-all">
                  CANCEL
                </button>
              )}
            </div>
          </div>

          {/* Skills list */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-white/60 text-xs font-mono tracking-widest">{skills.length} SKILLS</h2>
            {skills.length === 0 ? (
              <div className="rounded-2xl p-12 border border-white/5 text-center text-white/20 font-mono text-sm"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                No skills yet. Add your first skill →
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {skills.map(s => (
                  <div key={s._id}
                    className="rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all group"
                    style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl overflow-hidden"
                        style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                        {s.logo?.startsWith('/uploads')
                          ? <img src={`http://localhost:5000${s.logo}`} alt="" className="w-full h-full object-contain p-1" />
                          : <span>{s.logo || '⚡'}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{s.name}</p>
                        <p className="text-white/30 text-xs font-mono">{s.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => edit(s)}
                        className="flex-1 py-1.5 rounded-lg border border-cyan-400/20 text-cyan-400 text-xs font-mono hover:bg-cyan-400/10 transition-colors">
                        EDIT
                      </button>
                      <button onClick={() => del(s._id)}
                        className="flex-1 py-1.5 rounded-lg border border-red-400/20 text-red-400 text-xs font-mono hover:bg-red-400/10 transition-colors">
                        DEL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
