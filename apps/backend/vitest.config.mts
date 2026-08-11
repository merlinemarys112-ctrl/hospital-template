import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@payload-config': path.resolve(dirname, 'src/payload.config.ts'),
      '@': path.resolve(dirname, 'src'),
    },
  },
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts'],
    testTimeout: 60_000,
    hookTimeout: 120_000,
    fileParallelism: false,
  },
})
