// E2Eシナリオテスト
// ユーザーが実際に使う一連の操作フローを検証する
// 単機能テストでは発見できない「画面をまたいだ連携バグ」を検出することが目的
import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage.ts'
import { TaskListPage } from '../pages/TaskListPage.ts'
import { TaskDetailPage } from '../pages/TaskDetailPage.ts'

test.describe('E2Eシナリオテスト', () => {
  test.beforeEach(async ({ page }) => {
    // index.htmlを開いてからlocalStorageをクリアしてフレッシュな状態にする
    // context.addInitScript は全ナビゲーションで毎回実行されるため使わない
    await page.goto('/index.html')
    await page.evaluate(() => {
      localStorage.removeItem('qa_demo_auth')
      localStorage.removeItem('qa_demo_tasks')
    })
  })

  // E-01: 基本業務フロー
  // ログイン → タスク追加（3件）→ 1件完了 → 検索 → ログアウト
  test('基本業務フロー：ログインから作業してログアウトまで', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page)
    const listPage = new TaskListPage(page)

    // ① ログイン
    await loginPage.goto()
    await loginPage.login('demo@example.com', 'Demo1234')
    await expect(page).toHaveURL(/tasks\.html/)

    // ② タスクを3件追加する
    await listPage.addTask('Playwright学習')
    await listPage.addTask('TypeScript復習')
    await listPage.addTask('GitHub Actions設定')
    expect(await listPage.getTaskCount()).toBe(3)

    // ③ 1件目を完了にする
    await listPage.toggleTask(0)
    await expect(page.getByTestId('task-title').nth(0)).toHaveClass(
      /completed/
    )

    // ④ キーワードで絞り込む
    await listPage.searchTask('Playwright')
    expect(await listPage.getTaskCount()).toBe(1)

    // ⑤ ログアウトしてログイン画面へ戻る
    await listPage.logout()
    await expect(page).toHaveURL(/index\.html/)
  })

  // E-02: 編集フロー
  // ログイン → タスク追加 → 詳細編集・保存 → 一覧で変更を確認
  test('編集フロー：追加したタスクを編集して変更が反映される', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page)
    const listPage = new TaskListPage(page)
    const detailPage = new TaskDetailPage(page)

    // ① ログインする
    await loginPage.goto()
    await loginPage.login('demo@example.com', 'Demo1234')

    // ② タスクを追加する
    await listPage.addTask('変更前のタイトル')

    // ③ 編集画面へ遷移して内容を変更する
    await listPage.clickEditTask(0)
    await detailPage.editTask('変更後のタイトル', '編集メモ', '2026-12-31')
    await detailPage.save()

    // ④ 一覧画面に戻って変更が反映されているか確認する
    await expect(page).toHaveURL(/tasks\.html/)
    expect(await listPage.getTaskTitle(0)).toBe('変更後のタイトル')
  })
})
