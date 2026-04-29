// ログイン画面の制御ロジック
import { validateEmail, validatePassword, authenticate, setAuth } from './auth.ts'

// フォーム要素の取得
const form = document.getElementById('login-form') as HTMLFormElement
const emailInput = document.getElementById('email') as HTMLInputElement
const passwordInput = document.getElementById('password') as HTMLInputElement
const errorEl = document.querySelector('[data-testid="error-message"]') as HTMLElement

// エラーメッセージを表示する
function showError(message: string): void {
  errorEl.textContent = message
  errorEl.hidden = false
}

// エラーメッセージをクリアする
function clearError(): void {
  errorEl.textContent = ''
  errorEl.hidden = true
}

// ログインフォームの送信処理
form.addEventListener('submit', (e) => {
  e.preventDefault()
  clearError()

  const email = emailInput.value.trim()
  const password = passwordInput.value

  // メールアドレスのバリデーション（未入力 → 形式不正の順で確認）
  const emailError = validateEmail(email)
  if (emailError) {
    showError(emailError)
    return
  }

  // パスワードのバリデーション
  const passwordError = validatePassword(password)
  if (passwordError) {
    showError(passwordError)
    return
  }

  // 認証情報の照合
  if (!authenticate(email, password)) {
    showError('メールアドレスまたはパスワードが正しくありません')
    return
  }

  // 認証成功：セッションを保存してタスク一覧へ遷移する
  setAuth()
  window.location.href = './tasks.html'
})
