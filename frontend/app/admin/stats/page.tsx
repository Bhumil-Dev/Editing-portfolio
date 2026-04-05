'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { api } from '@/lib/api'

interface StatItem { value: number; label: string; suffix: string; visible: boolean }
interface StatsForm {
  projects: StatItem
  clients:  StatItem
  years:    StatItem
  views:    StatItem
}

const defaults: StatsForm = {
  projects: { value: 50, label: 'Projects Completed', suffix: '+',  visible: true },
  clients:  { value: 20, label: 'Happy Clients',       suffix: '+',  visible: true },
  years:    { value: 3,  label: 'Years Experience',    suffix: '+',  visible: true },
  views:    { value: 1,  label: 'Million Views',       suffix: 'M+', visible: true },
}

const colors: Record<string, string> = {
  projects: '#6366f1',
  clients:  '#8b5cf6',
  years:    '#10b981',
  views:    '#f59e0b',
}

const inputCls = "w-full px-3 py-2 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none transition-all"
const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }

export default function StatsPage() {
  const [form, setForm]     = useState<StatsForm>(defaults)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState('')

  useEffect(() => {
    api.getSiteStats().then(r => {
      if (r.success && r.data) {
        // Merge with defaults to handle old flat structure
        const d = r.data
        setForm({
          projects: typeof d.projects === 'object' ? { ...defaults.projects, ...d.projects } : { ...defaults.projects, value: d.projects },
          clients:  typeof d.clients  === 'object' ? { ...defaults.clients,  ...d.clients  } : { ...defaults.clients,  value: d.clients  },
          years:    typeof d.years    === 'object' ? { ...defaults.years,    ...d.years    } : { ...defaults.years,    value: d.years    },
          views:    typeof d.views    === 'object' ? { ...defaults.views,    ...d.views    } : { ...defaults.views,    value: d.views    },
        })
      }
    }).catch(() => {})
  }, [])

  const save = async () => {
    setSaving(true); setMsg('')
    try {
      await api.updateSiteStats(form)
      setMsg('✓ Saved successfully')
    } catch (e: any) { setMsg('✗ ' + e.message) }
    finally { setSaving(false) }
  }

  const update = (key: keyof StatsForm, field: keyof StatItem, val: any) => {
    setForm(f => ({ ...f, [key]: { ...f[key], [field]: val } }))
  }

  const keys = Object.keys(form) as (keyof StatsForm)[]
  const visibleCount = keys.filter(k => form[k].visible).length

  return (
    <AdminShell>
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Stats Manager</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Control which stats appear on your homepage
            </p>
          </div>
          <button onClick={save} disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-all"
            style={{ background: saving ? 'rgba(99,102,241,0.5)' : '#6366f1' }}
            onMouseEnter={e => { if (!saving) (e.target as HTMLElement).style.background = '#4f46e5' }}
            onMouseLeave={e => { if (!saving) (e.target as HTMLElement).style.background = '#6366f1' }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {msg && (
          <div className={`px-4 py-2.5 rounded-lg text-sm border ${msg.startsWith('✓') ? 'text-green-400 border-green-400/20 bg-green-400/5' : 'text-red-400 border-red-400/20 bg-red-400/5'}`}>
            {msg}
          </div>
        )}

        {/* Info */}
        <div className="px-4 py-3 rounded-lg text-xs" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', color: 'rgba(165,180,252,0.8)' }}>
          💡 Toggle visibility to show/hide each stat. Edit the label, value, and suffix freely.
          Currently showing <strong>{visibleCount}</strong> of {keys.length} stats.
        </div>

        {/* Stat cards */}
        <div className="space-y-3">
          {keys.map(key => {
            const stat  = form[key]
            const color = colors[key]
            return (
              <div key={key} className="rounded-xl overflow-hidden transition-all"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${stat.visible ? `${color}25` : 'rgba(255,255,255,0.06)'}`,
                  opacity: stat.visible ? 1 : 0.5,
                }}>

                {/* Card header — visibility toggle */}
                <div className="flex items-center justify-between px-4 py-3 border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.05)', background: stat.visible ? `${color}08` : 'transparent' }}>
                  <div className="flex items-center gap-3">
                    {/* Toggle switch */}
                    <button onClick={() => update(key, 'visible', !stat.visible)}
                      className="relative w-10 h-5 rounded-full transition-all flex-shrink-0"
                      style={{ background: stat.visible ? color : 'rgba(255,255,255,0.1)' }}>
                      <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                        style={{ left: stat.visible ? '22px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                    </button>
                    <div>
                      <span className="text-white text-sm font-medium capitalize">{key}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full"
                        style={{ background: stat.visible ? `${color}15` : 'rgba(255,255,255,0.05)', color: stat.visible ? color : 'rgba(255,255,255,0.3)' }}>
                        {stat.visible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                  {/* Live preview */}
                  <span className="text-base font-bold" style={{ color: stat.visible ? color : 'rgba(255,255,255,0.2)' }}>
                    {stat.value}{stat.suffix}
                  </span>
                </div>

                {/* Editable fields */}
                <div className="p-4 grid grid-cols-3 gap-3">
                  {/* Value */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Value</label>
                    <input type="number" min="0" value={stat.value}
                      onChange={e => update(key, 'value', +e.target.value)}
                      className={`${inputCls} text-center font-bold text-lg`} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = `${color}60`}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </div>
                  {/* Suffix */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Suffix</label>
                    <input type="text" value={stat.suffix}
                      onChange={e => update(key, 'suffix', e.target.value)}
                      placeholder="+ or M+"
                      className={`${inputCls} text-center font-bold`} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = `${color}60`}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </div>
                  {/* Label */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Label</label>
                    <input type="text" value={stat.label}
                      onChange={e => update(key, 'label', e.target.value)}
                      placeholder="Label text"
                      className={inputCls} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = `${color}60`}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Live preview */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
            HOMEPAGE PREVIEW — {visibleCount} stat{visibleCount !== 1 ? 's' : ''} visible
          </p>
          {visibleCount === 0 ? (
            <p className="text-xs text-center py-3" style={{ color: 'rgba(255,255,255,0.2)' }}>No stats visible — toggle at least one on</p>
          ) : (
            <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${visibleCount}, 1fr)` }}>
              {keys.filter(k => form[k].visible).map(k => (
                <div key={k} className="text-center py-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="font-bold text-lg" style={{ color: colors[k] }}>
                    {form[k].value}{form[k].suffix}
                  </p>
                  <p className="text-xs mt-0.5 leading-tight" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {form[k].label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminShell>
  )
}
