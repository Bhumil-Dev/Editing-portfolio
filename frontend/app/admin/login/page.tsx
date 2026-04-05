'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { saveToken, isLoggedIn } from '@/lib/auth'

export default function AdminLogin() {
  const router = useRouter()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [show, setShow]       = useState(false)

  useEffect(() => {
    if (isLoggedIn()) router.replace('/admin/dashboard')
    document.body.classList.add('admin-page')
    return () => document.body.classList.remove('admin-page')
  }, [router])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const res = await api.login(form.email, form.password)
      saveToken(res.token)
      router.replace('/admin/dashboard')
    } catch (err: any) { setError(err.message || 'Invalid credentials') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4"
      style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>

      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-lg">BP</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-xl">Admin Panel</h1>
            <p className="text-white/30 text-sm mt-1">Sign in to manage your portfolio</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-white/50 text-xs font-medium block mb-1.5">Email</label>
            <input type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="bhumilprajapati4@gmail.com" required
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>

          <div>
            <label className="text-white/50 text-xs font-medium block mb-1.5">Password</label>
            <div className="relative">
              <input type={show ? 'text' : 'password'} value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" required
                className="w-full px-4 py-3 pr-16 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs transition-colors px-1">
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs px-1">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: loading ? 'rgba(99,102,241,0.5)' : '#6366f1' }}
            onMouseEnter={e => { if (!loading) (e.target as HTMLElement).style.background = '#4f46e5' }}
            onMouseLeave={e => { if (!loading) (e.target as HTMLElement).style.background = '#6366f1' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-white/15 text-xs">
          Protected with JWT + bcrypt
        </p>
      </div>
    </div>
  )
}
