# backlog-cli 実装計画

> gh CLI のインターフェースを基準に、Backlog API を操作する CLI ツールの全コマンド・引数・オプション定義と、対応する Backlog API エンドポイントのマッピング。
>
> **このドキュメントは実装の進捗に合わせて随時更新すること。**

---

## 進捗サマリー

| Phase | 対象 | サブコマンド数 | 状態 |
|-------|------|----------------|------|
| Phase 1 | MVP（auth, config, issue, project, api） | 19 | 未着手 |
| Phase 2 | 開発者向け（pr, repo, notification, status, browse） | 19 | 未着手 |
| Phase 3 | 管理機能（wiki, user, team, category, milestone 等） | 38 | 未着手 |
| Phase 4 | 拡張機能（space, webhook, star, watching, alias 等） | 23 | 未着手 |

---

## 共通オプション（グローバルフラグ）

すべてのコマンドで使用可能な共通フラグ。

| フラグ | 短縮 | 型 | デフォルト | 説明 |
|--------|------|------|------------|------|
| `--space` | `-s` | string | 設定ファイルのデフォルト | 対象のBacklogスペース（`xxx.backlog.com`） |
| `--project` | `-p` | string | カレントディレクトリの `.backlog` 設定 | プロジェクトキー（例: `PROJECT_KEY`） |
| `--json` | | string[] | — | JSON出力。フィールド名を指定可 |
| `--jq` | `-q` | string | — | jq式でJSON出力をフィルタ |
| `--template` | `-t` | string | — | Go template形式の出力フォーマット |
| `--no-pager` | | boolean | false | ページャーを無効化 |
| `--help` | `-h` | boolean | — | ヘルプ表示 |
| `--version` | `-V` | boolean | — | バージョン表示 |

---

## Phase 1: MVP

### 1.1 `backlog auth` — 認証管理

認証は全機能の前提条件。API Key と OAuth 2.0 の2方式をサポート。

#### `backlog auth login`

スペースへの認証を設定する。

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 |
|------------------|------|------|------|------------|------|
| `--hostname` | `-h` | string | No | — | スペースホスト名（例: `xxx.backlog.com`） |
| `--method` | `-m` | string | No | `api-key` | 認証方式（`api-key` / `oauth`） |
| `--with-token` | | boolean | No | false | 標準入力からトークンを読み込む |

- **対応 API**: OAuth 2.0 フロー / ローカル設定への書き込み
- **状態**: 未着手

#### `backlog auth logout`

スペースの認証情報を削除する。

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 |
|------------------|------|------|------|------------|------|
| `--hostname` | `-h` | string | No | アクティブスペース | 対象スペースホスト名 |

- **対応 API**: ローカル設定の削除
- **状態**: 未着手

#### `backlog auth status`

認証状態を表示する。

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 |
|------------------|------|------|------|------------|------|
| `--hostname` | `-h` | string | No | 全スペース | 対象スペースホスト名 |
| `--show-token` | | boolean | No | false | トークンを表示する |

- **対応 API**: `GET /api/v2/users/myself`
- **状態**: 未着手

#### `backlog auth token`

認証トークンを標準出力に表示する。スクリプト連携用。

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 |
|------------------|------|------|------|------------|------|
| `--hostname` | `-h` | string | No | アクティブスペース | 対象スペースホスト名 |

- **対応 API**: ローカル設定の読み取り
- **状態**: 未着手

---

### 1.2 `backlog config` — CLI 設定管理

CLI 自体の動作設定を管理する。

#### `backlog config get <key>`

設定値を取得する。

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<key>` | string | Yes | 設定キー（例: `default_space`, `pager`） |
| `--hostname` | string | No | スペース単位の設定を取得 |

- **対応 API**: ローカル設定ファイル読み取り
- **状態**: 未着手

#### `backlog config set <key> <value>`

設定値を書き込む。

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<key>` | string | Yes | 設定キー |
| `<value>` | string | Yes | 設定値 |
| `--hostname` | string | No | スペース単位で設定 |

- **対応 API**: ローカル設定ファイル書き込み
- **状態**: 未着手

#### `backlog config list`

全設定値を一覧表示する。

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `--hostname` | string | No | スペース単位でフィルタ |

- **対応 API**: ローカル設定ファイル読み取り
- **状態**: 未着手

---

### 1.3 `backlog issue` — 課題管理

Backlog の最重要機能。課題の CRUD とコメント操作を提供する。

#### `backlog issue list`

課題一覧を取得する。

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `--assignee` | `-a` | string | No | — | 担当者（ユーザー名 or `@me`） | `assigneeId[]` |
| `--status` | `-S` | string[] | No | — | ステータス名（複数可） | `statusId[]` |
| `--type` | `-T` | string[] | No | — | 課題種別名（複数可） | `issueTypeId[]` |
| `--category` | `-C` | string[] | No | — | カテゴリ名（複数可） | `categoryId[]` |
| `--milestone` | `-M` | string[] | No | — | マイルストーン名（複数可） | `milestoneId[]` |
| `--priority` | `-P` | string | No | — | 優先度名 | `priorityId[]` |
| `--keyword` | `-k` | string | No | — | キーワード検索 | `keyword` |
| `--created-by` | | string | No | — | 作成者 | `createdUserId[]` |
| `--parent-child` | | number | No | — | 親子フィルタ（0-4） | `parentChild` |
| `--has-attachment` | | boolean | No | — | 添付ファイルあり | `attachment` |
| `--has-due-date` | | boolean | No | — | 期限日あり | `hasDueDate` |
| `--created-since` | | string | No | — | 作成日 FROM（yyyy-MM-dd） | `createdSince` |
| `--created-until` | | string | No | — | 作成日 TO（yyyy-MM-dd） | `createdUntil` |
| `--updated-since` | | string | No | — | 更新日 FROM（yyyy-MM-dd） | `updatedSince` |
| `--updated-until` | | string | No | — | 更新日 TO（yyyy-MM-dd） | `updatedUntil` |
| `--due-since` | | string | No | — | 期限日 FROM（yyyy-MM-dd） | `dueDateSince` |
| `--due-until` | | string | No | — | 期限日 TO（yyyy-MM-dd） | `dueDateUntil` |
| `--sort` | | string | No | `updated` | ソートキー | `sort` |
| `--order` | | string | No | `desc` | 並び順（`asc`/`desc`） | `order` |
| `--limit` | `-L` | number | No | 20 | 取得件数（1-100） | `count` |
| `--offset` | | number | No | 0 | オフセット | `offset` |

- **対応 API**: `GET /api/v2/issues`
- **状態**: 未着手

#### `backlog issue view <issue-key>`

課題の詳細を表示する。

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<issue-key>` | string | Yes | 課題キー（例: `PROJECT-123`） |
| `--comments` | boolean | No | コメントも表示する |
| `--web` | boolean | No | ブラウザで開く |

- **対応 API**: `GET /api/v2/issues/:issueIdOrKey`
- **補助 API**: `GET /api/v2/issues/:key/comments`（`--comments` 使用時）
- **状態**: 未着手

#### `backlog issue create`

新しい課題を作成する。

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `--title` | `-t` | string | Yes* | — | 課題の件名 | `summary` |
| `--description` | `-d` | string | No | — | 課題の詳細（`-` で stdin） | `description` |
| `--type` | `-T` | string | Yes* | — | 課題種別名 | `issueTypeId` |
| `--priority` | `-P` | string | Yes* | — | 優先度名 | `priorityId` |
| `--assignee` | `-a` | string | No | — | 担当者 | `assigneeId` |
| `--category` | `-C` | string[] | No | — | カテゴリ（複数可） | `categoryId[]` |
| `--milestone` | `-M` | string[] | No | — | マイルストーン（複数可） | `milestoneId[]` |
| `--version` | `-v` | string[] | No | — | 発生バージョン（複数可） | `versionId[]` |
| `--start-date` | | string | No | — | 開始日（yyyy-MM-dd） | `startDate` |
| `--due-date` | | string | No | — | 期限日（yyyy-MM-dd） | `dueDate` |
| `--estimated-hours` | | number | No | — | 予定時間 | `estimatedHours` |
| `--actual-hours` | | number | No | — | 実績時間 | `actualHours` |
| `--parent` | | string | No | — | 親課題キー | `parentIssueId` |
| `--notify` | `-n` | string[] | No | — | 通知先ユーザー（複数可） | `notifiedUserId[]` |
| `--web` | | boolean | No | false | 作成後ブラウザで開く | — |

> *: インタラクティブモードでは省略可能（プロンプトで入力を求める）

- **対応 API**: `POST /api/v2/issues`
- **補助 API**: プロジェクト種別・優先度の名前→ID 変換用
  - `GET /api/v2/projects/:key/issueTypes`
  - `GET /api/v2/priorities`
  - `GET /api/v2/projects/:key/users`
  - `GET /api/v2/projects/:key/categories`
  - `GET /api/v2/projects/:key/versions`
- **状態**: 未着手

#### `backlog issue edit <issue-key>`

既存の課題を更新する。

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `<issue-key>` | | string | Yes | — | 課題キー | `issueIdOrKey` (URL) |
| `--title` | `-t` | string | No | — | 件名 | `summary` |
| `--description` | `-d` | string | No | — | 詳細 | `description` |
| `--status` | `-S` | string | No | — | ステータス名 | `statusId` |
| `--type` | `-T` | string | No | — | 課題種別名 | `issueTypeId` |
| `--priority` | `-P` | string | No | — | 優先度名 | `priorityId` |
| `--assignee` | `-a` | string | No | — | 担当者 | `assigneeId` |
| `--category` | `-C` | string[] | No | — | カテゴリ（複数可） | `categoryId[]` |
| `--milestone` | `-M` | string[] | No | — | マイルストーン（複数可） | `milestoneId[]` |
| `--version` | `-v` | string[] | No | — | 発生バージョン（複数可） | `versionId[]` |
| `--start-date` | | string | No | — | 開始日 | `startDate` |
| `--due-date` | | string | No | — | 期限日 | `dueDate` |
| `--estimated-hours` | | number | No | — | 予定時間 | `estimatedHours` |
| `--actual-hours` | | number | No | — | 実績時間 | `actualHours` |
| `--resolution` | | string | No | — | 完了理由名 | `resolutionId` |
| `--comment` | `-c` | string | No | — | 更新コメント | `comment` |
| `--notify` | `-n` | string[] | No | — | 通知先ユーザー | `notifiedUserId[]` |

- **対応 API**: `PATCH /api/v2/issues/:issueIdOrKey`
- **状態**: 未着手

#### `backlog issue close <issue-key>`

課題を完了にする（ステータスを「完了」に変更）。

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `<issue-key>` | | string | Yes | — | 課題キー | `issueIdOrKey` (URL) |
| `--comment` | `-c` | string | No | — | 完了コメント | `comment` |
| `--resolution` | `-r` | string | No | `完了` | 完了理由名 | `resolutionId` |

- **対応 API**: `PATCH /api/v2/issues/:issueIdOrKey` (statusId を「完了」に設定)
- **補助 API**:
  - `GET /api/v2/projects/:key/statuses` — 「完了」ステータスのID取得
  - `GET /api/v2/resolutions` — 完了理由のID取得
- **状態**: 未着手

#### `backlog issue reopen <issue-key>`

完了した課題を再オープンする。

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `<issue-key>` | | string | Yes | — | 課題キー | `issueIdOrKey` (URL) |
| `--comment` | `-c` | string | No | — | 再オープンコメント | `comment` |

- **対応 API**: `PATCH /api/v2/issues/:issueIdOrKey` (statusId を「未対応」に設定)
- **補助 API**: `GET /api/v2/projects/:key/statuses`
- **状態**: 未着手

#### `backlog issue comment <issue-key>`

課題にコメントを追加する。

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `<issue-key>` | | string | Yes | — | 課題キー | `issueIdOrKey` (URL) |
| `--body` | `-b` | string | Yes* | — | コメント本文（`-` で stdin） | `content` |
| `--notify` | `-n` | string[] | No | — | 通知先ユーザー | `notifiedUserId[]` |

> *: 省略時はエディタが起動する

- **対応 API**: `POST /api/v2/issues/:issueIdOrKey/comments`
- **状態**: 未着手

#### `backlog issue status`

自分に関連する課題の状態サマリーを表示する。

| 引数/オプション | 型 | 必須 | デフォルト | 説明 |
|------------------|------|------|------------|------|
| （なし） | | | | 自分が担当する課題をステータス別に表示 |

- **対応 API**: `GET /api/v2/issues` (assigneeId=自分, ステータス別に集計)
- **補助 API**: `GET /api/v2/users/myself`
- **状態**: 未着手

---

### 1.4 `backlog project` — プロジェクト管理

Backlog のプロジェクト操作。gh CLI の `repo` に相当。

#### `backlog project list`

参加中のプロジェクト一覧を取得する。

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `--archived` | | boolean | No | — | アーカイブ済みを含める | `archived` |
| `--all` | | boolean | No | false | 全プロジェクト（管理者のみ） | `all` |
| `--limit` | `-L` | number | No | 20 | 表示件数 | — (クライアントフィルタ) |

- **対応 API**: `GET /api/v2/projects`
- **状態**: 未着手

#### `backlog project view [project-key]`

プロジェクトの詳細を表示する。

| 引数/オプション | 型 | 必須 | デフォルト | 説明 |
|------------------|------|------|------------|------|
| `[project-key]` | string | No | カレントプロジェクト | プロジェクトキー |
| `--web` | boolean | No | false | ブラウザで開く |

- **対応 API**: `GET /api/v2/projects/:projectIdOrKey`
- **状態**: 未着手

#### `backlog project activities [project-key]`

プロジェクトの最近の更新を表示する。

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `[project-key]` | | string | No | カレントプロジェクト | プロジェクトキー | `:key` (URL) |
| `--limit` | `-L` | number | No | 20 | 取得件数 | `count` |
| `--activity-type` | | number[] | No | — | アクティビティタイプID | `activityTypeId[]` |

- **対応 API**: `GET /api/v2/projects/:key/activities`
- **状態**: 未着手

---

### 1.5 `backlog api` — 汎用 API リクエスト

任意の Backlog API を直接呼び出す。

#### `backlog api <endpoint>`

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 |
|------------------|------|------|------|------------|------|
| `<endpoint>` | | string | Yes | — | API パス（例: `/api/v2/users/myself`） |
| `--method` | `-X` | string | No | `GET` | HTTP メソッド |
| `--field` | `-f` | string[] | No | — | リクエストフィールド（`key=value`） |
| `--raw-field` | `-F` | string[] | No | — | 型変換なしのフィールド |
| `--input` | | string | No | — | リクエストボディのファイルパス |
| `--header` | `-H` | string[] | No | — | 追加ヘッダー |
| `--include` | `-i` | boolean | No | false | レスポンスヘッダーを含める |
| `--paginate` | | boolean | No | false | ページネーションで全件取得 |
| `--silent` | | boolean | No | false | 出力を抑制 |

- **対応 API**: 任意のエンドポイント
- **状態**: 未着手

---

## Phase 2: 開発者向け機能

### 2.1 `backlog pr` — プルリクエスト管理

#### `backlog pr list`

PR 一覧を取得する。

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `--repo` | `-R` | string | No | カレントリポジトリ | リポジトリ名 | `:repoIdOrName` (URL) |
| `--status` | `-S` | string[] | No | `open` | ステータス（`open`/`closed`/`merged`） | `statusId[]` |
| `--assignee` | `-a` | string | No | — | 担当者 | `assigneeId[]` |
| `--created-by` | | string | No | — | 作成者 | `createdUserId[]` |
| `--issue` | | string | No | — | 関連課題キー | `issueId[]` |
| `--limit` | `-L` | number | No | 20 | 取得件数（1-100） | `count` |
| `--offset` | | number | No | 0 | オフセット | `offset` |

- **対応 API**: `GET /api/v2/projects/:key/git/repositories/:repo/pullRequests`
- **状態**: 未着手

#### `backlog pr view <number>`

PR の詳細を表示する。

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<number>` | number | Yes | PR 番号 |
| `--repo` | string | No | リポジトリ名 |
| `--comments` | boolean | No | コメントも表示 |
| `--web` | boolean | No | ブラウザで開く |

- **対応 API**: `GET .../pullRequests/:number`
- **状態**: 未着手

#### `backlog pr create`

新しい PR を作成する。

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `--repo` | `-R` | string | No | カレントリポジトリ | リポジトリ名 | `:repoIdOrName` (URL) |
| `--title` | `-t` | string | Yes* | — | PR タイトル | `summary` |
| `--body` | `-b` | string | Yes* | — | PR 説明 | `description` |
| `--base` | `-B` | string | Yes* | — | マージ先ブランチ | `base` |
| `--branch` | | string | No | 現在のブランチ | マージ元ブランチ | `branch` |
| `--assignee` | `-a` | string | No | — | 担当者 | `assigneeId` |
| `--issue` | | string | No | — | 関連課題キー | `issueId` |
| `--notify` | `-n` | string[] | No | — | 通知先ユーザー | `notifiedUserId[]` |
| `--web` | | boolean | No | false | 作成後ブラウザで開く | — |

- **対応 API**: `POST .../pullRequests`
- **状態**: 未着手

#### `backlog pr edit <number>`

既存の PR を更新する。

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `<number>` | | number | Yes | — | PR 番号 | `:number` (URL) |
| `--repo` | `-R` | string | No | カレントリポジトリ | リポジトリ名 | `:repoIdOrName` (URL) |
| `--title` | `-t` | string | No | — | タイトル | `summary` |
| `--body` | `-b` | string | No | — | 説明 | `description` |
| `--assignee` | `-a` | string | No | — | 担当者 | `assigneeId` |
| `--issue` | | string | No | — | 関連課題キー | `issueId` |

- **対応 API**: `PATCH .../pullRequests/:number`
- **状態**: 未着手

#### `backlog pr close <number>`

PR をクローズする。

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<number>` | number | Yes | PR 番号 |
| `--repo` | string | No | リポジトリ名 |
| `--comment` | string | No | クローズコメント |

- **対応 API**: `PATCH .../pullRequests/:number` (status を Close に変更)
- **状態**: 未着手

#### `backlog pr merge <number>`

PR をマージする。

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<number>` | number | Yes | PR 番号 |
| `--repo` | string | No | リポジトリ名 |
| `--comment` | string | No | マージコメント |

- **対応 API**: `PATCH .../pullRequests/:number` (status を Merged に変更)
- **状態**: 未着手

#### `backlog pr reopen <number>`

クローズした PR を再オープンする。

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<number>` | number | Yes | PR 番号 |
| `--repo` | string | No | リポジトリ名 |

- **対応 API**: `PATCH .../pullRequests/:number` (status を Open に変更)
- **状態**: 未着手

#### `backlog pr comment <number>`

PR にコメントを追加する。

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `<number>` | | number | Yes | PR 番号 | `:number` (URL) |
| `--repo` | `-R` | string | No | リポジトリ名 | `:repoIdOrName` (URL) |
| `--body` | `-b` | string | Yes* | コメント本文 | `content` |
| `--notify` | `-n` | string[] | No | 通知先 | `notifiedUserId[]` |

- **対応 API**: `POST .../pullRequests/:number/comments`
- **状態**: 未着手

#### `backlog pr comments <number>`

PR のコメント一覧を表示する。

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<number>` | number | Yes | PR 番号 |
| `--repo` | string | No | リポジトリ名 |
| `--limit` | number | No | 取得件数 |

- **対応 API**: `GET .../pullRequests/:number/comments`
- **状態**: 未着手

#### `backlog pr status`

自分に関連する PR のサマリーを表示する。

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `--repo` | string | No | リポジトリ名 |

- **対応 API**: `GET .../pullRequests` (assigneeId=自分でフィルタ)
- **状態**: 未着手

---

### 2.2 `backlog repo` — Git リポジトリ

#### `backlog repo list [project-key]`

Git リポジトリ一覧を取得する。

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `[project-key]` | string | No | プロジェクトキー |

- **対応 API**: `GET /api/v2/projects/:key/git/repositories`
- **状態**: 未着手

#### `backlog repo view [repo-name]`

Git リポジトリの詳細を表示する。

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `[repo-name]` | string | No | リポジトリ名 |
| `--web` | boolean | No | ブラウザで開く |

- **対応 API**: `GET /api/v2/projects/:key/git/repositories/:repoIdOrName`
- **状態**: 未着手

#### `backlog repo clone <repo-name>`

Git リポジトリをクローンする。

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<repo-name>` | string | Yes | リポジトリ名 |
| `--directory` | string | No | クローン先ディレクトリ |

- **対応 API**: ローカル `git clone` を実行
- **状態**: 未着手

---

### 2.3 `backlog notification` — 通知管理

#### `backlog notification list`

通知一覧を表示する。

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `--limit` | `-L` | number | No | 20 | 取得件数 | `count` |
| `--min-id` | | number | No | — | 最小通知ID | `minId` |
| `--max-id` | | number | No | — | 最大通知ID | `maxId` |
| `--order` | | string | No | `desc` | 並び順 | `order` |

- **対応 API**: `GET /api/v2/notifications`
- **状態**: 未着手

#### `backlog notification count`

未読通知数を表示する。

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `--already-read` | | boolean | No | — | 既読を含める | `alreadyRead` |
| `--resource-already-read` | | boolean | No | — | リソース既読を含める | `resourceAlreadyRead` |

- **対応 API**: `GET /api/v2/notifications/count`
- **状態**: 未着手

#### `backlog notification read <id>`

特定の通知を既読にする。

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<id>` | number | Yes | 通知 ID |

- **対応 API**: `POST /api/v2/notifications/:id/markAsRead`
- **状態**: 未着手

#### `backlog notification read-all`

全通知を既読にする。

- **対応 API**: `POST /api/v2/notifications/markAsRead`
- **状態**: 未着手

---

### 2.4 `backlog status` — ダッシュボード

#### `backlog status`

自分に関連する情報の概要を表示する。

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| （なし） | | | 担当課題・通知・最近の更新をまとめて表示 |

- **対応 API（複数）**:
  - `GET /api/v2/users/myself`
  - `GET /api/v2/notifications`
  - `GET /api/v2/users/myself/recentlyViewedIssues`
  - `GET /api/v2/issues` (assigneeId=自分)
- **状態**: 未着手

---

### 2.5 `backlog browse [target]` — ブラウザで開く

#### `backlog browse [target]`

対象をブラウザで開く。

| 引数/オプション | 型 | 必須 | デフォルト | 説明 |
|------------------|------|------|------------|------|
| `[target]` | string | No | プロジェクトトップ | 課題キーまたはパス |
| `--issues` | boolean | No | false | 課題一覧を開く |
| `--wiki` | boolean | No | false | Wiki を開く |
| `--git` | boolean | No | false | Git リポジトリページを開く |
| `--settings` | boolean | No | false | プロジェクト設定を開く |

- **対応 API**: ローカルで URL を構築しブラウザで開く
- **状態**: 未着手

---

## Phase 3: 管理機能

### 3.1 `backlog wiki` — Wiki 管理

#### `backlog wiki list`

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `--keyword` | `-k` | string | No | — | キーワード検索 | `keyword` |
| `--sort` | | string | No | `updated` | ソートキー | `sort` |
| `--order` | | string | No | `desc` | 並び順 | `order` |
| `--offset` | | number | No | 0 | オフセット | `offset` |
| `--limit` | `-L` | number | No | 20 | 取得件数 | `count` |

- **対応 API**: `GET /api/v2/wikis`
- **状態**: 未着手

#### `backlog wiki view <wiki-id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<wiki-id>` | number | Yes | Wiki ページ ID |
| `--web` | boolean | No | ブラウザで開く |

- **対応 API**: `GET /api/v2/wikis/:wikiId`
- **状態**: 未着手

#### `backlog wiki create`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `--name` | `-n` | string | Yes* | ページ名 | `name` |
| `--body` | `-b` | string | Yes* | 本文 | `content` |
| `--notify` | | boolean | No | メール通知 | `mailNotify` |

- **対応 API**: `POST /api/v2/wikis`
- **状態**: 未着手

#### `backlog wiki edit <wiki-id>`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `<wiki-id>` | | number | Yes | ページ ID | `:wikiId` (URL) |
| `--name` | `-n` | string | No | ページ名 | `name` |
| `--body` | `-b` | string | No | 本文 | `content` |
| `--notify` | | boolean | No | メール通知 | `mailNotify` |

- **対応 API**: `PATCH /api/v2/wikis/:wikiId`
- **状態**: 未着手

#### `backlog wiki delete <wiki-id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<wiki-id>` | number | Yes | ページ ID |
| `--confirm` | boolean | No | 確認プロンプトをスキップ |

- **対応 API**: `DELETE /api/v2/wikis/:wikiId`
- **状態**: 未着手

#### `backlog wiki count`

- **対応 API**: `GET /api/v2/wikis/count`
- **状態**: 未着手

#### `backlog wiki tags`

- **対応 API**: `GET /api/v2/wikis/tags`
- **状態**: 未着手

#### `backlog wiki history <wiki-id>`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `<wiki-id>` | | number | Yes | ページ ID | `:wikiId` (URL) |
| `--limit` | `-L` | number | No | 取得件数 | `count` |
| `--offset` | | number | No | オフセット | `offset` |

- **対応 API**: `GET /api/v2/wikis/:wikiId/history`
- **状態**: 未着手

#### `backlog wiki attachments <wiki-id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<wiki-id>` | number | Yes | ページ ID |

- **対応 API**: `GET /api/v2/wikis/:wikiId/attachments`
- **状態**: 未着手

---

### 3.2 `backlog project` (残り) — プロジェクト管理拡張

#### `backlog project create`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `--name` | `-n` | string | Yes | プロジェクト名 | `name` |
| `--key` | `-k` | string | Yes | プロジェクトキー（英大文字） | `key` |
| `--chart-enabled` | | boolean | No | チャート有効 | `chartEnabled` |
| `--subtasking-enabled` | | boolean | No | サブタスク有効 | `subtaskingEnabled` |
| `--project-leader-can-edit-project-leader` | | boolean | No | PL 変更権限 | `projectLeaderCanEditProjectLeader` |
| `--text-formatting-rule` | | string | No | 書式ルール（`markdown`/`backlog`） | `textFormattingRule` |

- **対応 API**: `POST /api/v2/projects`
- **状態**: 未着手

#### `backlog project edit <project-key>`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `<project-key>` | | string | Yes | プロジェクトキー | `:projectIdOrKey` (URL) |
| `--name` | `-n` | string | No | プロジェクト名 | `name` |
| `--key` | `-k` | string | No | プロジェクトキー | `key` |
| `--chart-enabled` | | boolean | No | チャート有効 | `chartEnabled` |
| `--archived` | | boolean | No | アーカイブ | `archived` |

- **対応 API**: `PATCH /api/v2/projects/:projectIdOrKey`
- **状態**: 未着手

#### `backlog project delete <project-key>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<project-key>` | string | Yes | プロジェクトキー |
| `--confirm` | boolean | No | 確認スキップ |

- **対応 API**: `DELETE /api/v2/projects/:projectIdOrKey`
- **状態**: 未着手

#### `backlog project users <project-key>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<project-key>` | string | Yes | プロジェクトキー |

- **対応 API**: `GET /api/v2/projects/:key/users`
- **状態**: 未着手

#### `backlog project add-user <project-key>`

| 引数/オプション | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|----------------|
| `<project-key>` | string | Yes | プロジェクトキー | `:key` (URL) |
| `--user-id` | number | Yes | ユーザー ID | `userId` |

- **対応 API**: `POST /api/v2/projects/:key/users`
- **状態**: 未着手

#### `backlog project remove-user <project-key>`

| 引数/オプション | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|----------------|
| `<project-key>` | string | Yes | プロジェクトキー | `:key` (URL) |
| `--user-id` | number | Yes | ユーザー ID | `userId` |

- **対応 API**: `DELETE /api/v2/projects/:key/users`
- **状態**: 未着手

---

### 3.3 `backlog user` — ユーザー管理

#### `backlog user list`

- **対応 API**: `GET /api/v2/users`
- **状態**: 未着手

#### `backlog user view <user-id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<user-id>` | number | Yes | ユーザー ID |

- **対応 API**: `GET /api/v2/users/:userId`
- **状態**: 未着手

#### `backlog user me`

- **対応 API**: `GET /api/v2/users/myself`
- **状態**: 未着手

#### `backlog user activities <user-id>`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `<user-id>` | | number | Yes | ユーザー ID | `:userId` (URL) |
| `--limit` | `-L` | number | No | 取得件数 | `count` |
| `--activity-type` | | number[] | No | タイプフィルタ | `activityTypeId[]` |

- **対応 API**: `GET /api/v2/users/:userId/activities`
- **状態**: 未着手

---

### 3.4 `backlog team` — チーム管理

#### `backlog team list`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `--order` | | string | No | 並び順 | `order` |
| `--offset` | | number | No | オフセット | `offset` |
| `--limit` | `-L` | number | No | 取得件数 | `count` |

- **対応 API**: `GET /api/v2/teams`
- **状態**: 未着手

#### `backlog team view <team-id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<team-id>` | number | Yes | チーム ID |

- **対応 API**: `GET /api/v2/teams/:teamId`
- **状態**: 未着手

#### `backlog team create`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `--name` | `-n` | string | Yes | チーム名 | `name` |
| `--members` | | number[] | No | メンバー ID | `members[]` |

- **対応 API**: `POST /api/v2/teams`
- **状態**: 未着手

#### `backlog team edit <team-id>`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `<team-id>` | | number | Yes | チーム ID | `:teamId` (URL) |
| `--name` | `-n` | string | No | チーム名 | `name` |
| `--members` | | number[] | No | メンバー ID | `members[]` |

- **対応 API**: `PATCH /api/v2/teams/:teamId`
- **状態**: 未着手

#### `backlog team delete <team-id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<team-id>` | number | Yes | チーム ID |
| `--confirm` | boolean | No | 確認スキップ |

- **対応 API**: `DELETE /api/v2/teams/:teamId`
- **状態**: 未着手

---

### 3.5 `backlog category` — カテゴリ管理

#### `backlog category list`

- **対応 API**: `GET /api/v2/projects/:key/categories`
- **状態**: 未着手

#### `backlog category create`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `--name` | `-n` | string | Yes | カテゴリ名 | `name` |

- **対応 API**: `POST /api/v2/projects/:key/categories`
- **状態**: 未着手

#### `backlog category edit <id>`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `<id>` | | number | Yes | カテゴリ ID | `:id` (URL) |
| `--name` | `-n` | string | Yes | カテゴリ名 | `name` |

- **対応 API**: `PATCH /api/v2/projects/:key/categories/:id`
- **状態**: 未着手

#### `backlog category delete <id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<id>` | number | Yes | カテゴリ ID |
| `--confirm` | boolean | No | 確認スキップ |

- **対応 API**: `DELETE /api/v2/projects/:key/categories/:id`
- **状態**: 未着手

---

### 3.6 `backlog milestone` — マイルストーン管理

#### `backlog milestone list`

- **対応 API**: `GET /api/v2/projects/:key/versions`
- **状態**: 未着手

#### `backlog milestone create`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `--name` | `-n` | string | Yes | マイルストーン名 | `name` |
| `--description` | `-d` | string | No | 説明 | `description` |
| `--start-date` | | string | No | 開始日（yyyy-MM-dd） | `startDate` |
| `--release-due-date` | | string | No | リリース予定日 | `releaseDueDate` |

- **対応 API**: `POST /api/v2/projects/:key/versions`
- **状態**: 未着手

#### `backlog milestone edit <id>`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `<id>` | | number | Yes | マイルストーン ID | `:id` (URL) |
| `--name` | `-n` | string | No | 名前 | `name` |
| `--description` | `-d` | string | No | 説明 | `description` |
| `--start-date` | | string | No | 開始日 | `startDate` |
| `--release-due-date` | | string | No | リリース予定日 | `releaseDueDate` |
| `--archived` | | boolean | No | アーカイブ | `archived` |

- **対応 API**: `PATCH /api/v2/projects/:key/versions/:id`
- **状態**: 未着手

#### `backlog milestone delete <id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<id>` | number | Yes | マイルストーン ID |
| `--confirm` | boolean | No | 確認スキップ |

- **対応 API**: `DELETE /api/v2/projects/:key/versions/:id`
- **状態**: 未着手

---

### 3.7 `backlog issue-type` — 課題種別管理

#### `backlog issue-type list`

- **対応 API**: `GET /api/v2/projects/:key/issueTypes`
- **状態**: 未着手

#### `backlog issue-type create`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `--name` | `-n` | string | Yes | 種別名 | `name` |
| `--color` | | string | Yes | 表示色（`#hex`） | `color` |

- **対応 API**: `POST /api/v2/projects/:key/issueTypes`
- **状態**: 未着手

#### `backlog issue-type edit <id>`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `<id>` | | number | Yes | 種別 ID | `:id` (URL) |
| `--name` | `-n` | string | No | 種別名 | `name` |
| `--color` | | string | No | 表示色 | `color` |

- **対応 API**: `PATCH /api/v2/projects/:key/issueTypes/:id`
- **状態**: 未着手

#### `backlog issue-type delete <id>`

| 引数/オプション | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|----------------|
| `<id>` | number | Yes | 種別 ID | `:id` (URL) |
| `--substitute-issue-type-id` | number | Yes | 代替種別 ID | `substituteIssueTypeId` |
| `--confirm` | boolean | No | 確認スキップ | — |

- **対応 API**: `DELETE /api/v2/projects/:key/issueTypes/:id`
- **状態**: 未着手

---

### 3.8 `backlog status-type` — ステータス管理

#### `backlog status-type list`

- **対応 API**: `GET /api/v2/projects/:key/statuses`
- **状態**: 未着手

#### `backlog status-type create`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `--name` | `-n` | string | Yes | ステータス名 | `name` |
| `--color` | | string | Yes | 表示色（`#hex`） | `color` |

- **対応 API**: `POST /api/v2/projects/:key/statuses`
- **状態**: 未着手

#### `backlog status-type edit <id>`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `<id>` | | number | Yes | ステータス ID | `:statusId` (URL) |
| `--name` | `-n` | string | No | ステータス名 | `name` |
| `--color` | | string | No | 表示色 | `color` |

- **対応 API**: `PATCH /api/v2/projects/:key/statuses/:statusId`
- **状態**: 未着手

#### `backlog status-type delete <id>`

| 引数/オプション | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|----------------|
| `<id>` | number | Yes | ステータス ID | `:statusId` (URL) |
| `--substitute-status-id` | number | Yes | 代替ステータス ID | `substituteStatusId` |
| `--confirm` | boolean | No | 確認スキップ | — |

- **対応 API**: `DELETE /api/v2/projects/:key/statuses/:statusId`
- **状態**: 未着手

---

## Phase 4: 拡張機能

### 4.1 `backlog space` — スペース管理

#### `backlog space info`

- **対応 API**: `GET /api/v2/space`
- **状態**: 未着手

#### `backlog space activities`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `--limit` | `-L` | number | No | 取得件数 | `count` |
| `--activity-type` | | number[] | No | タイプフィルタ | `activityTypeId[]` |

- **対応 API**: `GET /api/v2/space/activities`
- **状態**: 未着手

#### `backlog space disk-usage`

- **対応 API**: `GET /api/v2/space/diskUsage`
- **状態**: 未着手

#### `backlog space notification`

- **対応 API**: `GET /api/v2/space/notification`
- **状態**: 未着手

---

### 4.2 `backlog webhook` — Webhook 管理

#### `backlog webhook list`

- **対応 API**: `GET /api/v2/projects/:key/webhooks`
- **状態**: 未着手

#### `backlog webhook view <id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<id>` | number | Yes | Webhook ID |

- **対応 API**: `GET /api/v2/projects/:key/webhooks/:id`
- **状態**: 未着手

#### `backlog webhook create`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `--name` | `-n` | string | Yes | Webhook 名 | `name` |
| `--hook-url` | | string | Yes | 通知先 URL | `hookUrl` |
| `--description` | `-d` | string | No | 説明 | `description` |
| `--all-event` | | boolean | No | 全イベント対象 | `allEvent` |
| `--activity-type-ids` | | number[] | No | 対象イベントタイプ | `activityTypeIds[]` |

- **対応 API**: `POST /api/v2/projects/:key/webhooks`
- **状態**: 未着手

#### `backlog webhook edit <id>`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `<id>` | | number | Yes | Webhook ID | `:webhookId` (URL) |
| `--name` | `-n` | string | No | 名前 | `name` |
| `--hook-url` | | string | No | URL | `hookUrl` |
| `--description` | `-d` | string | No | 説明 | `description` |
| `--all-event` | | boolean | No | 全イベント | `allEvent` |
| `--activity-type-ids` | | number[] | No | イベントタイプ | `activityTypeIds[]` |

- **対応 API**: `PATCH /api/v2/projects/:key/webhooks/:webhookId`
- **状態**: 未着手

#### `backlog webhook delete <id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<id>` | number | Yes | Webhook ID |
| `--confirm` | boolean | No | 確認スキップ |

- **対応 API**: `DELETE /api/v2/projects/:key/webhooks/:webhookId`
- **状態**: 未着手

---

### 4.3 `backlog star` — スター

#### `backlog star add`

| 引数/オプション | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|----------------|
| `--issue` | string | No | 課題キー | `issueId` |
| `--comment` | number | No | コメント ID | `commentId` |
| `--wiki` | number | No | Wiki ID | `wikiId` |
| `--pr-comment` | number | No | PR コメント ID | `pullRequestCommentId` |

- **対応 API**: `POST /api/v2/stars`
- **状態**: 未着手

#### `backlog star list [user-id]`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `[user-id]` | | number | No | ユーザー ID（省略時は自分） | `:userId` (URL) |
| `--limit` | `-L` | number | No | 取得件数 | `count` |
| `--order` | | string | No | 並び順 | `order` |

- **対応 API**: `GET /api/v2/users/:userId/stars`
- **状態**: 未着手

#### `backlog star count [user-id]`

| 引数/オプション | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|----------------|
| `[user-id]` | number | No | ユーザー ID | `:userId` (URL) |
| `--since` | string | No | 開始日 | `since` |
| `--until` | string | No | 終了日 | `until` |

- **対応 API**: `GET /api/v2/users/:userId/stars/count`
- **状態**: 未着手

---

### 4.4 `backlog watching` — ウォッチ

#### `backlog watching list [user-id]`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `[user-id]` | | number | No | ユーザー ID | `:userId` (URL) |
| `--limit` | `-L` | number | No | 取得件数 | `count` |
| `--order` | | string | No | 並び順 | `order` |
| `--sort` | | string | No | ソートキー | `sort` |

- **対応 API**: `GET /api/v2/users/:userId/watchings`
- **状態**: 未着手

#### `backlog watching add`

| 引数/オプション | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|----------------|
| `--issue` | string | Yes | 課題キー | `issueIdOrKey` |
| `--note` | string | No | メモ | `note` |

- **対応 API**: `POST /api/v2/watchings`
- **状態**: 未着手

#### `backlog watching view <watching-id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<watching-id>` | number | Yes | ウォッチ ID |

- **対応 API**: `GET /api/v2/watchings/:watchingId`
- **状態**: 未着手

#### `backlog watching delete <watching-id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<watching-id>` | number | Yes | ウォッチ ID |
| `--confirm` | boolean | No | 確認スキップ |

- **対応 API**: `DELETE /api/v2/watchings/:watchingId`
- **状態**: 未着手

#### `backlog watching read <watching-id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<watching-id>` | number | Yes | ウォッチ ID |

- **対応 API**: `POST /api/v2/watchings/:watchingId/markAsRead`
- **状態**: 未着手

---

### 4.5 `backlog alias` — エイリアス

#### `backlog alias set <name> <expansion>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<name>` | string | Yes | エイリアス名 |
| `<expansion>` | string | Yes | 展開されるコマンド |
| `--shell` | boolean | No | シェルコマンドとして登録 |

- **対応 API**: ローカル設定
- **状態**: 未着手

#### `backlog alias list`

- **対応 API**: ローカル設定
- **状態**: 未着手

#### `backlog alias delete <name>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<name>` | string | Yes | エイリアス名 |

- **対応 API**: ローカル設定
- **状態**: 未着手

---

### 4.6 `backlog auth` (残り) — 認証拡張

#### `backlog auth refresh`

OAuth トークンをリフレッシュする。

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `--hostname` | string | No | 対象スペース |

- **対応 API**: OAuth 2.0 Token Refresh
- **状態**: 未着手

#### `backlog auth switch`

アクティブスペースを切り替える。

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `--hostname` | string | No | 切り替え先スペース |

- **対応 API**: ローカル設定
- **状態**: 未着手

---

### 4.7 `backlog completion` — シェル補完

#### `backlog completion <shell>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<shell>` | string | Yes | シェル種別（`bash`/`zsh`/`fish`） |

- **対応 API**: ローカル処理
- **状態**: 未着手

---

## 設計原則

### 1. 名前解決

CLI ではユーザーフレンドリーな名前を使い、API リクエスト時に内部で ID に変換する。

| CLI での入力 | API での送信 | 変換元 API |
|--------------|-------------|-----------|
| ステータス名（例: `処理中`） | `statusId` | `GET /api/v2/projects/:key/statuses` |
| 課題種別名（例: `バグ`） | `issueTypeId` | `GET /api/v2/projects/:key/issueTypes` |
| 優先度名（例: `高`） | `priorityId` | `GET /api/v2/priorities` |
| カテゴリ名 | `categoryId` | `GET /api/v2/projects/:key/categories` |
| マイルストーン名 | `milestoneId` | `GET /api/v2/projects/:key/versions` |
| ユーザー名 / `@me` | `userId` / `assigneeId` | `GET /api/v2/users` / `GET /api/v2/users/myself` |
| 完了理由名 | `resolutionId` | `GET /api/v2/resolutions` |

### 2. 出力形式

| フラグ | 出力形式 | 用途 |
|--------|----------|------|
| （なし） | テーブル形式 | 人間が読む用 |
| `--json` | JSON | プログラム連携 |
| `--json field1,field2` | フィルタ済み JSON | 特定フィールドのみ |
| `--jq '.[]'` | jq 変換済み出力 | 高度なフィルタ |
| `--template '{{.Key}}'` | Go template | カスタムフォーマット |

### 3. インタラクティブモード

必須引数が省略された場合、対話的にプロンプトを表示してユーザーに入力を求める。

- TTY 接続時のみ有効
- `--no-input` フラグで無効化
- 選択式のフィールドはリスト選択 UI を提供

### 4. プロジェクトコンテキスト

プロジェクトは以下の優先順で解決する:

1. `--project` フラグ
2. カレントディレクトリの `.backlog` 設定ファイル
3. Git リモート URL からの推測
4. インタラクティブ選択

### 5. エラーハンドリング

- HTTP 4xx/5xx エラーは Backlog API のエラーメッセージをそのまま表示
- 認証エラーは `backlog auth login` を案内
- レートリミットは自動リトライ（`Retry-After` ヘッダーを尊重）
