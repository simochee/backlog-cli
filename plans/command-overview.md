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
│   ├── delete
│   ├── comment
│   ├── status
│   │
│   └── (実装スコープ外)
│       ├── comments
│       ├── count
│       ├── attachments
│       └── participants
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
│   ├── status
│   │
│   └── (実装スコープ外)
│       ├── count
│       └── attachments
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
├── completion              # シェル補完
└── status                  # 自分に関連する情報の概要表示
```

---

## 設計方針

### gh CLI との共通パターン

1. **CRUD サブコマンド名**: `list`, `view`, `create`, `edit`, `delete` で統一
2. **出力フォーマット**: `--json` フラグで JSON 出力（フィールド指定可）
3. **ページネーション**: `--limit` / `--offset` フラグ
4. **プロジェクトコンテキスト**: カレントディレクトリの `.backlog` 設定または `--project` フラグ
5. **インタラクティブモード**: 引数省略時にプロンプトで入力を求める

### Backlog 固有の設計考慮

1. **スペース**: gh CLI の「ホスト」に相当。`{space}.backlog.com` 形式
2. **プロジェクトキー**: gh CLI の `owner/repo` に相当。`PROJECT_KEY` 形式
3. **課題キー**: `PROJECT-123` 形式のキーでアクセス（gh CLI の `#123` に相当）
4. **PR のパス**: `project/repo/pr` の3階層（gh CLI は `owner/repo/pr` の2階層）
5. **認証方式**: API Key（簡易）と OAuth 2.0（推奨）の2系統をサポート
