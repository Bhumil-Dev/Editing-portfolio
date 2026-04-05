'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { isLoggedIn, removeToken } from '@/lib/auth'

const nav = [
  { href: '/admin/dashboard', icon: '⬡', label: 'Dashboard' },
  { href: '/admin/profile',   icon: '◉', label: 'Profile' },
  { href: '/admin/skills',    icon: '◈', label: 'Skills' },
  { href: '/admin/services',  icon: '◇', label: 'Services' },
  { href: '/admin/portfolio', icon: '◰', label: 'Portfolio' },
  { href: '/admin/messages',  icon: '◻', label: 'Messages' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isLoggedIn()) router.replace('/admin/login')
    // Restore default cursor on admin pages
    document.body.classList.add('admin-page')
    return () => document.body.classList.remove('admin-page')
  }, [router])

  const logout = () => { removeToken(); router.replace('/admin/login') }

  if (!mounted) return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#030712] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'rgba(10,15,30,0.98)', borderRight: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>

        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center border border-cyan-400/30"
              style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.15), transparent)' }}>
              <span className="text-cyan-400 text-xs font-bold">BP</span>
            </div>
            <div>
              <p className="text-white text-sm font-bold tracking-wider">ADMIN</p>
              <p className="text-white/30 text-xs font-mono">PANEL</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {nav.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-mono tracking-wider transition-all duration-200 ${
                  active
                    ? 'text-cyan-400 border border-cyan-400/20'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                }`}
                style={active ? { background: 'rgba(0,245,255,0.06)' } : {}}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/30 hover:text-white/60 text-xs font-mono tracking-wider hover:bg-white/5 transition-all">
            <span>↗</span> View Site
          </Link>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400/60 hover:text-red-400 text-xs font-mono tracking-wider hover:bg-red-500/5 transition-all">
            <span>⏻</span> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-white/5"
          style={{ background: 'rgba(3,7,18,0.9)', backdropFilter: 'blur(20px)' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-white/50 hover:text-white p-1">
            <div className="space-y-1.5">
              <span className="block w-5 h-px bg-current" />
              <span className="block w-5 h-px bg-current" />
              <span className="block w-5 h-px bg-current" />
            </div>
          </button>
          <div className="hidden lg:block">
            <p className="text-white/50 text-xs font-mono tracking-widest">
              {nav.find(n => n.href === pathname)?.label || pathname.split('/').pop()?.toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/30 text-xs font-mono">ONLINE</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
