'use client'
import { useEffect, useState, useRef } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { api } from '@/lib/api'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState<string | null>(null)
  const photoRef = useRef<HTMLInputElement>(null)
  const logoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    api.getProfile().then(r => setProfile(r.data))
  }, [])

  const save = async () => {
    setSaving(true); setMsg('')
    try {
      await api.updateProfile(profile)
      setMsg('✓ Profile saved successfully')
    } catch (e: any) { setMsg('✗ ' + e.message) }
    finally { setSaving(false) }
  }

  const uploadPhoto = async (file: File, type: 'profile' | 'logo') => {
    setUploading(type)
    try {
      const res = await api.uploadFile(file, type)
      setProfile((p: any) => ({ ...p, [type === 'profile' ? 'profilePhoto' : 'logo']: res.url }))
      setMsg(`✓ ${type === 'profile' ? 'Photo' : 'Logo'} uploaded`)
    } catch (e: any) { setMsg('✗ ' + e.message) }
    finally { setUploading(null) }
  }

  const set = (key: string, val: any) => setProfile((p: any) => ({ ...p, [key]: val }))
  const setSocial = (key: string, val: string) => setProfile((p: any) => ({ ...p, social: { ...p.social, [key]: val } }))

  if (!profile) return (
    <AdminShell>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
      </div>
    </AdminShell>
  )

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">Profile Settings</h1>
            <p className="text-white/30 text-sm font-mono mt-1">Manage your public profile</p>
          </div>
          <button onClick={save} disabled={saving}
            className="px-6 py-2.5 rounded-xl font-bold text-sm tracking-widest transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #00F5FF, #7B2FBE)', color: '#030712' }}>
            {saving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </div>

        {msg && (
          <div className={`px-4 py-3 rounded-xl text-sm font-mono border ${msg.startsWith('✓') ? 'text-green-400 border-green-400/20 bg-green-400/5' : 'text-red-400 border-red-400/20 bg-red-400/5'}`}>
            {msg}
          </div>
        )}

        {/* Photos */}
        <div className="rounded-2xl p-6 border border-white/5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <h2 className="text-white/60 text-xs font-mono tracking-widest">MEDIA</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Profile Photo */}
            <div>
              <p className="text-white/40 text-xs font-mono mb-3">PROFILE PHOTO</p>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full border-2 border-white/10 overflow-hidden flex items-center justify-center bg-white/5">
                  {profile.profilePhoto
                    ? <img src={`http://localhost:5000${profile.profilePhoto}`} alt="" className="w-full h-full object-cover" />
                    : <span className="text-white/20 text-2xl font-bold">{profile.name?.[0]}</span>}
                </div>
                <div>
                  <input ref={photoRef} type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files?.[0] && uploadPhoto(e.target.files[0], 'profile')} />
                  <button onClick={() => photoRef.current?.click()} disabled={uploading === 'profile'}
                    className="px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-xs font-mono transition-all">
                    {uploading === 'profile' ? 'UPLOADING...' : 'UPLOAD PHOTO'}
                  </button>
                </div>
              </div>
            </div>
            {/* Logo */}
            <div>
              <p className="text-white/40 text-xs font-mono mb-3">LOGO</p>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl border-2 border-white/10 overflow-hidden flex items-center justify-center bg-white/5">
                  {profile.logo
                    ? <img src={`http://localhost:5000${profile.logo}`} alt="" className="w-full h-full object-contain p-2" />
                    : <span className="text-white/20 text-xs font-mono">LOGO</span>}
                </div>
                <div>
                  <input ref={logoRef} type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files?.[0] && uploadPhoto(e.target.files[0], 'logo')} />
                  <button onClick={() => logoRef.current?.click()} disabled={uploading === 'logo'}
                    className="px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-xs font-mono transition-all">
                    {uploading === 'logo' ? 'UPLOADING...' : 'UPLOAD LOGO'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="rounded-2xl p-6 border border-white/5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <h2 className="text-white/60 text-xs font-mono tracking-widest">BASIC INFO</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'FULL NAME', placeholder: 'Bhumil Prajapati' },
              { key: 'title', label: 'TITLE', placeholder: 'Video Editor & Developer' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-white/30 text-xs font-mono tracking-widest block mb-2">{f.label}</label>
                <input value={profile[f.key] || ''} onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 px-4 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400/40 transition-colors" />
              </div>
            ))}
          </div>
          <div>
            <label className="text-white/30 text-xs font-mono tracking-widest block mb-2">TAGLINE</label>
            <input value={profile.tagline || ''} onChange={e => set('tagline', e.target.value)}
              placeholder="I Turn Ideas Into Visual Experiences"
              className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 px-4 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400/40 transition-colors" />
          </div>
          <div>
            <label className="text-white/30 text-xs font-mono tracking-widest block mb-2">ABOUT DESCRIPTION</label>
            <textarea value={profile.about || ''} onChange={e => set('about', e.target.value)}
              placeholder="Write about yourself..." rows={5}
              className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 px-4 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400/40 transition-colors resize-none" />
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-2xl p-6 border border-white/5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <h2 className="text-white/60 text-xs font-mono tracking-widest">CONTACT DETAILS</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'contactEmail', label: 'EMAIL', placeholder: 'your@email.com' },
              { key: 'phone', label: 'PHONE', placeholder: '+91 98765 43210' },
              { key: 'whatsapp', label: 'WHATSAPP', placeholder: '+919876543210' },
              { key: 'location', label: 'LOCATION', placeholder: 'India' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-white/30 text-xs font-mono tracking-widest block mb-2">{f.label}</label>
                <input value={profile[f.key] || ''} onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 px-4 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400/40 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Social */}
        <div className="rounded-2xl p-6 border border-white/5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <h2 className="text-white/60 text-xs font-mono tracking-widest">SOCIAL MEDIA LINKS</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'youtube', label: 'YOUTUBE', placeholder: 'https://youtube.com/@...' },
              { key: 'instagram', label: 'INSTAGRAM', placeholder: 'https://instagram.com/...' },
              { key: 'linkedin', label: 'LINKEDIN', placeholder: 'https://linkedin.com/in/...' },
              { key: 'github', label: 'GITHUB', placeholder: 'https://github.com/...' },
              { key: 'twitter', label: 'TWITTER/X', placeholder: 'https://twitter.com/...' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-white/30 text-xs font-mono tracking-widest block mb-2">{f.label}</label>
                <input value={profile.social?.[f.key] || ''} onChange={e => setSocial(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 px-4 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400/40 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
