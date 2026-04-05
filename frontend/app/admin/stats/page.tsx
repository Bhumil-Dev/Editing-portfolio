'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { api } from '@/lib/api'

export default function StatsPage() {
  const [form, setForm] = useState({ projects: 50, clients: 20, years: 3, views: 1 })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.getSiteStats().then(r => { if (r.success) setForm(r.data) }).catch(() => {})
  }, [])

  const save = async () => {
    setSaving(true); setMsg('')
    try {
      await api.updateSiteStats(form)
      setMsg('✓ Stats saved successfully')
    } catch (e: any) { setMsg('✗ ' + e.message) }
    finally { setSaving(false) }
  }

  const fields = [
    { key: 'projects', label: 'Projects Completed', icon: '◰', suffix: '+', desc: 'Total projects done' },
    { key: 'clients',  label: 'Happy Clients',       icon: '◉', suffix: '+', desc: 'Satisfied clients' },
    { key: 'years',    label: 'Years Experience',    icon: '◈', suffix: '+', desc: 'Years in the field' },
    { key: 'views',    label: 'Million Views',       icon: '◇', suffix: 'M+', desc: 'Views generated' },
  ]

  return (
    <AdminShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Stats Manager</h1>
            <p className="text-white/30 text-sm font-mono mt-1">Edit your homepage achievement numbers</p>
          </div>
          <button onClick={save} disabled={saving}
            className="px-6 py-2.5 rounded-xl font-bold text-sm tracking-widest disabled:opacity-50 transition-all"
            style={{ background: 'linear-gradient(135deg, #00F5FF, #7B2FBE)', color: '#030712' }}>
            {saving ? 'SAVING...' : 'SAVE'}
          </button>
        </div>

        {msg && (
          <div className={`px-4 py-3 rounded-xl text-sm font-mono border ${msg.startsWith('✓') ? 'text-green-400 border-green-400/20 bg-green-400/5' : 'text-red-400 border-red-400/20 bg-red-400/5'}`}>
            {msg}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.key} className="rounded-2xl p-6 border border-white/5 space-y-3"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center gap-2">
                <span className="text-cyan text-lg">{f.icon}</span>
                <div>
                  <p className="text-white font-medium text-sm">{f.label}</p>
                  <p className="text-white/30 text-xs">{f.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number" min="0"
                  value={(form as any)[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: +e.target.value })}
                  className="flex-1 bg-white/5 border border-white/10 text-white text-2xl font-bold px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-400/40 transition-colors text-center"
                />
                <span className="text-cyan font-bold text-xl">{f.suffix}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="rounded-2xl p-6 border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <p className="text-white/40 text-xs font-mono tracking-widest mb-4">PREVIEW</p>
          <div className="grid grid-cols-4 gap-3">
            {fields.map(f => (
              <div key={f.key} className="text-center p-3 rounded-xl bg-white/3">
                <p className="text-cyan font-bold text-xl">{(form as any)[f.key]}{f.suffix}</p>
                <p className="text-white/30 text-xs mt-1">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
