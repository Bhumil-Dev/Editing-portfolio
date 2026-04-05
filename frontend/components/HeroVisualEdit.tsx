'use client'
import { motion } from 'framer-motion'

// Timeline clips
const clips = [
  { label: 'Intro',    width: 80,  color: '#6366f1', start: 0 },
  { label: 'Scene 1',  width: 120, color: '#8b5cf6', start: 88 },
  { label: 'B-Roll',   width: 60,  color: '#a78bfa', start: 216 },
  { label: 'Outro',    width: 90,  color: '#6366f1', start: 284 },
]

const audioClips = [
  { width: 200, color: '#10b981', start: 0 },
  { width: 180, color: '#10b981', start: 208 },
]

// Floating tool badges
const tools = [
  { label: '🎬 Premiere Pro', color: '#9999FF', top: '8%',  left: '-55px', delay: 0.9 },
  { label: '✨ After Effects', color: '#a78bfa', top: '35%', right: '-65px', delay: 1.1 },
  { label: '🎨 DaVinci',      color: '#FF6B6B', top: '62%', left: '-50px', delay: 1.3 },
  { label: '📱 CapCut',       color: '#ffffff', top: '85%', right: '-45px', delay: 1.5 },
]

// Waveform bars
const waveHeights = [4, 8, 14, 10, 6, 16, 12, 8, 18, 10, 6, 14, 8, 12, 16, 6, 10, 14, 8, 12]

export default function HeroVisualEdit() {
  return (
    <div className="relative w-full h-[480px] flex items-center justify-center select-none">

      {/* Ambient glow — purple/violet for editing */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />

      {/* ── Main video editor card ── */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-sm"
      >
        <div className="rounded-2xl overflow-hidden"
          style={{
            background: '#0f0f17',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.12)',
          }}>

          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b"
            style={{ background: '#161622', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>project_edit.prproj</span>
            {/* REC indicator */}
            <div className="ml-auto flex items-center gap-1.5">
              <motion.div className="w-2 h-2 rounded-full bg-red-500"
                animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
              <span className="text-red-400 text-xs font-medium">REC</span>
            </div>
          </div>

          {/* Preview window */}
          <div className="relative mx-3 mt-3 rounded-lg overflow-hidden"
            style={{ background: '#000', aspectRatio: '16/9' }}>
            {/* Fake video frame */}
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)' }}>
              {/* Cinematic bars */}
              <div className="absolute top-0 left-0 right-0 h-4" style={{ background: '#000' }} />
              <div className="absolute bottom-0 left-0 right-0 h-4" style={{ background: '#000' }} />
              {/* Scene content */}
              <motion.div className="text-center"
                animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity }}>
                <div className="text-4xl mb-1">🎬</div>
                <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Scene 01 — Take 3</p>
              </motion.div>
              {/* Timecode */}
              <div className="absolute bottom-5 right-3 font-mono text-xs"
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                  00:01:24:12
                </motion.span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="px-3 pt-3 pb-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Timeline</span>
              <div className="flex items-center gap-2">
                {/* Playback controls */}
                {['⏮', '⏸', '⏭'].map((c, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                    className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{c}</motion.button>
                ))}
              </div>
            </div>

            {/* Video track */}
            <div className="mb-1.5">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs w-12 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>V1</span>
                <div className="flex-1 h-7 rounded relative overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {clips.map((clip, i) => (
                    <motion.div key={i}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ delay: 0.6 + i * 0.15, duration: 0.4, ease: 'easeOut' }}
                      style={{
                        position: 'absolute', left: clip.start / 4.5, top: 2, bottom: 2,
                        width: clip.width / 4.5, background: clip.color,
                        borderRadius: 3, transformOrigin: 'left',
                        opacity: 0.85,
                      }}>
                      <span className="absolute inset-0 flex items-center px-1.5 text-white text-xs font-medium truncate"
                        style={{ fontSize: 9 }}>{clip.label}</span>
                    </motion.div>
                  ))}
                  {/* Playhead */}
                  <motion.div className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10"
                    style={{ left: '35%' }}
                    animate={{ left: ['35%', '65%', '35%'] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
                </div>
              </div>

              {/* Audio track */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs w-12 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>A1</span>
                <div className="flex-1 h-7 rounded relative overflow-hidden flex items-center px-1 gap-px"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {waveHeights.map((h, i) => (
                    <motion.div key={i}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.8 + i * 0.03 }}
                      className="flex-1 rounded-sm"
                      style={{ height: h, background: '#10b981', opacity: 0.7, transformOrigin: 'center' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Effects bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="flex items-center gap-2 px-3 py-2.5 border-t"
            style={{ background: '#8b5cf6', borderColor: 'rgba(255,255,255,0.1)' }}>
            <span className="text-white text-xs font-medium">✓ Color graded</span>
            <span className="text-white/50 text-xs ml-auto">4K Export Ready</span>
          </motion.div>
        </div>

        {/* ── Floating stat cards ── */}
        {[
          { value: '10M+', label: 'Views',    color: '#8b5cf6', pos: 'top-4 right-0',   delay: 0.9 },
          { value: '150+', label: 'Projects', color: '#10b981', pos: 'bottom-8 left-0', delay: 1.1 },
        ].map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: s.delay, duration: 0.4 }}
            className={`absolute ${s.pos} px-4 py-3 rounded-xl text-center`}
            style={{
              background: 'rgba(15,15,23,0.95)',
              border: `1px solid ${s.color}30`,
              backdropFilter: 'blur(12px)',
              boxShadow: `0 8px 24px rgba(0,0,0,0.4)`,
              minWidth: 80,
            }}>
            <motion.p className="font-bold text-lg leading-none" style={{ color: s.color }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}>
              {s.value}
            </motion.p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</p>
          </motion.div>
        ))}

        {/* ── Floating tool badges ── */}
        {tools.map((t, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: t.delay, duration: 0.4 }}
            className="absolute px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap"
            style={{
              background: 'rgba(15,15,23,0.92)',
              border: `1px solid ${t.color}35`,
              color: t.color === '#ffffff' ? 'rgba(255,255,255,0.8)' : t.color,
              backdropFilter: 'blur(8px)',
              top: t.top,
              left: (t as any).left,
              right: (t as any).right,
            }}>
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: t.delay }}>
              {t.label}
            </motion.span>
          </motion.div>
        ))}
      </motion.div>

      {/* Orbiting ring */}
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ width: 340, height: 340, border: '1px dashed rgba(139,92,246,0.15)', top: '50%', left: '50%', marginTop: -170, marginLeft: -170 }}
        animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}>
        <motion.div className="absolute w-2.5 h-2.5 rounded-full bg-violet-500"
          style={{ top: -5, left: '50%', marginLeft: -5, boxShadow: '0 0 10px #8b5cf6' }} />
      </motion.div>

      {/* Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ width: 3, height: 3, background: i % 2 === 0 ? '#8b5cf6' : '#a78bfa', left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%`, opacity: 0.4 }}
          animate={{ y: [0, -10, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }} />
      ))}
    </div>
  )
}
