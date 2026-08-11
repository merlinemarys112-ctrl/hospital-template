import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

let apiHostname = 'localhost'
let apiProtocol: 'http' | 'https' = 'http'
try {
  const parsed = new URL(apiUrl)
  apiHostname = parsed.hostname
  apiProtocol = parsed.protocol.replace(':', '') as 'http' | 'https'
} catch {
  // keep defaults
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: dirname,
  turbopack: {
    root: dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: apiProtocol,
        hostname: apiHostname,
        pathname: '/api/media/**',
      },
    ],
  },
}

export default nextConfig
