'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { api } from '@/lib/api'

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)

  const load = () => {
    setLoading(true)
    api.getMessages().then(r => { setMessages(r.data); setLoading(false) }).catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const del = async (id: string) => {
    if (!confirm('Delete this message?')) return
    await api.deleteMessage(id)
    setSelected(null); load()
  }

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">Messages</h1>
            <p className="text-white/30 text-sm font-mono mt-1">{messages.length} total messages</p>
          </div>
          <button onClick={load} className="px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white text-xs font-mono transition-all">
            ↻ REFRESH
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-2xl p-16 border border-white/5 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-4xl mb-4">📭</p>
            <p className="text-white/30 font-mono text-sm">No messages yet</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4">
            {/* List */}
            <div className="space-y-2">
              {messages.map(m => (
                <div key={m._id}
                  onClick={() => setSelected(m)}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    selected?._id === m._id
                      ? 'border-cyan-400/30 bg-cyan-400/5'
                      : 'border-white/5 hover:border-white/10 bg-white/2'
                  }`}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border border-white/10"
                    style={{ background: 'rgba(0,245,255,0.08)' }}>
                    <span className="text-cyan-400 text-sm font-bold">{m.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm font-medium">{m.name}</span>
                      <span className="text-white/20 text-xs font-mono">{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-white/40 text-xs truncate">{m.email}</p>
                    <p className="text-white/30 text-xs mt-1 truncate">{m.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Detail */}
            <div className="rounded-2xl border border-white/5 h-fit sticky top-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
              {!selected ? (
                <div className="p-12 text-center text-white/20 font-mono text-sm">
                  Select a message to view
                </div>
              ) : (
                <div className="p-6 space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center border border-cyan-400/20"
                        style={{ background: 'rgba(0,245,255,0.08)' }}>
                        <span className="text-cyan-400 font-bold">{selected.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-white font-bold">{selected.name}</p>
                        <p className="text-white/40 text-xs font-mono">{selected.email}</p>
                      </div>
                    </div>
                    <span className="text-white/20 text-xs font-mono">{new Date(selected.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="h-px bg-white/5" />

                  <div>
                    <p className="text-white/30 text-xs font-mono tracking-widest mb-3">MESSAGE</p>
                    <p className="text-white/70 text-sm leading-relaxed">{selected.message}</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <a href={`mailto:${selected.email}?subject=Re: Your message`}
                      className="flex-1 py-2.5 rounded-xl text-center font-bold text-xs tracking-widest transition-all"
                      style={{ background: 'linear-gradient(135deg, #00F5FF, #7B2FBE)', color: '#030712' }}>
                      REPLY VIA EMAIL
                    </a>
                    <button onClick={() => del(selected._id)}
                      className="px-4 py-2.5 rounded-xl border border-red-400/20 text-red-400 text-xs font-mono hover:bg-red-400/10 transition-colors">
                      DELETE
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
