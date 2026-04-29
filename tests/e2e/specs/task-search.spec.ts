// タスク検索・絞り込み機能のテスト
import { test, expect } from '@playwright/test'
import { TaskListPage } from '../pages/TaskListPage.ts'

test.describe('タスク検索機能', () => {
  let listPage: TaskListPage

  test.beforeEach(async ({ page }) => {
    // index.htmlを開いてからlocalStorageにテスト用データをセットする
    // context.addInitScript は全ナビゲーションで毎回実行されるため使わない
    await page.goto('/index.html')
    await page.evaluate(() => {
      localStorage.setItem('qa_demo_auth', 'true')
      localStorage.setItem(
        'qa_demo_tasks',
        JSON.stringify([
          {
            id: '1',
            title: 'Playwrightでテストを書く',
            memo: '',
            dueDate: '',
            completed: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'TypeScriptの学習',
            memo: '',
            dueDate: '',
            completed: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: '3',
            title: 'GitHubにpushする',
            memo: '',
            dueDate: '',
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ])
      )
    })
    listPage = new TaskListPage(page)
    await listPage.goto()
  })

  // S-01: 正常系 - キーワードに一致するタスクだけ表示される
  test('検索ヒットあり：該当タスクのみ表示される', async () => {
    await listPage.searchTask('Playwright')
    expect(await listPage.getTaskCount()).toBe(1)
    expect(await listPage.getTaskTitle(0)).toContain('Playwright')
  })

  // S-02: 正常系 - 一致するタスクがない場合に「該当なし」メッセージが表示される
  test('検索ヒットなし：「該当するタスクはありません」が表示される', async ({
    page,
  }) => {
    await listPage.searchTask('存在しないキーワード')
    await expect(page.getByTestId('empty-message')).toBeVisible()
  })

  // S-03: 正常系 - キーワードをクリアすると全件表示に戻る
  test('検索クリア：全件表示に戻る', async () => {
    await listPage.searchTask('Playwright')
    expect(await listPage.getTaskCount()).toBe(1)
    // 検索欄をクリアする
    await listPage.searchTask('')
    expect(await listPage.getTaskCount()).toBe(3)
  })

  // S-04: 仕様確認 - 大文字小文字を区別せずに検索できる
  test('大文字小文字不問：小文字で登録したタスクを大文字で検索してもヒットする', async () => {
    // 「playwright」は小文字だが「PLAYWRIGHT」で検索する
    await listPage.searchTask('PLAYWRIGHT')
    expect(await listPage.getTaskCount()).toBe(1)
  })
})
