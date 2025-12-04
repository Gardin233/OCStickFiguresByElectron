// Vite 配置
// - server.port 固定为 5173，主进程通过环境变量加载此地址
// - build.outDir 指定为 dist，并保留 tsc 输出（emptyOutDir: false）
import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: false
  },
  server: {
    port: 5173,
    strictPort: true
  }
})
