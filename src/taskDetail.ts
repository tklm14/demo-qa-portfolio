// タスク詳細・編集画面の制御ロジック
import { requireAuth } from './auth.ts'
import { getTaskById, updateTask } from './store.ts'

// 未ログインの場合はログイン画面へリダイレクトする
requireAuth()

// URLのクエリパラメータからタスクIDを取得する
const params = new URLSearchParams(window.location.search)
const taskId = params.get('id')

// IDが取得できない場合は一覧画面へ戻る
if (!taskId) {
  window.location.href = './tasks.html'
}

const task = taskId ? getTaskById(taskId) : undefined

// 対象タスクが存在しない場合は一覧画面へ戻る
if (!task) {
  window.location.href = './tasks.html'
}

// 画面要素の取得
const titleInput = document.querySelector('[data-testid="title-input"]') as HTMLInputElement
const memoInput = document.querySelector('[data-testid="memo-input"]') as HTMLTextAreaElement
const dueDateInput = document.querySelector('[data-testid="due-date-input"]') as HTMLInputElement
const saveBtn = document.querySelector('[data-testid="save-button"]') as HTMLButtonElement
const backBtn = document.querySelector('[data-testid="back-button"]') as HTMLButtonElement

// 既存のタスクデータをフォームに反映する
if (task) {
  titleInput.value = task.title
  memoInput.value = task.memo
  dueDateInput.value = task.dueDate
}

// 保存ボタン：変更内容を保存して一覧へ戻る
saveBtn.addEventListener('click', () => {
  if (!taskId) return

  updateTask(taskId, {
    title: titleInput.value.trim(),
    memo: memoInput.value,
    dueDate: dueDateInput.value,
  })

  window.location.href = './tasks.html'
})

// 戻るボタン：保存せずに一覧へ戻る
backBtn.addEventListener('click', () => {
  window.location.href = './tasks.html'
})
