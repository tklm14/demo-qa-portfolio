// タスクCRUD機能のテスト
// 追加・削除・完了切替・編集を正常系・異常系・境界値で検証する
import { test, expect } from '@playwright/test'
import { TaskListPage } from '../pages/TaskListPage.ts'
import { TaskDetailPage } from '../pages/TaskDetailPage.ts'

test.describe('タスクCRUD機能', () => {
  let listPage: TaskListPage

  test.beforeEach(async ({ page }) => {
    // index.htmlを開いてからlocalStorageをセットする
    // context.addInitScript は全ナビゲーションで毎回実行されるため使わない
    // （task-detail.htmlへ遷移するとlocalStorageがリセットされてしまう）
    await page.goto('/index.html')
    await page.evaluate(() => {
      localStorage.setItem('qa_demo_auth', 'true')
      localStorage.removeItem('qa_demo_tasks')
    })
    listPage = new TaskListPage(page)
    await listPage.goto()
  })

  // T-01: 正常系 - タスクが追加されて一覧に表示される
  test('タスク追加（正常）：一覧にタスクが追加される', async () => {
    await listPage.addTask('テストタスク')
    expect(await listPage.getTaskCount()).toBe(1)
    expect(await listPage.getTaskTitle(0)).toBe('テストタスク')
  })

  // T-02: 異常系 - タイトル未入力のバリデーションエラー
  test('タスク追加（空タイトル）：バリデーションエラーが表示される', async ({ page }) => {
    await listPage.addTask('')
    await expect(page.getByTestId('validation-error')).toHaveText(
      'タイトルを入力してください'
    )
  })

  // T-03: 境界値 - 50文字（上限）は正常に追加される
  test('タスク追加（50文字）：正常に追加される', async () => {
    const title50 = 'あ'.repeat(50)
    await listPage.addTask(title50)
    expect(await listPage.getTaskCount()).toBe(1)
  })

  // T-04: 境界値 - 51文字（上限超過）はバリデーションエラー
  test('タスク追加（51文字）：バリデーションエラーが表示される', async ({ page }) => {
    const title51 = 'あ'.repeat(51)
    await listPage.addTask(title51)
    await expect(page.getByTestId('validation-error')).toHaveText(
      'タイトルは50文字以内で入力してください'
    )
  })

  // T-05: 正常系 - タスク削除後に件数が減る
  test('タスク削除：一覧から消えて件数が減る', async () => {
    await listPage.addTask('削除するタスク')
    expect(await listPage.getTaskCount()).toBe(1)
    await listPage.deleteTask(0)
    expect(await listPage.getTaskCount()).toBe(0)
  })

  // T-06: 正常系 - チェックボックスONで完了状態になる
  test('完了に変更：タスクが完了状態になる', async ({ page }) => {
    await listPage.addTask('完了テスト')
    await listPage.toggleTask(0)
    // 完了済みのタイトルに completed クラスが付く
    await expect(page.getByTestId('task-title').first()).toHaveClass(/completed/)
  })

  // T-07: 正常系 - チェックボックスOFFで未完了に戻る
  test('完了→未完了に戻す：completedクラスが外れる', async ({ page }) => {
    await listPage.addTask('往復テスト')
    await listPage.toggleTask(0)   // 完了にする
    await listPage.toggleTask(0)   // 未完了に戻す
    await expect(page.getByTestId('task-title').first()).not.toHaveClass(
      /completed/
    )
  })

  // T-08: 正常系 - 詳細画面で編集した内容が一覧に反映される
  test('タスク編集：変更後のタイトルが一覧に表示される', async ({ page }) => {
    await listPage.addTask('編集前タイトル')
    await listPage.clickEditTask(0)

    // 詳細画面で編集する
    const detailPage = new TaskDetailPage(page)
    await detailPage.editTask('編集後タイトル', 'メモ内容', '2026-12-31')
    await detailPage.save()

    // 一覧に戻って変更が反映されているか確認する
    expect(await listPage.getTaskTitle(0)).toBe('編集後タイトル')
  })
})
