'use client'
import dynamic from 'next/dynamic'
import Loader from '@/components/Loader'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import Portfolio from '@/components/Portfolio'
import Testimonials from '@/components/Testimonials'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

const Cursor = dynamic(() => import('@/components/Cursor'), { ssr: false })

export default function Home() {
  return (
    <>
      <Cursor />
      <Loader />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Testimonials />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
