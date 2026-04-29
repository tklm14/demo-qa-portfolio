// タスク詳細・編集画面のPage Object Model
import { type Page, type Locator } from '@playwright/test'

export class TaskDetailPage {
  readonly page: Page

  // 画面要素のロケーター定義
  readonly titleInput: Locator
  readonly memoInput: Locator
  readonly dueDateInput: Locator
  readonly saveButton: Locator
  readonly backButton: Locator

  constructor(page: Page) {
    this.page = page
    this.titleInput = page.getByTestId('title-input')
    this.memoInput = page.getByTestId('memo-input')
    this.dueDateInput = page.getByTestId('due-date-input')
    this.saveButton = page.getByTestId('save-button')
    this.backButton = page.getByTestId('back-button')
  }

  // タイトル・メモ・期限を入力してフォームを更新する
  // 空文字を渡した場合はそのフィールドをスキップする
  async editTask(title: string, memo: string, dueDate: string): Promise<void> {
    if (title) await this.titleInput.fill(title)
    if (memo) await this.memoInput.fill(memo)
    if (dueDate) await this.dueDateInput.fill(dueDate)
  }

  // 保存ボタンを押して一覧へ戻る
  async save(): Promise<void> {
    await this.saveButton.click()
  }

  // 戻るボタンを押して保存せずに一覧へ戻る
  async back(): Promise<void> {
    await this.backButton.click()
  }
}
