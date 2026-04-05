/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint:     { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    unoptimized: true,
    domains: [
      'images.unsplash.com',
      'upload.wikimedia.org',
      'cdn.worldvectorlogo.com',
      'localhost',
      'bhumil-portfolio-backend.onrender.com',
    ],
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
}

export default nextConfig
