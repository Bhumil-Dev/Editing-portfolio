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
      setMsg('✓ Saved!')
    } catch (e: any) { setMsg('✗ ' + e.message) }
    finally { setSaving(false) }
  }

  const fields = [
    { key: 'projects', label: 'Projects Completed', suffix: '+',  color: '#6366f1', desc: 'Total projects done' },
    { key: 'clients',  label: 'Happy Clients',       suffix: '+',  color: '#8b5cf6', desc: 'Satisfied clients' },
    { key: 'years',    label: 'Years Experience',    suffix: '+',  color: '#10b981', desc: 'Years in the field' },
    { key: 'views',    label: 'Million Views',       suffix: 'M+', color: '#f59e0b', desc: 'Views generated' },
  ]

  return (
    <AdminShell>
      <div className="max-w-xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Stats Manager</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Edit your homepage achievement numbers
            </p>
          </div>
          <button onClick={save} disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-all"
            style={{ background: saving ? 'rgba(99,102,241,0.5)' : '#6366f1' }}
            onMouseEnter={e => { if (!saving) (e.target as HTMLElement).style.background = '#4f46e5' }}
            onMouseLeave={e => { if (!saving) (e.target as HTMLElement).style.background = '#6366f1' }}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* Message */}
        {msg && (
          <div className={`px-4 py-2.5 rounded-lg text-sm border ${
            msg.startsWith('✓')
              ? 'text-green-400 border-green-400/20 bg-green-400/5'
              : 'text-red-400 border-red-400/20 bg-red-400/5'
          }`}>
            {msg}
          </div>
        )}

        {/* Fields */}
        <div className="space-y-3">
          {fields.map(f => (
            <div key={f.key} className="rounded-xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white text-sm font-medium">{f.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{f.desc}</p>
                </div>
                {/* Live preview badge */}
                <span className="text-lg font-bold px-3 py-1 rounded-lg"
                  style={{ color: f.color, background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                  {(form as any)[f.key]}{f.suffix}
                </span>
              </div>
              {/* Input — full width, no suffix outside */}
              <input
                type="number" min="0"
                value={(form as any)[f.key]}
                onChange={e => setForm({ ...form, [f.key]: +e.target.value })}
                className="w-full text-white text-xl font-bold px-4 py-2.5 rounded-lg focus:outline-none transition-all text-center"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onFocus={e => e.target.style.borderColor = `${f.color}60`}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
          ))}
        </div>

        {/* Preview strip */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>HOMEPAGE PREVIEW</p>
          <div className="grid grid-cols-4 gap-2">
            {fields.map(f => (
              <div key={f.key} className="text-center py-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="font-bold text-lg" style={{ color: f.color }}>
                  {(form as any)[f.key]}{f.suffix}
                </p>
                <p className="text-xs mt-0.5 leading-tight" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {f.label}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminShell>
  )
}
