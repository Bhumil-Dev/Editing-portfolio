'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { saveToken, isLoggedIn } from '@/lib/auth'

export default function AdminLogin() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isLoggedIn()) router.replace('/admin/dashboard')
    // Restore default cursor on login page
    document.body.classList.add('admin-page')
    return () => document.body.classList.remove('admin-page')
  }, [router])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.login(form.email, form.password)
      saveToken(res.token)
      router.replace('/admin/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
      {/* Grid bg */}
      <div className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,245,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.03) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7B2FBE, transparent)' }} />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-cyan-400/30"
            style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.1), transparent)' }}>
            <span className="text-cyan-400 font-bold text-xl">BP</span>
          </div>
          <h1 className="text-white font-bold text-2xl tracking-widest">ADMIN PANEL</h1>
          <p className="text-white/30 text-xs font-mono mt-1 tracking-widest">SECURE ACCESS ONLY</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 border border-white/8"
          style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)' }}>
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="text-white/40 text-xs font-mono tracking-widest block mb-2">EMAIL ADDRESS</label>
              <input
                type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="admin@example.com" required
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs font-mono tracking-widest block mb-2">PASSWORD</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400/50 transition-colors pr-12"
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs font-mono transition-colors">
                  {show ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm font-mono">
                ⚠ {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-sm tracking-widest transition-all duration-300 disabled:opacity-50"
              style={{
                background: loading ? 'rgba(0,245,255,0.3)' : 'linear-gradient(135deg, #00F5FF, #7B2FBE)',
                color: loading ? '#fff' : '#030712',
              }}
            >
              {loading ? 'AUTHENTICATING...' : 'LOGIN →'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/15 text-xs font-mono mt-6 tracking-widest">
          PROTECTED BY JWT + BCRYPT
        </p>
      </div>
    </div>
  )
}
