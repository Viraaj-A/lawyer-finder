/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // Proxy /api/ai/* requests to Flask backend
        source: '/api/ai/:path*',
        destination: 
          process.env.NODE_ENV === 'production'
            ? '/api/ai/:path*'  // In production, use Vercel serverless
            : 'http://127.0.0.1:5328/api/ai/:path*', // In dev, proxy to Flask
      },
    ]
  },
}

module.exports = nextConfig