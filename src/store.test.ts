import { describe, it, expect, beforeEach } from 'vitest'
import { getTasks, addTask, deleteTask, toggleTask, updateTask, getTaskById } from './store'

beforeEach(() => {
  localStorage.clear()
})

describe('getTasks', () => {
  it('localStorage が空のとき空配列を返す', () => {
    expect(getTasks()).toEqual([])
  })

  it('保存されたタスクを配列で返す', () => {
    addTask('テストタスク')
    const tasks = getTasks()
    expect(tasks).toHaveLength(1)
    expect(tasks[0].title).toBe('テストタスク')
  })
})

describe('addTask', () => {
  it('タスクが追加される', () => {
    addTask('新しいタスク')
    expect(getTasks()).toHaveLength(1)
  })

  it('追加したタスクが正しいフィールドを持つ', () => {
    const task = addTask('新しいタスク')
    expect(task.title).toBe('新しいタスク')
    expect(task.memo).toBe('')
    expect(task.dueDate).toBe('')
    expect(task.completed).toBe(false)
    expect(task.id).toBeTruthy()
    expect(task.createdAt).toBeTruthy()
  })

  it('複数追加すると件数が増える', () => {
    addTask('タスクA')
    addTask('タスクB')
    expect(getTasks()).toHaveLength(2)
  })
})

describe('deleteTask', () => {
  it('指定したIDのタスクが削除される', () => {
    const task = addTask('削除対象')
    deleteTask(task.id)
    expect(getTasks()).toHaveLength(0)
  })

  it('削除後に他のタスクは残る', () => {
    const taskA = addTask('タスクA')
    addTask('タスクB')
    deleteTask(taskA.id)
    const remaining = getTasks()
    expect(remaining).toHaveLength(1)
    expect(remaining[0].title).toBe('タスクB')
  })

  it('存在しないIDを指定しても他のタスクに影響しない', () => {
    addTask('タスクA')
    deleteTask('non-existent-id')
    expect(getTasks()).toHaveLength(1)
  })
})

describe('toggleTask', () => {
  it('未完了タスクを完了状態に切り替える', () => {
    const task = addTask('タスク')
    expect(task.completed).toBe(false)
    toggleTask(task.id)
    expect(getTasks()[0].completed).toBe(true)
  })

  it('完了タスクを未完了状態に切り替える', () => {
    const task = addTask('タスク')
    toggleTask(task.id)
    toggleTask(task.id)
    expect(getTasks()[0].completed).toBe(false)
  })

  it('他のタスクの completed は変わらない', () => {
    const taskA = addTask('タスクA')
    addTask('タスクB')
    toggleTask(taskA.id)
    const tasks = getTasks()
    expect(tasks.find((t) => t.title === 'タスクB')?.completed).toBe(false)
  })
})

describe('updateTask', () => {
  it('指定したフィールドだけ更新される', () => {
    const task = addTask('元のタイトル')
    updateTask(task.id, { title: '新しいタイトル' })
    expect(getTasks()[0].title).toBe('新しいタイトル')
  })

  it('更新しなかったフィールドは保持される', () => {
    const task = addTask('タスク')
    updateTask(task.id, { memo: 'メモ追加' })
    const updated = getTasks()[0]
    expect(updated.title).toBe('タスク')
    expect(updated.memo).toBe('メモ追加')
    expect(updated.completed).toBe(false)
  })

  it('複数フィールドを同時に更新できる', () => {
    const task = addTask('タスク')
    updateTask(task.id, { title: '変更後', dueDate: '2026-12-31' })
    const updated = getTasks()[0]
    expect(updated.title).toBe('変更後')
    expect(updated.dueDate).toBe('2026-12-31')
  })
})

describe('getTaskById', () => {
  it('存在するIDのタスクを返す', () => {
    const task = addTask('タスク')
    expect(getTaskById(task.id)?.title).toBe('タスク')
  })

  it('存在しないIDのとき undefined を返す', () => {
    expect(getTaskById('non-existent-id')).toBeUndefined()
  })

  it('タスクが複数あっても正しいものを返す', () => {
    addTask('タスクA')
    const taskB = addTask('タスクB')
    expect(getTaskById(taskB.id)?.title).toBe('タスクB')
  })
})
