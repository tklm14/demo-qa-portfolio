# プロジェクト概要

## アプリケーション名

**TaskBoard**

---

## 目的

QAエンジニアのポートフォリオ用デモプロジェクト。  
タスク管理アプリを題材に、ユニットテスト・E2Eテスト・APIテストの3層構造と CI/CD パイプラインの実装を示すことを目的とする。

---

## 対象ユーザー

デモ利用者（採用担当・技術評価者）が実際に操作できる形で公開している。

| アカウント | メールアドレス | パスワード |
|-----------|--------------|-----------|
| デモアカウント | demo@example.com | Demo1234 |

---

## 技術スタック

| 分類 | 技術 | バージョン |
|------|------|----------|
| アプリケーション | HTML + TypeScript | TypeScript 5.4 |
| ビルドツール | Vite | 5.x |
| データ保存 | localStorage | ブラウザ標準API |
| E2E・APIテスト | Playwright | 1.44 以上 |
| ユニットテスト | Vitest + jsdom | 4.x |
| CI/CD | GitHub Actions | - |
| 公開 | GitHub Pages | - |

---

## 公開 URL

- **デモサイト**：https://tklm14.github.io/demo-qa-portfolio/
- **リポジトリ**：https://github.com/tklm14/demo-qa-portfolio

---

## ディレクトリ構成

```
demo-qa-portfolio/
├── src/                      ← アプリケーション本体
│   ├── index.html            ← ログイン画面
│   ├── tasks.html            ← タスク一覧画面
│   ├── task-detail.html      ← タスク編集画面
│   ├── auth.ts               ← 認証ロジック
│   ├── auth.test.ts          ← 認証ユニットテスト
│   ├── store.ts              ← タスクCRUDロジック
│   ├── store.test.ts         ← タスクCRUDユニットテスト
│   ├── login.ts              ← ログイン画面制御
│   ├── taskList.ts           ← タスク一覧画面制御
│   ├── taskDetail.ts         ← タスク詳細画面制御
│   └── style.css             ← スタイル
├── tests/
│   ├── e2e/
│   │   ├── pages/            ← Page Object Model
│   │   └── specs/            ← E2Eテストケース
│   └── api/
│       └── todo-api.spec.ts  ← APIテスト
├── wiki/                     ← 仕様書（このディレクトリ）
├── .github/workflows/
│   ├── playwright.yml        ← CI：テスト自動実行
│   └── deploy.yml            ← CD：GitHub Pages デプロイ
├── playwright.config.ts
└── vite.config.ts
```

---

## 画面遷移図

```
[ログイン画面]
  index.html
      │
      │ 認証成功
      ▼
[タスク一覧画面] ◄──────────────────┐
  tasks.html                        │
      │                             │
      │ 編集ボタンクリック           │ 保存 / 戻る
      ▼                             │
[タスク編集画面] ────────────────────┘
  task-detail.html
```

---

## コマンド一覧

| コマンド | 内容 |
|---------|------|
| `npm run dev` | 開発サーバー起動（http://localhost:5173） |
| `npm run build` | プロダクションビルド（dist/ に出力） |
| `npm run preview` | ビルド結果プレビュー（http://localhost:4173） |
| `npm run test:unit` | ユニットテスト実行（33件） |
| `npm run test:unit:watch` | ユニットテスト watch モード |
| `npm run test:unit:coverage` | ユニットテスト＋カバレッジ計測 |
| `npm run test:e2e` | E2Eテスト実行（21件） |
| `npm run test:api` | APIテスト実行（7件） |
| `npm run test` | 全E2E+APIテスト実行（28件） |
| `npm run test:report` | HTMLレポートを表示 |
