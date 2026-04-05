'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { api } from '@/lib/api'

const ICONS = ['🎬','📱','🛍️','📣','✨','💻','🎨','🎯','🚀','⚡','🔥','💡','🎭','🌐','📊','🎵','📹','🖥️']
const empty = { title: '', description: '', icon: '⚡', order: 0 }

const inputCls = "w-full px-3.5 py-2.5 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none transition-all"
const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [form, setForm]         = useState<any>(empty)
  const [editing, setEditing]   = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)
  const [msg, setMsg]           = useState('')

  const load = () => api.getServices().then(r => setServices(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.title || !form.description) return setMsg('✗ Title and description required')
    setLoading(true); setMsg('')
    try {
      if (editing) await api.updateService(editing, form)
      else await api.createService(form)
      setMsg('✓ Saved'); setForm(empty); setEditing(null); load()
    } catch (e: any) { setMsg('✗ ' + e.message) }
    finally { setLoading(false) }
  }

  const del = async (id: string) => {
    if (!confirm('Delete?')) return
    await api.deleteService(id); load()
  }

  const edit = (s: any) => { setEditing(s._id); setForm({ title: s.title, description: s.description, icon: s.icon, order: s.order }) }

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-white">Services</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Manage your service offerings</p>
        </div>

        {/* Form */}
        <div className="rounded-xl p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs font-semibold tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {editing ? 'EDIT SERVICE' : 'ADD SERVICE'}
          </p>

          {msg && (
            <div className={`px-3 py-2 rounded-lg text-xs border ${msg.startsWith('✓') ? 'text-green-400 border-green-400/20 bg-green-400/5' : 'text-red-400 border-red-400/20 bg-red-400/5'}`}>{msg}</div>
          )}

          {/* Icon picker */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Icon</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {ICONS.map(ic => (
                <button key={ic} onClick={() => setForm({ ...form, icon: ic })}
                  className="w-9 h-9 rounded-lg text-lg transition-all"
                  style={{
                    background: form.icon === ic ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${form.icon === ic ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Video Editing" className={inputCls} style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Order</label>
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: +e.target.value })}
                className={inputCls} style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Description *</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe this service..." rows={3}
              className={`${inputCls} resize-none`} style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
          </div>

          <div className="flex gap-2">
            <button onClick={save} disabled={loading}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-all"
              style={{ background: loading ? 'rgba(99,102,241,0.5)' : '#6366f1' }}>
              {loading ? 'Saving...' : editing ? 'Update' : 'Add Service'}
            </button>
            {editing && (
              <button onClick={() => { setEditing(null); setForm(empty) }}
                className="px-4 py-2 rounded-lg text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>{services.length} SERVICES</p>
          {services.length === 0 ? (
            <div className="rounded-xl p-10 text-center text-sm" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.2)' }}>
              No services yet
            </div>
          ) : services.map(s => (
            <div key={s._id} className="flex items-start gap-4 p-4 rounded-xl group transition-all"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-2xl flex-shrink-0">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">{s.title}</p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.description}</p>
              </div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={() => edit(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}>
                  Edit
                </button>
                <button onClick={() => del(s._id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.8)' }}>
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  )
}
