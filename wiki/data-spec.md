# データ仕様書

## 対象読者

開発者・QAエンジニア

---

## 概要

本アプリケーションはサーバーを持たない。データはすべてブラウザの **localStorage** に保存する。

---

## 1. タスクデータ（Task型）

### 型定義

```typescript
type Task = {
  id: string        // UUID（crypto.randomUUID() で生成）
  title: string     // タイトル（最大50文字）
  memo: string      // メモ（任意、上限なし）
  dueDate: string   // 期限（YYYY-MM-DD形式、任意の場合は空文字）
  completed: boolean // 完了フラグ
  createdAt: string  // 作成日時（ISO 8601形式）
}
```

### フィールド詳細

| フィールド | 型 | 制約 | 初期値 |
|-----------|-----|------|--------|
| `id` | string | UUID形式・一意 | `crypto.randomUUID()` で自動生成 |
| `title` | string | 1〜50文字・必須 | - |
| `memo` | string | 任意・上限なし | `''`（空文字） |
| `dueDate` | string | YYYY-MM-DD形式・任意 | `''`（空文字） |
| `completed` | boolean | - | `false` |
| `createdAt` | string | ISO 8601形式 | `new Date().toISOString()` |

### localStorage スキーマ

| キー | 型 | 内容 |
|-----|----|------|
| `qa_demo_tasks` | JSON文字列 | `Task[]` をシリアライズしたもの |

### 保存例

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "仕様書を書く",
    "memo": "wiki ディレクトリに作成する",
    "dueDate": "2026-05-01",
    "completed": false,
    "createdAt": "2026-04-30T13:00:00.000Z"
  }
]
```

---

## 2. 認証データ

### localStorage スキーマ

| キー | 型 | 内容 |
|-----|----|------|
| `qa_demo_auth` | 文字列 | ログイン済みの場合 `"true"`、それ以外は存在しない |

### 仕様

- ログイン成功時：`localStorage.setItem('qa_demo_auth', 'true')`
- ログアウト時：`localStorage.removeItem('qa_demo_auth')`
- 認証確認：`localStorage.getItem('qa_demo_auth') === 'true'`

### デモアカウント

アカウント情報はサーバーを持たないため、ソースコードにハードコードしている。

| 項目 | 値 |
|------|-----|
| メールアドレス | `demo@example.com` |
| パスワード | `Demo1234` |

---

## 3. CRUD 操作一覧

| 関数 | 引数 | 戻り値 | 処理内容 |
|------|------|--------|---------|
| `getTasks()` | なし | `Task[]` | 全タスクを取得する |
| `addTask(title)` | `title: string` | `Task` | タスクを追加して追加後のTaskを返す |
| `deleteTask(id)` | `id: string` | `void` | 指定IDのタスクを削除する |
| `toggleTask(id)` | `id: string` | `void` | 指定IDの完了状態を反転する |
| `updateTask(id, updates)` | `id: string, updates: Partial<Task>` | `void` | 指定IDのタスクを部分更新する |
| `getTaskById(id)` | `id: string` | `Task \| undefined` | 指定IDのタスクを1件取得する |

---

## 4. データの永続化フロー

```
ブラウザ操作
    │
    ▼
store.ts の CRUD 関数
    │
    ├─ 読み取り時：localStorage.getItem('qa_demo_tasks')
    │              → JSON.parse → Task[]
    │
    └─ 書き込み時：Task[] → JSON.stringify
                   → localStorage.setItem('qa_demo_tasks', ...)
```

---

## 5. データのリセット方法

| 方法 | 手順 |
|------|------|
| ブラウザの開発者ツールから | Application → Storage → Local Storage → 該当キーを削除 |
| テストコードから | `localStorage.clear()` または `localStorage.removeItem(キー名)` |

---

## 6. 注意事項

- localStorage はブラウザのタブ・ウィンドウをまたいで共有される（同一オリジン内）
- シークレットモードを閉じるとデータが消える
- 上限容量はブラウザにより異なるが、一般的に 5MB 程度
