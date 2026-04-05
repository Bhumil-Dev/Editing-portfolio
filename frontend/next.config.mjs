/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during production builds — handled separately
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds even with type errors
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'images.unsplash.com',
      'upload.wikimedia.org',
      'cdn.worldvectorlogo.com',
      'cdn.jsdelivr.net',
      'localhost',
      'bhumil-portfolio-backend.onrender.com',
    ],
  },
}

export default nextConfig
