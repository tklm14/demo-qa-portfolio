import { defineConfig, devices } from '@playwright/test'

// Playwright の全体設定
// E2Eテスト（UIテスト）と APIテスト を1つの設定ファイルで管理する
export default defineConfig({
  // テストを並列実行してCIを高速化する
  fullyParallel: true,
  // CI環境では .only が残っているとエラーにする（テスト漏れ防止）
  forbidOnly: !!process.env.CI,
  // CI環境では失敗したテストを2回リトライする
  retries: process.env.CI ? 2 : 0,
  // テスト結果をHTML形式で出力する（自動では開かない）
  reporter: [['html', { open: 'never' }]],
  use: {
    // テスト実行時のベースURL（Vite preview サーバー）
    baseURL: 'http://localhost:4173',
    // 失敗した場合のみトレースを保存する（デバッグ用）
    trace: 'on-first-retry',
  },
  projects: [
    {
      // E2Eテスト：ブラウザを使ったUIテスト
      name: 'e2e',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // APIテスト：ブラウザなし、HTTPリクエストのみ
      name: 'api',
      testDir: './tests/api',
    },
  ],
  // テスト実行前にアプリをビルドしてプレビューサーバーを起動する
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    // CI以外では既存のサーバーを使い回してビルド時間を短縮する
    reuseExistingServer: !process.env.CI,
  },
})
