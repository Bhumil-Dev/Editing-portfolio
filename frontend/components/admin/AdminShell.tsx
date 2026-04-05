'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { isLoggedIn, removeToken } from '@/lib/auth'

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard',  icon: '▣', desc: 'Overview' },
  { href: '/admin/profile',   label: 'Profile',    icon: '◎', desc: 'Personal info' },
  { href: '/admin/stats',     label: 'Stats',      icon: '◈', desc: 'Numbers' },
  { href: '/admin/skills',    label: 'Skills',     icon: '◇', desc: 'Tech stack' },
  { href: '/admin/services',  label: 'Services',   icon: '◆', desc: 'Offerings' },
  { href: '/admin/portfolio', label: 'Portfolio',  icon: '▤', desc: 'Projects' },
  { href: '/admin/messages',  label: 'Messages',   icon: '◻', desc: 'Inbox' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [open, setOpen]       = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isLoggedIn()) router.replace('/admin/login')
    document.body.classList.add('admin-page')
    return () => document.body.classList.remove('admin-page')
  }, [router])

  const logout = () => { removeToken(); router.replace('/admin/login') }

  if (!mounted) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
      <div className="w-5 h-5 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
    </div>
  )

  const current = nav.find(n => n.href === pathname)

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0a', fontFamily: 'var(--font-inter), Inter, sans-serif' }}>

      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-52 flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#0f0f0f', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

        {/* Brand */}
        <div className="px-4 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">BP</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold leading-none">Bhumil</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {nav.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group"
                style={{
                  background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                  color: active ? '#a5b4fc' : 'rgba(255,255,255,0.38)',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.38)' }}>
                <span className="text-sm w-4 text-center flex-shrink-0">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {active && <div className="ml-auto w-1 h-4 rounded-full bg-indigo-500" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-2 py-3 border-t space-y-0.5" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}>
            <span className="text-sm w-4 text-center">↗</span>
            <span>View Site</span>
          </Link>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
            style={{ color: 'rgba(239,68,68,0.5)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = 'rgba(239,68,68,0.9)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(239,68,68,0.5)' }}>
            <span className="text-sm w-4 text-center">⏻</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}

      {/* ── Main content ── */}
      <div className="flex-1 lg:ml-52 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center gap-4 px-5 py-3 border-b"
          style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.05)' }}>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-1 transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>Admin</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>{current?.label || 'Panel'}</span>
          </div>

          {/* Status */}
          <div className="ml-auto flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>Live</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
