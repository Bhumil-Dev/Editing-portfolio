'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import gsap from 'gsap'
import * as THREE from 'three'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    // Particles
    const count = 3000
    const pos = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25
      const t = Math.random()
      if (t < 0.5) { colors[i*3]=0; colors[i*3+1]=0.96; colors[i*3+2]=1 }
      else { colors[i*3]=0.48; colors[i*3+1]=0.18; colors[i*3+2]=0.74 }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const mat = new THREE.PointsMaterial({ size: 0.025, vertexColors: true, transparent: true, opacity: 0.7, sizeAttenuation: true })
    const particles = new THREE.Points(geo, mat)
    scene.add(particles)

    // Mouse parallax
    let mx = 0, my = 0
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 0.8
      my = (e.clientY / window.innerHeight - 0.5) * 0.8
    }
    window.addEventListener('mousemove', onMouse)

    let id: number
    const tick = () => {
      id = requestAnimationFrame(tick)
      particles.rotation.y += 0.0004
      particles.rotation.x += 0.0002
      camera.position.x += (mx - camera.position.x) * 0.04
      camera.position.y += (-my - camera.position.y) * 0.04
      renderer.render(scene, camera)
    }
    tick()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  // GSAP headline entrance
  useEffect(() => {
    if (!headlineRef.current) return
    const words = headlineRef.current.querySelectorAll('.word')
    gsap.fromTo(words,
      { opacity: 0, y: 60, rotateX: -90 },
      { opacity: 1, y: 0, rotateX: 0, stagger: 0.15, duration: 1, delay: 1.2, ease: 'power4.out' }
    )
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-dark/60 to-dark z-[1]" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-dark to-transparent z-[1]" />

      {/* Glowing orbs */}
      <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 z-[1]"
        style={{ background: 'radial-gradient(circle, #00F5FF, transparent)' }}
        animate={{ scale: [1,1.3,1], opacity:[0.05,0.15,0.05] }} transition={{ duration:6, repeat:Infinity }} />
      <motion.div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10 z-[1]"
        style={{ background: 'radial-gradient(circle, #7B2FBE, transparent)' }}
        animate={{ scale: [1.2,1,1.2], opacity:[0.08,0.18,0.08] }} transition={{ duration:8, repeat:Infinity }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-2 glass-cyan px-4 py-2 rounded-full mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
          <span className="text-cyan font-mono text-xs tracking-[0.3em]">AVAILABLE FOR PROJECTS</span>
        </motion.div>

        {/* Headline */}
        <div ref={headlineRef} className="perspective-1000 mb-6">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-tight">
            <span className="word inline-block opacity-0">I Turn</span>{' '}
            <span className="word inline-block opacity-0">Ideas</span>{' '}
            <span className="word inline-block opacity-0">Into</span>
            <br />
            <span className="word inline-block opacity-0 cyan-text text-glow-cyan">Visual</span>{' '}
            <span className="word inline-block opacity-0 cyan-text text-glow-cyan">Experiences</span>
          </h1>
        </div>

        {/* Type animation */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
          className="text-white/40 font-mono text-sm md:text-lg mb-10 h-8"
        >
          <span className="text-cyan/60">{'> '}</span>
          <TypeAnimation
            sequence={['Video Editor & Storyteller', 2000, 'MERN Stack Developer', 2000, 'Motion Graphics Artist', 2000, 'Three.js & GSAP Specialist', 2000]}
            wrapper="span" speed={50} repeat={Infinity}
          />
          <span className="text-cyan animate-pulse">_</span>
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#portfolio" className="btn-primary btn-magnetic">
            VIEW MY WORK
          </a>
          <a href="#contact" className="btn-outline btn-magnetic">
            LET'S TALK →
          </a>
        </motion.div>

        {/* Scroll indicator — hidden on small screens */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
          className="hidden sm:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="text-white/20 font-mono text-xs tracking-[0.4em]">SCROLL</span>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-12 bg-gradient-to-b from-cyan/60 to-transparent" />
        </motion.div>
      </div>
    </section>
  )
}
