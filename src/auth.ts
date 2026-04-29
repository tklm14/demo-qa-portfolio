// 認証ロジック
// ログイン・ログアウト・セッション管理を担当する

// デモ用の固定アカウント（サーバー不要のためハードコード）
const DEMO_EMAIL = 'demo@example.com'
const DEMO_PASSWORD = 'Demo1234'

// localStorageのキー名
const AUTH_KEY = 'qa_demo_auth'

// メールアドレスのバリデーション
// 未入力・形式不正をそれぞれ区別してエラーメッセージを返す
export function validateEmail(email: string): string | null {
  if (!email) return 'メールアドレスを入力してください'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '正しい形式で入力してください'
  return null
}

// パスワードのバリデーション（未入力チェックのみ）
export function validatePassword(password: string): string | null {
  if (!password) return 'パスワードを入力してください'
  return null
}

// 認証情報の照合（固定値との一致チェック）
export function authenticate(email: string, password: string): boolean {
  return email === DEMO_EMAIL && password === DEMO_PASSWORD
}

// ログイン状態をlocalStorageに保存する
export function setAuth(): void {
  localStorage.setItem(AUTH_KEY, 'true')
}

// ログアウト時にlocalStorageから認証情報を削除する
export function clearAuth(): void {
  localStorage.removeItem(AUTH_KEY)
}

// 現在ログイン中かどうかを確認する
export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === 'true'
}

// 未ログインの場合にログイン画面へリダイレクトする
// 認証が必要なページの先頭で呼び出す
export function requireAuth(): void {
  if (!isAuthenticated()) {
    window.location.href = './index.html'
  }
}
