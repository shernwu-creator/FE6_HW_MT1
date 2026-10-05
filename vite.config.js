import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // 自動判斷：如果在 Netlify 上編譯就用 '/'，否則（GitHub Pages）就用 '/fe6-react/'
  base: process.env.NETLIFY ? '/' : '/fe6-react/',
})