'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { isLoggedIn, removeToken } from '@/lib/auth'

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard',  icon: '▣' },
  { href: '/admin/profile',   label: 'Profile',    icon: '◎' },
  { href: '/admin/stats',     label: 'Stats',      icon: '◈' },
  { href: '/admin/skills',    label: 'Skills',     icon: '◇' },
  { href: '/admin/services',  label: 'Services',   icon: '◆' },
  { href: '/admin/portfolio', label: 'Portfolio',  icon: '▤' },
  { href: '/admin/messages',  label: 'Messages',   icon: '◻' },
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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
    </div>
  )

  const currentPage = nav.find(n => n.href === pathname)?.label || ''

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-56 flex flex-col
        transition-transform duration-300 lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `} style={{ background: '#111111', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">BP</span>
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Bhumil</p>
              <p className="text-white/30 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {nav.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  active
                    ? 'bg-indigo-600/15 text-indigo-400 font-medium'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/4'
                }`}
              >
                <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/5 space-y-0.5">
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/30 hover:text-white/60 hover:bg-white/4 transition-all">
            <span className="text-base w-5 text-center">↗</span>
            View Site
          </Link>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/50 hover:text-red-400 hover:bg-red-500/5 transition-all">
            <span className="text-base w-5 text-center">⏻</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* ── Main ── */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center gap-4 px-5 py-3.5 border-b border-white/5"
          style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)' }}>
          <button onClick={() => setOpen(!open)}
            className="lg:hidden text-white/40 hover:text-white p-1 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p className="text-white/50 text-sm">{currentPage}</p>
          <div className="ml-auto flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-white/25 text-xs">Live</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 md:p-7 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
