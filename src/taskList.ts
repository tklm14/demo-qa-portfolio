// タスク一覧画面の制御ロジック
import { requireAuth, clearAuth } from './auth.ts'
import { getTasks, addTask, deleteTask, toggleTask } from './store.ts'

// 未ログインの場合はログイン画面へリダイレクトする
requireAuth()

// 画面要素の取得
const taskInput = document.querySelector('[data-testid="task-title-input"]') as HTMLInputElement
const addBtn = document.querySelector('[data-testid="add-task-button"]') as HTMLButtonElement
const searchInput = document.querySelector('[data-testid="search-input"]') as HTMLInputElement
const taskList = document.querySelector('[data-testid="task-list"]') as HTMLUListElement
const emptyMsg = document.querySelector('[data-testid="empty-message"]') as HTMLElement
const validationError = document.querySelector('[data-testid="validation-error"]') as HTMLElement
const logoutBtn = document.querySelector('[data-testid="logout-button"]') as HTMLButtonElement

// タスク一覧を描画する
// keyword が指定されている場合はタイトルでフィルタリングする
function renderTasks(keyword = ''): void {
  const tasks = getTasks()

  // 大文字小文字を区別せずフィルタリングする
  const filtered = keyword
    ? tasks.filter((t) => t.title.toLowerCase().includes(keyword.toLowerCase()))
    : tasks

  // 一覧をクリアしてから再描画する
  taskList.innerHTML = ''

  if (filtered.length === 0) {
    // 0件の場合は「該当なし」メッセージを表示する
    emptyMsg.hidden = false
  } else {
    emptyMsg.hidden = true
    filtered.forEach((task) => {
      const li = document.createElement('li')
      li.setAttribute('data-testid', 'task-item')
      li.setAttribute('data-task-id', task.id)
      li.innerHTML = `
        <input
          type="checkbox"
          data-testid="task-checkbox"
          ${task.completed ? 'checked' : ''}
        />
        <span
          data-testid="task-title"
          class="${task.completed ? 'completed' : ''}"
        >${task.title}</span>
        <button data-testid="edit-task-button" data-id="${task.id}">編集</button>
        <button data-testid="delete-task-button" data-id="${task.id}">削除</button>
      `
      taskList.appendChild(li)
    })
  }
}

// 追加ボタンのクリック処理
addBtn.addEventListener('click', () => {
  const title = taskInput.value.trim()
  validationError.hidden = true

  // 未入力チェック
  if (!title) {
    validationError.textContent = 'タイトルを入力してください'
    validationError.hidden = false
    return
  }

  // 文字数チェック（上限50文字）
  if (title.length > 50) {
    validationError.textContent = 'タイトルは50文字以内で入力してください'
    validationError.hidden = false
    return
  }

  addTask(title)
  taskInput.value = ''
  renderTasks(searchInput.value)
})

// チェックボックスの変更でタスクの完了状態を切り替える
// イベント委任でリスト全体を監視する
taskList.addEventListener('change', (e) => {
  const target = e.target as HTMLInputElement
  if (target.dataset['testid'] === 'task-checkbox') {
    const li = target.closest('li')
    const id = li?.getAttribute('data-task-id')
    if (id) {
      toggleTask(id)
      renderTasks(searchInput.value)
    }
  }
})

// 削除・編集ボタンのクリック処理
// イベント委任でリスト全体を監視する
taskList.addEventListener('click', (e) => {
  const target = e.target as HTMLButtonElement
  const id = target.dataset['id']

  if (target.dataset['testid'] === 'delete-task-button' && id) {
    deleteTask(id)
    renderTasks(searchInput.value)
  }

  if (target.dataset['testid'] === 'edit-task-button' && id) {
    // IDをクエリパラメータで渡して詳細画面へ遷移する
    window.location.href = `./task-detail.html?id=${id}`
  }
})

// 検索入力のリアルタイムフィルタリング
searchInput.addEventListener('input', () => {
  renderTasks(searchInput.value)
})

// ログアウト処理
logoutBtn.addEventListener('click', () => {
  clearAuth()
  window.location.href = './index.html'
})

// 初期描画
renderTasks()
