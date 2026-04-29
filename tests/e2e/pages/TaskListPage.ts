// タスク一覧画面のPage Object Model
import { type Page, type Locator } from '@playwright/test'

export class TaskListPage {
  readonly page: Page

  // 画面要素のロケーター定義
  readonly taskTitleInput: Locator
  readonly addButton: Locator
  readonly searchInput: Locator
  readonly taskList: Locator
  readonly emptyMessage: Locator
  readonly validationError: Locator
  readonly logoutButton: Locator

  constructor(page: Page) {
    this.page = page
    this.taskTitleInput = page.getByTestId('task-title-input')
    this.addButton = page.getByTestId('add-task-button')
    this.searchInput = page.getByTestId('search-input')
    this.taskList = page.getByTestId('task-list')
    this.emptyMessage = page.getByTestId('empty-message')
    this.validationError = page.getByTestId('validation-error')
    this.logoutButton = page.getByTestId('logout-button')
  }

  // タスク一覧画面を開く
  async goto(): Promise<void> {
    await this.page.goto('/tasks.html')
  }

  // タイトルを入力して追加ボタンを押す
  async addTask(title: string): Promise<void> {
    await this.taskTitleInput.fill(title)
    await this.addButton.click()
  }

  // 指定インデックスのタスクを削除する（0始まり）
  async deleteTask(index: number): Promise<void> {
    await this.page
      .getByTestId('delete-task-button')
      .nth(index)
      .click()
  }

  // 指定インデックスのチェックボックスをクリックして完了状態を切り替える
  async toggleTask(index: number): Promise<void> {
    await this.page
      .getByTestId('task-checkbox')
      .nth(index)
      .click()
  }

  // 検索キーワードを入力してフィルタリングする
  async searchTask(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword)
  }

  // 現在表示されているタスクの件数を返す
  async getTaskCount(): Promise<number> {
    return await this.page.getByTestId('task-item').count()
  }

  // 指定インデックスのタスクのタイトルを返す
  async getTaskTitle(index: number): Promise<string> {
    return (
      (await this.page
        .getByTestId('task-title')
        .nth(index)
        .textContent()) ?? ''
    )
  }

  // 指定インデックスのタスクの編集画面へ遷移する
  async clickEditTask(index: number): Promise<void> {
    await this.page
      .getByTestId('edit-task-button')
      .nth(index)
      .click()
  }

  // ログアウトボタンを押す
  async logout(): Promise<void> {
    await this.logoutButton.click()
  }
}
