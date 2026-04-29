// ログイン画面のPage Object Model
// 画面操作をクラスとして抽象化し、テストコードからDOMを直接触らないようにする
import { type Page, type Locator } from '@playwright/test'

export class LoginPage {
  readonly page: Page

  // 画面要素のロケーター定義（data-testid で要素を特定する）
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.getByTestId('email-input')
    this.passwordInput = page.getByTestId('password-input')
    this.loginButton = page.getByTestId('login-button')
    this.errorMessage = page.getByTestId('error-message')
  }

  // ログイン画面を開く
  async goto(): Promise<void> {
    await this.page.goto('/index.html')
  }

  // メールアドレスとパスワードを入力してログインボタンを押す
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
  }

  // 表示中のエラーメッセージを取得する
  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? ''
  }
}
