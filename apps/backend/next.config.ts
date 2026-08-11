import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const serverURL =
  process.env.PAYLOAD_PUBLIC_SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  'http://localhost:3000'

const nextConfig: NextConfig = {
  sassOptions: {
    loadPaths: ['./node_modules/@payloadcms/ui/dist/scss/'],
  },
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }],
    qualities: [100],
    remotePatterns: [
      (() => {
        const url = new URL(serverURL)
        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', '') as 'http' | 'https',
        }
      })(),
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  reactStrictMode: true,
  // Keep tracing/turbopack roots at the app — a parent Documents/package-lock.json
  // otherwise makes Turbopack treat the wrong folder as workspace root.
  outputFileTracingRoot: dirname,
  turbopack: {
    root: dirname,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
