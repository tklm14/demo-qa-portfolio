import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/login.ts', 'src/taskList.ts', 'src/taskDetail.ts'],
      thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 },
    },
  },
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
