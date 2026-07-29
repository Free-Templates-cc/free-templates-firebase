import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Sitemap from 'vite-plugin-sitemap'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Sitemap({
      hostname: 'https://free-templates.cc',
      dynamicRoutes: [
        '/templates',
        '/pricing',
        '/terms',
        '/privacy',
        '/contact',
        '/faq',
      ],
      exclude: ['/login', '/register', '/forgot-password', '/account', '/account/downloads'],
      lastmod: new Date(),
      priority: {
        '/': 1.0,
        '/templates': 0.9,
        '/pricing': 0.8,
      },
      changefreq: {
        '/': 'weekly',
        '/templates': 'daily',
        '/pricing': 'monthly',
      },
      generateRobotsTxt: false,
      outDir: 'dist',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) {
            return 'vendor'
          }
          // Split Firebase SDK into sub-chunks per service to stay under 500 kB
          if (id.includes('node_modules/firebase/auth')) {
            return 'firebase-auth'
          }
          if (id.includes('node_modules/firebase/firestore')) {
            return 'firebase-firestore'
          }
          if (id.includes('node_modules/firebase/storage')) {
            return 'firebase-storage'
          }
          if (id.includes('node_modules/firebase/app')) {
            return 'firebase-app'
          }
          if (id.includes('node_modules/firebase')) {
            return 'firebase-other'
          }
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/clsx') || id.includes('node_modules/tailwind-merge')) {
            return 'ui'
          }
        },
      },
    },
  },
})
