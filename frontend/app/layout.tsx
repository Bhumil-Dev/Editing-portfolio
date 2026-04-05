import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bhumil Prajapati | Video Editor & MERN Stack Developer',
  description: 'Professional Video Editor & MERN Stack Developer — creating cinematic edits, motion graphics, and modern web apps.',
  keywords: ['Video Editor', 'MERN Stack', 'Web Developer', 'Motion Graphics', 'React', 'Next.js'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  )
}
