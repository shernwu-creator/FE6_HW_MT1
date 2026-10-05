import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { copyFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import process from 'node:process'

// 將 dist/index.html 複製為 dist/404.html。
// GitHub Pages 對未知路徑會回傳 404.html，
// 有了這份副本，重新整理子路由（例如 /map、/tour/tour-du-mont-blanc）時才不會真的 404。
function spa404Fallback() {
  return {
    name: 'spa-404-fallback',
    apply: 'build',
    closeBundle() {
      const distDir = resolve(fileURLToPath(new URL('.', import.meta.url)), 'dist')
      const indexHtml = resolve(distDir, 'index.html')
      const notFoundHtml = resolve(distDir, '404.html')
      if (existsSync(indexHtml)) copyFileSync(indexHtml, notFoundHtml)
    },
  }
}

export default defineConfig({
  plugins: [react(), spa404Fallback()],
  // 自動判斷：在 Netlify 上編譯用 '/'，否則（GitHub Pages）用倉庫名稱 '/FE6_HW_MT1/'
  base: process.env.NETLIFY ? '/' : '/FE6_HW_MT1/',
})
