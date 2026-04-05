'use client'
import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const dot = dotRef.current
    const ring = ringRef.current
    const progress = progressRef.current
    if (!dot || !ring) return

    let mx = 0, my = 0, rx = 0, ry = 0
    let rafId: number

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      dot.style.left = mx - 4 + 'px'
      dot.style.top  = my - 4 + 'px'
    }

    const tick = () => {
      rx += (mx - rx) * 0.1
      ry += (my - ry) * 0.1
      ring.style.left = rx - 18 + 'px'
      ring.style.top  = ry - 18 + 'px'
      rafId = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      if (!progress) return
      const max = document.body.scrollHeight - window.innerHeight
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0
      progress.style.width = Math.min(pct, 100) + '%'
    }

    const onEnter = () => { dot.classList.add('hovered'); ring.classList.add('hovered') }
    const onLeave = () => { dot.classList.remove('hovered'); ring.classList.remove('hovered') }

    document.addEventListener('mousemove', onMove)
    window.addEventListener('scroll', onScroll, { passive: true })
    rafId = requestAnimationFrame(tick)

    // Attach to interactive elements (re-query on DOM changes)
    const attachHover = () => {
      document.querySelectorAll('a,button,[data-hover]').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }
    attachHover()
    const observer = new MutationObserver(attachHover)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ left: '-20px', top: '-20px' }} />
      <div ref={ringRef} className="cursor-ring" style={{ left: '-30px', top: '-30px' }} />
      <div id="scroll-progress" ref={progressRef} style={{ width: '0%' }} />
      <div className="scanline" />
    </>
  )
}
