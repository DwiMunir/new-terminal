import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  // Lean production image: only traced files end up in .next/standalone.
  output: 'standalone',
  // Keep file tracing scoped to this project (it lives inside a multi-app folder).
  outputFileTracingRoot: path.resolve(dirname),
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }],
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
