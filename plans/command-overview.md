# backlog-cli コマンド体系 概要

> gh CLI のインターフェースを参考に、Backlog API を操作する CLI ツールのコマンド設計。

---

## コマンドツリー

```
backlog
├── auth                    # 認証管理
│   ├── login
│   ├── logout
│   ├── status
│   ├── token
│   ├── refresh
│   └── switch
│
├── issue                   # 課題管理 ★ 最重要
│   ├── list
│   ├── view
│   ├── create
│   ├── edit
│   ├── close
│   ├── reopen
│   ├── delete              # 未実装
│   ├── comment
│   ├── comments            # 未実装
│   ├── count               # 未実装
│   ├── status
│   ├── attachments         # 未実装
│   └── participants        # 未実装
│
├── pr                      # プルリクエスト管理 ★ 重要
│   ├── list
│   ├── view
│   ├── create
│   ├── edit
│   ├── close
│   ├── merge
│   ├── reopen
│   ├── comment
│   ├── comments
│   ├── count               # 未実装
│   ├── status
│   └── attachments         # 未実装
│
├── project                 # プロジェクト管理
│   ├── list
│   ├── view
│   ├── create
│   ├── edit
│   ├── delete
│   ├── users
│   ├── add-user
│   ├── remove-user
│   └── activities
│
├── repo                    # Git リポジトリ
│   ├── list
│   ├── view
│   └── clone
│
├── wiki                    # Wiki 管理
│   ├── list
│   ├── view
│   ├── create
│   ├── edit
│   ├── delete
│   ├── count
│   ├── tags
│   ├── history
│   └── attachments
│
├── notification            # 通知管理
│   ├── list
│   ├── count
│   ├── read
│   └── read-all
│
├── user                    # ユーザー管理
│   ├── list
│   ├── view
│   ├── me
│   └── activities
│
├── team                    # チーム管理
│   ├── list
│   ├── view
│   ├── create
│   ├── edit
│   └── delete
│
├── space                   # スペース管理
│   ├── info
│   ├── activities
│   ├── disk-usage
│   └── notification
│
├── category                # カテゴリ管理
│   ├── list
│   ├── create
│   ├── edit
│   └── delete
│
├── milestone               # マイルストーン管理
│   ├── list
│   ├── create
│   ├── edit
│   └── delete
│
├── issue-type              # 課題種別管理
│   ├── list
│   ├── create
│   ├── edit
│   └── delete
│
├── status-type             # ステータス管理
│   ├── list
│   ├── create
│   ├── edit
│   └── delete
│
├── webhook                 # Webhook 管理
│   ├── list
│   ├── view
│   ├── create
│   ├── edit
│   └── delete
│
├── star                    # スター
│   ├── add
│   ├── list
│   └── count
│
├── watching                # ウォッチ
│   ├── list
│   ├── add
│   ├── view
│   ├── delete
│   └── read
│
├── api                     # 汎用 API リクエスト
├── browse                  # ブラウザで開く
├── config                  # CLI 設定管理
│   ├── get
│   ├── set
│   └── list
│
├── alias                   # エイリアス
│   ├── set
│   ├── list
│   └── delete
│
├── completion              # シェル補完
└── status                  # 自分に関連する情報の概要表示
```

---

## 実装優先度

### Phase 1: MVP（最小限の動作する CLI）

最も利用頻度が高いコア機能。これだけで日常のバックログ操作が可能になる。

| 優先度 | コマンドグループ | サブコマンド数 | 理由 |
|--------|------------------|----------------|------|
| P0 | `auth` | 4 (login, logout, status, token) | 全機能の前提条件 |
| P0 | `config` | 3 (get, set, list) | スペース設定管理（既に一部実装済み） |
| P0 | `issue` | 8 (list, view, create, edit, close, reopen, comment, status) | Backlog の最重要機能 |
| P0 | `project` | 3 (list, view, activities) | プロジェクト選択が全操作の前提 |
| P0 | `api` | 1 | あらゆる API への低レベルアクセス |

**Phase 1 合計: 19 サブコマンド**

### Phase 2: 開発者向け機能

Git 連携とプルリクエスト管理。開発ワークフローの補完。

| 優先度 | コマンドグループ | サブコマンド数 | 理由 |
|--------|------------------|----------------|------|
| P1 | `pr` | 10 (list, view, create, edit, close, merge, reopen, comment, comments, status) | 開発ワークフローの要 |
| P1 | `repo` | 3 (list, view, clone) | Git リポジトリ操作 |
| P1 | `notification` | 4 (list, count, read, read-all) | 日常のワークフロー |
| P1 | `status` | 1 | ダッシュボード的概要表示 |
| P1 | `browse` | 1 | Web UI への導線 |

**Phase 2 合計: 19 サブコマンド**

### Phase 3: 管理機能

プロジェクト管理者向けの設定・管理コマンド。

| 優先度 | コマンドグループ | サブコマンド数 | 理由 |
|--------|------------------|----------------|------|
| P2 | `wiki` | 9 | ドキュメント管理 |
| P2 | `project` (残り) | 4 (create, edit, delete, users) | プロジェクト管理 |
| P2 | `user` | 4 | ユーザー管理 |
| P2 | `team` | 5 | チーム管理 |
| P2 | `category` | 4 | カテゴリ管理 |
| P2 | `milestone` | 4 | マイルストーン管理 |
| P2 | `issue-type` | 4 | 課題種別管理 |
| P2 | `status-type` | 4 | ステータス管理 |

**Phase 3 合計: 38 サブコマンド**

### Phase 4: 拡張機能

利便性・運用向け機能。

| 優先度 | コマンドグループ | サブコマンド数 | 理由 |
|--------|------------------|----------------|------|
| P3 | `space` | 4 | スペース管理 |
| P3 | `webhook` | 5 | 自動化連携 |
| P3 | `star` | 3 | ソーシャル機能 |
| P3 | `watching` | 5 | ウォッチ管理 |
| P3 | `alias` | 3 | ユーザビリティ |
| P3 | `completion` | 1 | シェル補完 |
| P3 | `auth` (残り) | 2 (refresh, switch) | OAuth 完全対応 |

**Phase 4 合計: 23 サブコマンド**

---

## 総計

| Phase | サブコマンド数 | 累計 |
|-------|----------------|------|
| Phase 1 (MVP) | 19 | 19 |
| Phase 2 (開発者向け) | 19 | 38 |
| Phase 3 (管理機能) | 38 | 76 |
| Phase 4 (拡張機能) | 23 | 99 |

---

## 設計方針

### gh CLI との共通パターン

1. **CRUD サブコマンド名**: `list`, `view`, `create`, `edit`, `delete` で統一
2. **出力フォーマット**: `--json` フラグで JSON 出力、`--jq` でフィルタ
3. **ページネーション**: `--limit` / `--offset` フラグ
4. **プロジェクトコンテキスト**: カレントディレクトリの `.backlog` 設定または `--project` フラグ
5. **インタラクティブモード**: 引数省略時にプロンプトで入力を求める

### Backlog 固有の設計考慮

1. **スペース**: gh CLI の「ホスト」に相当。`{space}.backlog.com` 形式
2. **プロジェクトキー**: gh CLI の `owner/repo` に相当。`PROJECT_KEY` 形式
3. **課題キー**: `PROJECT-123` 形式のキーでアクセス（gh CLI の `#123` に相当）
4. **PR のパス**: `project/repo/pr` の3階層（gh CLI は `owner/repo/pr` の2階層）
5. **認証方式**: API Key（簡易）と OAuth 2.0（推奨）の2系統をサポート
