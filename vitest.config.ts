import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

// vite-plugin-sitemap writes dist/sitemap.xml from a build-only hook and crashes
// during vitest runs (no dist/ directory exists), so exclude it from the test config.
const plugins = (viteConfig.plugins ?? []).filter((plugin) => {
  if (!plugin || typeof plugin !== 'object') return true
  return !('name' in plugin && plugin.name === 'vite-plugin-sitemap')
})

export default mergeConfig(
  { ...viteConfig, plugins },
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: true,
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
  }),
)
