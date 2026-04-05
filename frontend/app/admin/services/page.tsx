'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { api } from '@/lib/api'

const ICONS = ['🎬','📱','🛍️','📣','✨','💻','🎨','🎯','🚀','⚡','🔥','💡','🎭','🌐','📊']
const empty = { title: '', description: '', icon: '⚡', order: 0 }

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [form, setForm] = useState<any>(empty)
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const load = () => api.getServices().then(r => setServices(r.data))
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.title || !form.description) return setMsg('✗ Title and description required')
    setLoading(true); setMsg('')
    try {
      if (editing) await api.updateService(editing, form)
      else await api.createService(form)
      setMsg('✓ Service saved'); setForm(empty); setEditing(null); load()
    } catch (e: any) { setMsg('✗ ' + e.message) }
    finally { setLoading(false) }
  }

  const del = async (id: string) => {
    if (!confirm('Delete this service?')) return
    await api.deleteService(id); load()
  }

  const edit = (s: any) => {
    setEditing(s._id); setForm({ title: s.title, description: s.description, icon: s.icon, order: s.order })
  }

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">Services Manager</h1>
          <p className="text-white/30 text-sm font-mono mt-1">Manage your service offerings</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="rounded-2xl p-6 border border-white/5 space-y-4 h-fit" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <h2 className="text-white/60 text-xs font-mono tracking-widest">{editing ? 'EDIT SERVICE' : 'ADD SERVICE'}</h2>

            {msg && (
              <div className={`px-3 py-2 rounded-lg text-xs font-mono border ${msg.startsWith('✓') ? 'text-green-400 border-green-400/20 bg-green-400/5' : 'text-red-400 border-red-400/20 bg-red-400/5'}`}>
                {msg}
              </div>
            )}

            <div>
              <label className="text-white/30 text-xs font-mono tracking-widest block mb-2">ICON</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {ICONS.map(ic => (
                  <button key={ic} onClick={() => setForm({ ...form, icon: ic })}
                    className={`w-9 h-9 rounded-lg text-lg transition-all ${form.icon === ic ? 'border-2 border-cyan-400/60 bg-cyan-400/10' : 'border border-white/10 hover:border-white/20'}`}>
                    {ic}
                  </button>
                ))}
              </div>
              <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}
                placeholder="Or type custom emoji"
                className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 px-3 py-2 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400/40 transition-colors" />
            </div>

            <div>
              <label className="text-white/30 text-xs font-mono tracking-widest block mb-2">TITLE *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Video Editing"
                className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 px-3 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400/40 transition-colors" />
            </div>

            <div>
              <label className="text-white/30 text-xs font-mono tracking-widest block mb-2">DESCRIPTION *</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Describe this service..." rows={4}
                className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 px-3 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400/40 transition-colors resize-none" />
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
                {loading ? 'SAVING...' : editing ? 'UPDATE' : 'ADD SERVICE'}
              </button>
              {editing && (
                <button onClick={() => { setEditing(null); setForm(empty) }}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-xs font-mono transition-all">
                  CANCEL
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-white/60 text-xs font-mono tracking-widest">{services.length} SERVICES</h2>
            {services.length === 0 ? (
              <div className="rounded-2xl p-12 border border-white/5 text-center text-white/20 font-mono text-sm"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                No services yet. Add your first service →
              </div>
            ) : (
              <div className="space-y-3">
                {services.map(s => (
                  <div key={s._id}
                    className="flex items-start gap-4 p-5 rounded-xl border border-white/5 hover:border-white/10 transition-all group"
                    style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <span className="text-3xl flex-shrink-0">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium mb-1">{s.title}</p>
                      <p className="text-white/40 text-sm leading-relaxed">{s.description}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => edit(s)}
                        className="px-3 py-1.5 rounded-lg border border-cyan-400/20 text-cyan-400 text-xs font-mono hover:bg-cyan-400/10 transition-colors">
                        EDIT
                      </button>
                      <button onClick={() => del(s._id)}
                        className="px-3 py-1.5 rounded-lg border border-red-400/20 text-red-400 text-xs font-mono hover:bg-red-400/10 transition-colors">
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
