// ログイン機能のテスト
// 正常系・異常系・セキュリティを網羅する
import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage.ts'

// デモ用の正しい認証情報
const VALID_EMAIL = 'demo@example.com'
const VALID_PASSWORD = 'Demo1234'

test.describe('ログイン機能', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goto()
  })

  // L-01: 正常系 - 正しい認証情報でログインできること
  test('正常ログイン：正しい認証情報でタスク一覧へ遷移する', async ({ page }) => {
    await loginPage.login(VALID_EMAIL, VALID_PASSWORD)
    await expect(page).toHaveURL(/tasks\.html/)
  })

  // L-02: 異常系 - メールアドレス未入力のエラーメッセージ
  test('メール未入力：エラーメッセージが表示される', async () => {
    await loginPage.login('', VALID_PASSWORD)
    const msg = await loginPage.getErrorMessage()
    expect(msg).toBe('メールアドレスを入力してください')
  })

  // L-03: 異常系 - メールアドレス形式不正（@なし）
  test('メール形式不正：エラーメッセージが表示される', async () => {
    await loginPage.login('userexample.com', VALID_PASSWORD)
    const msg = await loginPage.getErrorMessage()
    expect(msg).toBe('正しい形式で入力してください')
  })

  // L-04: 異常系 - パスワード未入力のエラーメッセージ
  test('パスワード未入力：エラーメッセージが表示される', async () => {
    await loginPage.login(VALID_EMAIL, '')
    const msg = await loginPage.getErrorMessage()
    expect(msg).toBe('パスワードを入力してください')
  })

  // L-05: 異常系 - 誤ったパスワードで認証失敗
  test('認証失敗：エラーメッセージが表示される', async () => {
    await loginPage.login(VALID_EMAIL, 'wrongpassword')
    const msg = await loginPage.getErrorMessage()
    expect(msg).toBe('メールアドレスまたはパスワードが正しくありません')
  })

  // L-06: 正常系 - ログアウト後にログイン画面へ戻ること
  test('ログアウト：ログイン画面へ戻る', async ({ page }) => {
    // index.htmlを経由してlocalStorageをセットしてからtasks.htmlへ遷移する
    await page.goto('/index.html')
    await page.evaluate(() => {
      localStorage.setItem('qa_demo_auth', 'true')
    })
    await page.goto('/tasks.html')
    await page.getByTestId('logout-button').click()
    await expect(page).toHaveURL(/index\.html/)
  })

  // L-07: セキュリティ - ログアウト後にブラウザバックしても一覧へ戻れないこと
  test('ログアウト後のブラウザバック：ログイン画面のまま', async ({ page }) => {
    // index.htmlを経由してlocalStorageをセットしてからtasks.htmlへ遷移する
    await page.goto('/index.html')
    await page.evaluate(() => {
      localStorage.setItem('qa_demo_auth', 'true')
    })
    await page.goto('/tasks.html')
    await page.getByTestId('logout-button').click()
    // ブラウザバックしても認証なしなのでrequireAuth()がindex.htmlへリダイレクトする
    await page.goBack()
    await expect(page).toHaveURL(/index\.html/)
  })
})
