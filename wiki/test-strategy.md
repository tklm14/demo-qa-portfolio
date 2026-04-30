# テスト戦略書

## 対象読者

QAエンジニア・開発者・ステークホルダー

---

## 1. テスト方針

### 基本方針

- 「どこが壊れたか」を素早く特定できる **3層のテスト構造** を採用する
- 各層が補完し合い、テスト漏れと実行コストのバランスを最適化する
- 新機能追加・バグ修正時はテストを同時にコミットする

### テストピラミッド

```
         ┌─────────────────┐
         │   E2E テスト     │  ← ユーザーシナリオ検証（遅い・少ない）
         │   21 件          │
         ├─────────────────┤
         │   API テスト     │  ← HTTP レベルの検証（中速・中規模）
         │    7 件          │
         ├─────────────────┤
         │ ユニットテスト   │  ← 関数単位の検証（速い・多い）
         │   33 件          │
         └─────────────────┘
```

---

## 2. 各テスト層の役割

| テスト層 | フレームワーク | 対象 | 目的 |
|---------|--------------|------|------|
| ユニットテスト | Vitest + jsdom | `auth.ts` / `store.ts` | ロジック・境界値の網羅的な検証 |
| E2Eテスト | Playwright | 全画面のユーザー操作 | ユーザー視点での動作確認 |
| APIテスト | Playwright | JSONPlaceholder API | HTTP レスポンス・スキーマの検証 |

### 失敗時の切り分け

```
ユニットテスト失敗 → auth.ts / store.ts のロジックバグ
E2Eテスト失敗（ユニットは通過）→ 画面制御・DOM操作のバグ
APIテスト失敗 → 外部APIのスキーマ変更・ネットワーク問題
```

---

## 3. ユニットテスト詳細（Vitest）

### 実行コマンド

```bash
npm run test:unit           # 全件実行
npm run test:unit:watch     # watch モード（開発中に使用）
npm run test:unit:coverage  # カバレッジ付き実行
```

### カバレッジ目標

| 指標 | 目標 | 現状 |
|------|------|------|
| Statements | 80% 以上 | 100% |
| Branches | 80% 以上 | 93.75% |
| Functions | 80% 以上 | 100% |
| Lines | 80% 以上 | 100% |

### テスト環境

- **実行環境**：jsdom（Node.js 上でブラウザ API をシミュレート）
- **テスト間の分離**：各テスト前に `localStorage.clear()` を実行

### テストケース一覧

#### auth.ts（17件）

| グループ | テスト名 | 検証内容 |
|---------|---------|---------|
| validateEmail | 空文字のとき未入力エラーを返す | 空文字 → エラーA |
| validateEmail | @がない場合は形式エラーを返す | 形式不正 → エラーB |
| validateEmail | ドメインがない場合は形式エラーを返す | 形式不正 → エラーB |
| validateEmail | スペースを含む場合は形式エラーを返す | 形式不正 → エラーB |
| validateEmail | 正しい形式のとき null を返す | 正常値 → null |
| validatePassword | 空文字のとき未入力エラーを返す | 空文字 → エラー |
| validatePassword | 値があるとき null を返す | 正常値 → null |
| authenticate | 正しい認証情報のとき true を返す | 正常認証 |
| authenticate | メールアドレスが違うとき false を返す | 認証失敗 |
| authenticate | パスワードが違うとき false を返す | 認証失敗 |
| authenticate | 両方違うとき false を返す | 認証失敗 |
| setAuth / clearAuth / isAuthenticated | setAuth 後は isAuthenticated が true を返す | localStorage 書き込み |
| setAuth / clearAuth / isAuthenticated | clearAuth 後は isAuthenticated が false を返す | localStorage 削除 |
| setAuth / clearAuth / isAuthenticated | 何もセットしていないとき isAuthenticated は false を返す | 初期状態 |
| requireAuth | 未ログイン状態のとき index.html にリダイレクトする | リダイレクト発生 |
| requireAuth | ログイン済みのときリダイレクトしない | リダイレクト非発生 |

#### store.ts（16件）

| グループ | テスト名 | 検証内容 |
|---------|---------|---------|
| getTasks | localStorage が空のとき空配列を返す | 初期状態 |
| getTasks | 保存されたタスクを配列で返す | データ取得 |
| addTask | タスクが追加される | 件数増加 |
| addTask | 追加したタスクが正しいフィールドを持つ | フィールド検証 |
| addTask | 複数追加すると件数が増える | 累積 |
| deleteTask | 指定したIDのタスクが削除される | 削除 |
| deleteTask | 削除後に他のタスクは残る | 非対象は保持 |
| deleteTask | 存在しないIDを指定しても他のタスクに影響しない | 副作用なし |
| toggleTask | 未完了タスクを完了状態に切り替える | false → true |
| toggleTask | 完了タスクを未完了状態に切り替える | true → false |
| toggleTask | 他のタスクの completed は変わらない | 非対象は保持 |
| updateTask | 指定したフィールドだけ更新される | 部分更新 |
| updateTask | 更新しなかったフィールドは保持される | 非対象は保持 |
| updateTask | 複数フィールドを同時に更新できる | 複数更新 |
| getTaskById | 存在するIDのタスクを返す | ID検索 |
| getTaskById | 存在しないIDのとき undefined を返す | 不存在 |
| getTaskById | タスクが複数あっても正しいものを返す | 複数件から検索 |

---

## 4. E2Eテスト詳細（Playwright）

### 実行コマンド

```bash
npm run test:e2e     # E2Eテスト（21件）
npm run test:report  # HTML レポートを表示
```

### 設定

- **ブラウザ**：Chromium（Desktop Chrome プロファイル）
- **ベース URL**：`http://localhost:4173`（`vite preview` で起動）
- **並列実行**：デフォルト有効（デバッグ時は `--workers=1` で無効化）
- **Page Object Model**：画面ごとにクラスを分離（`tests/e2e/pages/`）

### テストケース一覧

#### ログイン機能（7件）

| テストID | テスト名 | 種別 |
|---------|---------|------|
| L-01 | 正しい認証情報でタスク一覧へ遷移する | 正常系 |
| L-02 | メール未入力のエラーメッセージ表示 | 異常系 |
| L-03 | メール形式不正のエラーメッセージ表示 | 異常系 |
| L-04 | パスワード未入力のエラーメッセージ表示 | 異常系 |
| L-05 | 誤ったパスワードで認証失敗メッセージ表示 | 異常系 |
| L-06 | ログアウト後にログイン画面へ戻る | 正常系 |
| L-07 | ログアウト後のブラウザバックでログイン画面のまま | セキュリティ |

#### タスクCRUD（8件）

| テストID | テスト名 | 種別 |
|---------|---------|------|
| T-01 | タスク追加で一覧に表示される | 正常系 |
| T-02 | 空タイトルでバリデーションエラー | 異常系 |
| T-03 | 50文字（上限）で正常追加 | 境界値 |
| T-04 | 51文字（上限超過）でバリデーションエラー | 境界値 |
| T-05 | タスク削除後に件数が減る | 正常系 |
| T-06 | チェックボックスONで完了状態になる | 正常系 |
| T-07 | チェックボックスOFFで未完了に戻る | 正常系 |
| T-08 | 編集画面で変更した内容が一覧に反映される | 正常系 |

#### 検索・絞り込み（4件）

| テストID | テスト名 | 種別 |
|---------|---------|------|
| S-01 | キーワードに一致するタスクのみ表示 | 正常系 |
| S-02 | ヒットなし時に「該当なし」メッセージ表示 | 正常系 |
| S-03 | キーワードクリアで全件表示に戻る | 正常系 |
| S-04 | 大文字小文字を区別せずに検索できる | 仕様確認 |

#### シナリオ（2件）

| テストID | テスト名 | 内容 |
|---------|---------|------|
| E-01 | 基本業務フロー | ログイン→追加（3件）→完了→検索→ログアウト |
| E-02 | 編集フロー | ログイン→追加→編集・保存→一覧で変更確認 |

---

## 5. APIテスト詳細（Playwright）

### 対象API

JSONPlaceholder（`https://jsonplaceholder.typicode.com`）を対象に REST API の基本的な検証を実施する。

### 実行コマンド

```bash
npm run test:api   # APIテスト（7件）
```

### テストケース一覧

| テストID | エンドポイント | テスト名 | 種別 |
|---------|-------------|---------|------|
| A-01 | GET /todos | 200件のリストが返る | 正常系 |
| A-02 | GET /todos/1 | 単件データが返る | 正常系 |
| A-03 | GET /todos/999999 | 404が返る | 異常系 |
| A-04 | POST /todos | 201で作成データが返る | 正常系 |
| A-05 | PUT /todos/1 | 200で更新データが返る | 正常系 |
| A-06 | DELETE /todos/1 | 200で空オブジェクトが返る | 正常系 |
| A-07 | GET /todos/1 | レスポンスの型がすべて正しい | スキーマ検証 |

---

## 6. CI/CD パイプライン

### テスト自動実行（playwright.yml）

`main` ブランチへの push / pull request をトリガーに GitHub Actions で自動実行する。

```
push / PR
    │
    ▼
ubuntu-latest
    │
    ├─ npm ci
    ├─ npx playwright install --with-deps chromium
    ├─ npm run build（Vite ビルド）
    ├─ npm run test:e2e（21件）
    └─ npm run test:api（7件）
    │
    ▼
テストレポートをアーティファクトに保存（30日間）
```

### ローカルでのデバッグ

| 目的 | 方法 |
|------|------|
| ブレイクポイントで止める | VS Code F5 → 「Playwright: E2Eテストをデバッグ」 |
| テストを遅くして目視確認 | `launchOptions: { slowMo: 500 }` |
| Playwright Inspector を起動 | `await page.pause()` をテストコードに追加 |

---

## 7. テスト実装の規約

### セレクター

| 優先度 | 方法 | 理由 |
|--------|------|------|
| ✅ 推奨 | `page.getByTestId('xxx')` | デザイン変更の影響を受けない |
| ❌ 非推奨 | `page.locator('.class-name')` | CSS変更で壊れやすい |
| ❌ 非推奨 | `page.locator('#id')` | HTML変更で壊れやすい |

### localStorage の操作（E2Eテスト）

テスト前の localStorage セットアップは `page.evaluate` を使う。`context.addInitScript` は全ナビゲーションで再実行されるため使用しない。

```typescript
// ✅ 正しい
await page.goto('/index.html')
await page.evaluate(() => {
  localStorage.setItem('qa_demo_auth', 'true')
})

// ❌ 使用しない（遷移のたびにリセットされてしまう）
await context.addInitScript(() => {
  localStorage.setItem('qa_demo_auth', 'true')
})
```

### テストの独立性

- 各テストは他のテストに依存しない
- ユニットテスト：`beforeEach` で `localStorage.clear()`
- E2Eテスト：`beforeEach` で localStorage を初期化してからページ遷移
