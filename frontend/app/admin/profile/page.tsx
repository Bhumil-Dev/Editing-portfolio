'use client'
import { useEffect, useState, useRef } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { api } from '@/lib/api'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const inputCls = "w-full px-3.5 py-2.5 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none transition-all"
const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }

function Input({ label, value, onChange, placeholder, type = 'text' }: any) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</label>
      <input type={type} value={value || ''} onChange={onChange} placeholder={placeholder}
        className={inputCls} style={inputStyle}
        onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-xs font-semibold tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>{title}</p>
      {children}
    </div>
  )
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [saving, setSaving]   = useState(false)
  const [msg, setMsg]         = useState('')
  const [uploading, setUploading] = useState<string | null>(null)
  const photoRef = useRef<HTMLInputElement>(null)
  const logoRef  = useRef<HTMLInputElement>(null)

  useEffect(() => { api.getProfile().then(r => setProfile(r.data)) }, [])

  const save = async () => {
    setSaving(true); setMsg('')
    try { await api.updateProfile(profile); setMsg('✓ Saved') }
    catch (e: any) { setMsg('✗ ' + e.message) }
    finally { setSaving(false) }
  }

  const upload = async (file: File, type: 'profile' | 'logo') => {
    setUploading(type)
    try {
      const res = await api.uploadFile(file, type)
      setProfile((p: any) => ({ ...p, [type === 'profile' ? 'profilePhoto' : 'logo']: res.url }))
      setMsg('✓ Uploaded')
    } catch (e: any) { setMsg('✗ ' + e.message) }
    finally { setUploading(null) }
  }

  const set = (k: string, v: any) => setProfile((p: any) => ({ ...p, [k]: v }))
  const setSocial = (k: string, v: string) => setProfile((p: any) => ({ ...p, social: { ...p.social, [k]: v } }))

  if (!profile) return (
    <AdminShell>
      <div className="flex items-center justify-center h-48">
        <div className="w-5 h-5 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
      </div>
    </AdminShell>
  )

  return (
    <AdminShell>
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Profile Settings</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Manage your public profile</p>
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

        {/* Media */}
        <Section title="MEDIA">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Profile Photo', key: 'profilePhoto', ref: photoRef, type: 'profile' as const },
              { label: 'Logo',          key: 'logo',         ref: logoRef,  type: 'logo'    as const },
            ].map(item => (
              <div key={item.key}>
                <p className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</p>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {profile[item.key]
                      ? <img src={profile[item.key].startsWith('/uploads') ? `${API}${profile[item.key]}` : profile[item.key]}
                          alt="" className="w-full h-full object-cover" />
                      : <span className="text-white/20 text-xs">None</span>}
                  </div>
                  <div>
                    <input ref={item.ref} type="file" accept="image/*" className="hidden"
                      onChange={e => e.target.files?.[0] && upload(e.target.files[0], item.type)} />
                    <button onClick={() => item.ref.current?.click()} disabled={uploading === item.type}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
                      {uploading === item.type ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Basic info */}
        <Section title="BASIC INFO">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Full Name"  value={profile.name}    onChange={(e: any) => set('name', e.target.value)}    placeholder="Bhumil Prajapati" />
            <Input label="Title"      value={profile.title}   onChange={(e: any) => set('title', e.target.value)}   placeholder="Video Editor & Developer" />
          </div>
          <Input label="Tagline" value={profile.tagline} onChange={(e: any) => set('tagline', e.target.value)} placeholder="I Turn Ideas Into Visual Experiences" />
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>About</label>
            <textarea value={profile.about || ''} onChange={e => set('about', e.target.value)}
              placeholder="Write about yourself..." rows={4}
              className={`${inputCls} resize-none`} style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
          </div>
        </Section>

        {/* Contact */}
        <Section title="CONTACT">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Email"     value={profile.contactEmail} onChange={(e: any) => set('contactEmail', e.target.value)} placeholder="your@email.com" type="email" />
            <Input label="Phone"     value={profile.phone}        onChange={(e: any) => set('phone', e.target.value)}        placeholder="8511872920" />
            <Input label="WhatsApp"  value={profile.whatsapp}     onChange={(e: any) => set('whatsapp', e.target.value)}     placeholder="918511872920" />
            <Input label="Location"  value={profile.location}     onChange={(e: any) => set('location', e.target.value)}     placeholder="India" />
          </div>
        </Section>

        {/* Social */}
        <Section title="SOCIAL LINKS">
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'instagram', label: 'Instagram', ph: 'https://instagram.com/...' },
              { key: 'linkedin',  label: 'LinkedIn',  ph: 'https://linkedin.com/in/...' },
              { key: 'github',    label: 'GitHub',    ph: 'https://github.com/...' },
              { key: 'youtube',   label: 'YouTube',   ph: 'https://youtube.com/@...' },
              { key: 'twitter',   label: 'Twitter/X', ph: 'https://twitter.com/...' },
            ].map(f => (
              <Input key={f.key} label={f.label} value={profile.social?.[f.key]}
                onChange={(e: any) => setSocial(f.key, e.target.value)} placeholder={f.ph} />
            ))}
          </div>
        </Section>

      </div>
    </AdminShell>
  )
}
