'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { api } from '@/lib/api'

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState<any | null>(null)

  const load = () => {
    setLoading(true)
    api.getMessages().then(r => { setMessages(r.data); setLoading(false) }).catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const del = async (id: string) => {
    if (!confirm('Delete this message?')) return
    await api.deleteMessage(id); setSelected(null); load()
  }

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto space-y-5">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Messages</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{messages.length} total</p>
          </div>
          <button onClick={load} className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-5 h-5 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-xl p-16 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-3xl mb-3">📭</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>No messages yet</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-4">

            {/* List */}
            <div className="lg:col-span-2 space-y-1.5">
              {messages.map(m => (
                <button key={m._id} onClick={() => setSelected(m)}
                  className="w-full text-left flex items-start gap-3 p-3.5 rounded-xl transition-all"
                  style={{
                    background: selected?._id === m._id ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${selected?._id === m._id ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                  <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-400 text-xs font-semibold">{m.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-white text-sm font-medium truncate">{m.name}</span>
                      <span className="text-xs flex-shrink-0 ml-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        {new Date(m.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>{m.message}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Detail */}
            <div className="lg:col-span-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {!selected ? (
                <div className="flex items-center justify-center h-48 text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  Select a message
                </div>
              ) : (
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center">
                        <span className="text-indigo-400 font-semibold">{selected.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{selected.name}</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{selected.email}</p>
                      </div>
                    </div>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      {new Date(selected.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{selected.message}</p>

                  <div className="flex gap-2 pt-1">
                    <a href={`mailto:${selected.email}?subject=Re: Your message`}
                      className="flex-1 py-2.5 rounded-lg text-center text-sm font-semibold text-white transition-all"
                      style={{ background: '#6366f1' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#4f46e5')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#6366f1')}>
                      Reply via Email
                    </a>
                    <button onClick={() => del(selected._id)}
                      className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.8)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(239,68,68,0.8)')}>
                      Delete
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
