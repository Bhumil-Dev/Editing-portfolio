import type { Metadata } from 'next'
import { Inter, Space_Grotesk, Space_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space', display: 'swap' })
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'Bhumil Prajapati | Video Editor & MERN Stack Developer',
  description: 'Premium cinematic portfolio — Video Editor & MERN Stack Developer turning ideas into visual experiences.',
  keywords: ['Video Editor', 'MERN Stack', 'Web Developer', 'Motion Graphics', 'React', 'Next.js', 'Three.js'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
