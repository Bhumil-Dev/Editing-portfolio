'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    const count  = 2500
    const pos    = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random()-0.5)*25
      pos[i*3+1] = (Math.random()-0.5)*25
      pos[i*3+2] = (Math.random()-0.5)*25
      if (Math.random()<0.5) { colors[i*3]=0; colors[i*3+1]=0.96; colors[i*3+2]=1 }
      else                   { colors[i*3]=0.48; colors[i*3+1]=0.18; colors[i*3+2]=0.74 }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3))
    const mat       = new THREE.PointsMaterial({ size:0.025, vertexColors:true, transparent:true, opacity:0.7 })
    const particles = new THREE.Points(geo, mat)
    scene.add(particles)

    let mx=0, my=0
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX/window.innerWidth  - 0.5)*0.8
      my = (e.clientY/window.innerHeight - 0.5)*0.8
    }
    window.addEventListener('mousemove', onMouse)

    let id: number
    const tick = () => {
      id = requestAnimationFrame(tick)
      particles.rotation.y += 0.0004
      particles.rotation.x += 0.0002
      camera.position.x += (mx - camera.position.x)*0.04
      camera.position.y += (-my - camera.position.y)*0.04
      renderer.render(scene, camera)
    }
    tick()

    const onResize = () => {
      camera.aspect = window.innerWidth/window.innerHeight
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

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}
