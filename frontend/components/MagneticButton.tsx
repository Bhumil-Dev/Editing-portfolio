'use client'
import { useRef, ReactNode } from 'react'
import gsap from 'gsap'

interface Props {
  children: ReactNode
  className?: string
  href?: string
  onClick?: () => void
  strength?: number
}

export default function MagneticButton({ children, className = '', href, onClick, strength = 0.35 }: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    gsap.to(el, { x, y, duration: 0.3, ease: 'power2.out' })
  }

  const onLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  }

  const props = { ref, className, onMouseMove: onMove, onMouseLeave: onLeave, onClick }

  if (href) {
    return <a href={href} {...props}>{children}</a>
  }
  return <button {...props}>{children}</button>
}
