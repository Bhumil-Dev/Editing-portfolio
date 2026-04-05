'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { api } from '@/lib/api'

interface Stats { projects: number; skills: number; services: number; messages: number; recent: any[] }

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className="rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors"
      style={{ background: 'rgba(255,255,255,0.03)' }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs font-mono tracking-widest px-2 py-1 rounded-full border"
          style={{ color, borderColor: `${color}30`, background: `${color}10` }}>LIVE</span>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-white/40 text-xs font-mono tracking-wider">{label}</p>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.stats().then(r => { setStats(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">Dashboard</h1>
          <p className="text-white/30 text-sm font-mono mt-1">Welcome back, Bhumil 👋</p>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl p-6 border border-white/5 animate-pulse h-32"
                style={{ background: 'rgba(255,255,255,0.03)' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="TOTAL PROJECTS" value={stats?.projects || 0} icon="◰" color="#00F5FF" />
            <StatCard label="TOTAL SKILLS" value={stats?.skills || 0} icon="◈" color="#7B2FBE" />
            <StatCard label="TOTAL SERVICES" value={stats?.services || 0} icon="◇" color="#00FF88" />
            <StatCard label="MESSAGES" value={stats?.messages || 0} icon="◻" color="#F59E0B" />
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-white/60 text-xs font-mono tracking-widest mb-4">QUICK ACTIONS</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { href: '/admin/profile',   icon: '◉', label: 'Edit Profile',  color: '#00F5FF' },
              { href: '/admin/skills',    icon: '◈', label: 'Add Skill',     color: '#7B2FBE' },
              { href: '/admin/services',  icon: '◇', label: 'Add Service',   color: '#00FF88' },
              { href: '/admin/portfolio', icon: '◰', label: 'Add Project',   color: '#F59E0B' },
              { href: '/admin/messages',  icon: '◻', label: 'Messages',      color: '#EF4444' },
              { href: '/',                icon: '↗', label: 'View Site',     color: '#6B7280' },
            ].map(a => (
              <a key={a.href} href={a.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 hover:border-white/15 transition-all hover:-translate-y-0.5 text-center"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <span className="text-xl" style={{ color: a.color }}>{a.icon}</span>
                <span className="text-white/50 text-xs font-mono">{a.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div>
          <h2 className="text-white/60 text-xs font-mono tracking-widest mb-4">RECENT MESSAGES</h2>
          <div className="rounded-2xl border border-white/5 overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            {!stats?.recent?.length ? (
              <div className="p-8 text-center text-white/20 font-mono text-sm">No messages yet</div>
            ) : (
              <div className="divide-y divide-white/5">
                {stats.recent.map((m: any) => (
                  <div key={m._id} className="flex items-start gap-4 p-4 hover:bg-white/2 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-cyan-400 text-xs font-bold">{m.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white text-sm font-medium">{m.name}</span>
                        <span className="text-white/30 text-xs font-mono">{m.email}</span>
                      </div>
                      <p className="text-white/40 text-xs truncate">{m.message}</p>
                    </div>
                    <span className="text-white/20 text-xs font-mono flex-shrink-0">
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
