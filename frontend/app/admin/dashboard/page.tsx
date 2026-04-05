'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { api } from '@/lib/api'
import Link from 'next/link'

interface Stats { projects: number; skills: number; services: number; messages: number; recent: any[] }

export default function Dashboard() {
  const [stats, setStats]   = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.stats().then(r => { setStats(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Projects',  value: stats?.projects || 0, href: '/admin/portfolio', color: '#6366f1' },
    { label: 'Skills',    value: stats?.skills   || 0, href: '/admin/skills',    color: '#8b5cf6' },
    { label: 'Services',  value: stats?.services || 0, href: '/admin/services',  color: '#10b981' },
    { label: 'Messages',  value: stats?.messages || 0, href: '/admin/messages',  color: '#f59e0b' },
  ]

  const quickLinks = [
    { href: '/admin/profile',   label: 'Edit Profile' },
    { href: '/admin/stats',     label: 'Edit Stats' },
    { href: '/admin/skills',    label: 'Manage Skills' },
    { href: '/admin/services',  label: 'Manage Services' },
    { href: '/admin/portfolio', label: 'Add Project' },
    { href: '/',                label: '↗ View Site', external: true },
  ]

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-white">Dashboard</h1>
          <p className="text-white/30 text-sm mt-1">Welcome back, Bhumil</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl p-5 animate-pulse h-24"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }} />
              ))
            : cards.map(c => (
                <Link key={c.label} href={c.href}
                  className="rounded-xl p-5 transition-all hover:scale-[1.02] block"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-3xl font-bold text-white mb-1">{c.value}</p>
                  <p className="text-white/40 text-xs">{c.label}</p>
                  <div className="mt-3 h-0.5 rounded-full w-8" style={{ background: c.color }} />
                </Link>
              ))
          }
        </div>

        {/* Quick actions */}
        <div>
          <p className="text-white/30 text-xs font-medium tracking-wider mb-3">QUICK ACTIONS</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {quickLinks.map(l => (
              <Link key={l.href} href={l.href} target={l.external ? '_blank' : undefined}
                className="px-4 py-3 rounded-xl text-sm text-white/50 hover:text-white transition-all hover:bg-white/5"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent messages */}
        <div>
          <p className="text-white/30 text-xs font-medium tracking-wider mb-3">RECENT MESSAGES</p>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            {!stats?.recent?.length ? (
              <div className="p-8 text-center text-white/20 text-sm">No messages yet</div>
            ) : (
              <div className="divide-y divide-white/5">
                {stats.recent.map((m: any) => (
                  <div key={m._id} className="flex items-start gap-3 p-4 hover:bg-white/2 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-400 text-xs font-semibold">{m.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white text-sm font-medium">{m.name}</span>
                        <span className="text-white/25 text-xs">{m.email}</span>
                      </div>
                      <p className="text-white/35 text-xs truncate">{m.message}</p>
                    </div>
                    <span className="text-white/20 text-xs flex-shrink-0">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </AdminShell>
  )
}
