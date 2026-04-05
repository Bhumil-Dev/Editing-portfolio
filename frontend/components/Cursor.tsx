'use client'
import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const dotRef      = useRef<HTMLDivElement>(null)
  const ringRef     = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const dot  = dotRef.current
    const ring = ringRef.current
    const prog = progressRef.current
    if (!dot || !ring) return

    let mx = 0, my = 0, rx = 0, ry = 0, rafId: number

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      dot.style.left = mx - 3 + 'px'
      dot.style.top  = my - 3 + 'px'
    }
    const tick = () => {
      rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1
      ring.style.left = rx - 16 + 'px'; ring.style.top = ry - 16 + 'px'
      rafId = requestAnimationFrame(tick)
    }
    const onScroll = () => {
      if (!prog) return
      const max = document.body.scrollHeight - window.innerHeight
      prog.style.width = max > 0 ? Math.min((window.scrollY / max) * 100, 100) + '%' : '0%'
    }
    const onEnter = () => { dot.classList.add('hovered'); ring.classList.add('hovered') }
    const onLeave = () => { dot.classList.remove('hovered'); ring.classList.remove('hovered') }

    document.addEventListener('mousemove', onMove)
    window.addEventListener('scroll', onScroll, { passive: true })
    rafId = requestAnimationFrame(tick)

    const attach = () => document.querySelectorAll('a,button,[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', onEnter); el.addEventListener('mouseleave', onLeave)
    })
    attach()
    const obs = new MutationObserver(attach)
    obs.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId); obs.disconnect()
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <>
      {/* Custom cursor dot */}
      <div ref={dotRef} style={{
        position: 'fixed', width: 6, height: 6, borderRadius: '50%',
        background: '#6366f1', pointerEvents: 'none', zIndex: 9998,
        boxShadow: '0 0 8px #6366f1', transition: 'background 0.2s, transform 0.15s',
        left: '-20px', top: '-20px',
      }} className="cursor-dot" />
      {/* Ring */}
      <div ref={ringRef} style={{
        position: 'fixed', width: 32, height: 32, borderRadius: '50%',
        border: '1px solid rgba(99,102,241,0.4)', pointerEvents: 'none', zIndex: 9997,
        transition: 'width 0.25s, height 0.25s, border-color 0.25s',
        left: '-30px', top: '-30px',
      }} className="cursor-ring" />
      {/* Scroll progress */}
      <div id="scroll-progress" ref={progressRef} style={{ width: '0%' }} />
    </>
  )
}
