import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'src',
  // GitHub Pagesへデプロイする際はリポジトリ名をbaseに設定する
  // ローカル開発・CI（テスト実行）時は'/'のまま
  base: process.env.VITE_BASE ?? '/',
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
