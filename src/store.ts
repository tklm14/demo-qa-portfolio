// タスクの永続化ロジック
// localStorage を使ってサーバーなしでCRUD操作を実現する

// タスクのデータ型定義
export type Task = {
  id: string        // UUID（一意な識別子）
  title: string     // タイトル（最大50文字）
  memo: string      // メモ（任意）
  dueDate: string   // 期限（YYYY-MM-DD形式、任意）
  completed: boolean // 完了フラグ
  createdAt: string  // 作成日時（ISO8601形式）
}

// localStorageのキー名
const TASKS_KEY = 'qa_demo_tasks'

// タスク一覧を取得する
export function getTasks(): Task[] {
  const data = localStorage.getItem(TASKS_KEY)
  return data ? (JSON.parse(data) as Task[]) : []
}

// タスク一覧をlocalStorageに保存する（内部用）
function saveTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

// タスクを新規追加して追加後のTaskを返す
export function addTask(title: string): Task {
  const tasks = getTasks()
  const task: Task = {
    id: crypto.randomUUID(),
    title,
    memo: '',
    dueDate: '',
    completed: false,
    createdAt: new Date().toISOString(),
  }
  tasks.push(task)
  saveTasks(tasks)
  return task
}

// 指定したIDのタスクを削除する
export function deleteTask(id: string): void {
  const tasks = getTasks().filter((t) => t.id !== id)
  saveTasks(tasks)
}

// 指定したIDのタスクの完了状態を切り替える
export function toggleTask(id: string): void {
  const tasks = getTasks().map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  )
  saveTasks(tasks)
}

// 指定したIDのタスクを部分的に更新する
export function updateTask(id: string, updates: Partial<Task>): void {
  const tasks = getTasks().map((t) =>
    t.id === id ? { ...t, ...updates } : t
  )
  saveTasks(tasks)
}

// 指定したIDのタスクを1件取得する（存在しない場合はundefined）
export function getTaskById(id: string): Task | undefined {
  return getTasks().find((t) => t.id === id)
}
