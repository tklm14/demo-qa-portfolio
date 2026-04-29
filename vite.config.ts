import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'src',
  base: '/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        tasks: resolve(__dirname, 'src/tasks.html'),
        taskDetail: resolve(__dirname, 'src/task-detail.html'),
      },
    },
  },
  server: { port: 5173 },
  preview: { port: 4173 },
})
