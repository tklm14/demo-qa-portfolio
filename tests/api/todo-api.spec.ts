// APIテスト
// Playwright の request コンテキストを使って HTTP レベルの品質を検証する
// 対象：JSONPlaceholder（https://jsonplaceholder.typicode.com）
//
// テストピラミッドの考え方：UIテストだけに頼らず、API層でも品質を担保する。
// 不具合発生時に「UIの問題か、APIの問題か」を素早く切り分けられる構成にしている。
import { test, expect } from '@playwright/test'

// テスト対象のベースURL
const BASE_URL = 'https://jsonplaceholder.typicode.com'

test.describe('TODO API テスト', () => {
  // A-01: 正常系 - TODO一覧取得
  test('GET /todos：ステータス200・200件のリストが返る', async ({
    request,
  }) => {
    const res = await request.get(`${BASE_URL}/todos`)

    // ステータスコードの確認
    expect(res.status()).toBe(200)

    const body = await res.json() as unknown[]
    // レスポンスが配列であること
    expect(Array.isArray(body)).toBe(true)
    // JSONPlaceholderのTODOは200件固定
    expect(body).toHaveLength(200)
  })

  // A-02: 正常系 - TODO単件取得
  test('GET /todos/1：ステータス200・id=1のデータが返る', async ({
    request,
  }) => {
    const res = await request.get(`${BASE_URL}/todos/1`)
    expect(res.status()).toBe(200)

    const body = await res.json() as { id: number }
    expect(body.id).toBe(1)
  })

  // A-03: 異常系 - 存在しないIDへのアクセス
  test('GET /todos/999999：ステータス404が返る', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/todos/999999`)
    expect(res.status()).toBe(404)
  })

  // A-04: 正常系 - TODO作成
  test('POST /todos：ステータス201・送信したtitleが返る', async ({
    request,
  }) => {
    const newTodo = { title: 'テストタスク', completed: false, userId: 1 }
    const res = await request.post(`${BASE_URL}/todos`, { data: newTodo })

    expect(res.status()).toBe(201)

    const body = await res.json() as { title: string; id: number }
    // 送信したタイトルがレスポンスに含まれること
    expect(body.title).toBe(newTodo.title)
    // 新規作成なのでIDが付与されていること
    expect(body.id).toBeTruthy()
  })

  // A-05: 正常系 - TODO更新
  test('PUT /todos/1：ステータス200・変更後のtitleが返る', async ({
    request,
  }) => {
    const updated = {
      id: 1,
      title: '更新されたタイトル',
      completed: true,
      userId: 1,
    }
    const res = await request.put(`${BASE_URL}/todos/1`, { data: updated })

    expect(res.status()).toBe(200)

    const body = await res.json() as { title: string }
    expect(body.title).toBe(updated.title)
  })

  // A-06: 正常系 - TODO削除
  test('DELETE /todos/1：ステータス200・空オブジェクトが返る', async ({
    request,
  }) => {
    const res = await request.delete(`${BASE_URL}/todos/1`)
    expect(res.status()).toBe(200)

    const body = await res.json() as Record<string, unknown>
    // 削除成功時は空オブジェクトが返る
    expect(Object.keys(body)).toHaveLength(0)
  })

  // A-07: スキーマ検証 - レスポンスの型が仕様通りであることを確認する
  test('GET /todos/1：レスポンスのスキーマが正しい（型チェック）', async ({
    request,
  }) => {
    const res = await request.get(`${BASE_URL}/todos/1`)
    const body = await res.json() as {
      id: unknown
      userId: unknown
      title: unknown
      completed: unknown
    }

    // 各フィールドの型を検証する（スキーマ崩れを検出する）
    expect(typeof body.id).toBe('number')
    expect(typeof body.userId).toBe('number')
    expect(typeof body.title).toBe('string')
    expect(typeof body.completed).toBe('boolean')
  })
})
