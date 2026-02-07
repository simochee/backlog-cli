# backlog-cli コマンド仕様書

> 各コマンドの引数・オプション・対応 API エンドポイントの詳細定義。
> 実装時の参照ドキュメントとして使用する。

---

## 共通オプション（グローバルフラグ）

すべてのコマンドで使用可能な共通フラグ。

| フラグ | 短縮 | 型 | デフォルト | 説明 |
|--------|------|------|------------|------|
| `--space` | `-s` | string | デフォルトスペース | 対象の Backlog スペース（AWS CLI の `--profile` 相当） |
| `--json` | | string[] | — | JSON出力。フィールド名を指定可 |
| `--jq` | `-q` | string | — | jq式でJSON出力をフィルタ |
| `--template` | `-t` | string | — | Go template形式の出力フォーマット |
| `--no-pager` | | boolean | false | ページャーを無効化 |
| `--help` | `-h` | boolean | — | ヘルプ表示 |
| `--version` | `-V` | boolean | — | バージョン表示 |

---

## Phase 1: MVP

### 1.1 `backlog auth` — 認証管理

#### `backlog auth login`

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 |
|------------------|------|------|------|------------|------|
| `--hostname` | `-h` | string | No | — | スペースホスト名（例: `xxx.backlog.com`） |
| `--method` | `-m` | string | No | `api-key` | 認証方式（`api-key` / `oauth`） |
| `--with-token` | | boolean | No | false | 標準入力からトークンを読み込む |

- **対応 API**: OAuth 2.0 フロー / ローカル設定への書き込み

#### `backlog auth logout`

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 |
|------------------|------|------|------|------------|------|
| `--hostname` | `-h` | string | No | アクティブスペース | 対象スペースホスト名 |

- **対応 API**: ローカル設定の削除

#### `backlog auth status`

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 |
|------------------|------|------|------|------------|------|
| `--hostname` | `-h` | string | No | 全スペース | 対象スペースホスト名 |
| `--show-token` | | boolean | No | false | トークンを表示する |

- **対応 API**: `GET /api/v2/users/myself`

#### `backlog auth token`

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 |
|------------------|------|------|------|------------|------|
| `--hostname` | `-h` | string | No | アクティブスペース | 対象スペースホスト名 |

- **対応 API**: ローカル設定の読み取り

---

### 1.2 `backlog config` — CLI 設定管理

#### `backlog config get <key>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<key>` | string | Yes | 設定キー（例: `default_space`, `pager`） |
| `--hostname` | string | No | スペース単位の設定を取得 |

- **対応 API**: ローカル設定ファイル読み取り

#### `backlog config set <key> <value>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<key>` | string | Yes | 設定キー |
| `<value>` | string | Yes | 設定値 |
| `--hostname` | string | No | スペース単位で設定 |

- **対応 API**: ローカル設定ファイル書き込み

#### `backlog config list`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `--hostname` | string | No | スペース単位でフィルタ |

- **対応 API**: ローカル設定ファイル読み取り

---

### 1.3 `backlog issue` — 課題管理

#### `backlog issue list`

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `--project` | `-p` | string[] | No | — | プロジェクトキー（複数可） | `projectId[]` |
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

#### `backlog issue view <issue-key>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<issue-key>` | string | Yes | 課題キー（例: `PROJECT-123`） |
| `--comments` | boolean | No | コメントも表示する |
| `--web` | boolean | No | ブラウザで開く |

- **対応 API**: `GET /api/v2/issues/:issueIdOrKey`
- **補助 API**: `GET /api/v2/issues/:key/comments`（`--comments` 使用時）

#### `backlog issue create`

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `--project` | `-p` | string | Yes* | — | プロジェクトキー | `projectId` |
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

> *: インタラクティブモードでは省略可能

- **対応 API**: `POST /api/v2/issues`
- **補助 API**: `GET /api/v2/projects/:key/issueTypes`, `GET /api/v2/priorities`, `GET /api/v2/projects/:key/users`, `GET /api/v2/projects/:key/categories`, `GET /api/v2/projects/:key/versions`

#### `backlog issue edit <issue-key>`

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

#### `backlog issue close <issue-key>`

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `<issue-key>` | | string | Yes | — | 課題キー | `issueIdOrKey` (URL) |
| `--comment` | `-c` | string | No | — | 完了コメント | `comment` |
| `--resolution` | `-r` | string | No | `完了` | 完了理由名 | `resolutionId` |

- **対応 API**: `PATCH /api/v2/issues/:issueIdOrKey` (statusId を「完了」に設定)
- **補助 API**: `GET /api/v2/projects/:key/statuses`, `GET /api/v2/resolutions`

#### `backlog issue reopen <issue-key>`

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `<issue-key>` | | string | Yes | — | 課題キー | `issueIdOrKey` (URL) |
| `--comment` | `-c` | string | No | — | 再オープンコメント | `comment` |

- **対応 API**: `PATCH /api/v2/issues/:issueIdOrKey` (statusId を「未対応」に設定)
- **補助 API**: `GET /api/v2/projects/:key/statuses`

#### `backlog issue comment <issue-key>`

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `<issue-key>` | | string | Yes | — | 課題キー | `issueIdOrKey` (URL) |
| `--body` | `-b` | string | Yes* | — | コメント本文（`-` で stdin） | `content` |
| `--notify` | `-n` | string[] | No | — | 通知先ユーザー | `notifiedUserId[]` |

> *: 省略時はエディタが起動する

- **対応 API**: `POST /api/v2/issues/:issueIdOrKey/comments`

#### `backlog issue status`

- **対応 API**: `GET /api/v2/issues` (assigneeId=自分, ステータス別に集計)
- **補助 API**: `GET /api/v2/users/myself`

---

### 1.4 `backlog project` — プロジェクト管理

#### `backlog project list`

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `--archived` | | boolean | No | — | アーカイブ済みを含める | `archived` |
| `--all` | | boolean | No | false | 全プロジェクト（管理者のみ） | `all` |
| `--limit` | `-L` | number | No | 20 | 表示件数 | — (クライアントフィルタ) |

- **対応 API**: `GET /api/v2/projects`

#### `backlog project view [project-key]`

| 引数/オプション | 型 | 必須 | デフォルト | 説明 |
|------------------|------|------|------------|------|
| `[project-key]` | string | No | カレントプロジェクト | プロジェクトキー |
| `--web` | boolean | No | false | ブラウザで開く |

- **対応 API**: `GET /api/v2/projects/:projectIdOrKey`

#### `backlog project activities [project-key]`

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `[project-key]` | | string | No | カレントプロジェクト | プロジェクトキー | `:key` (URL) |
| `--limit` | `-L` | number | No | 20 | 取得件数 | `count` |
| `--activity-type` | | number[] | No | — | アクティビティタイプID | `activityTypeId[]` |

- **対応 API**: `GET /api/v2/projects/:key/activities`

---

### 1.5 `backlog api` — 汎用 API リクエスト

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

---

## Phase 2: 開発者向け機能

### 2.1 `backlog pr` — プルリクエスト管理

#### `backlog pr list`

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

#### `backlog pr view <number>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<number>` | number | Yes | PR 番号 |
| `--repo` | string | No | リポジトリ名 |
| `--comments` | boolean | No | コメントも表示 |
| `--web` | boolean | No | ブラウザで開く |

- **対応 API**: `GET .../pullRequests/:number`

#### `backlog pr create`

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

#### `backlog pr edit <number>`

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `<number>` | | number | Yes | — | PR 番号 | `:number` (URL) |
| `--repo` | `-R` | string | No | カレントリポジトリ | リポジトリ名 | `:repoIdOrName` (URL) |
| `--title` | `-t` | string | No | — | タイトル | `summary` |
| `--body` | `-b` | string | No | — | 説明 | `description` |
| `--assignee` | `-a` | string | No | — | 担当者 | `assigneeId` |
| `--issue` | | string | No | — | 関連課題キー | `issueId` |

- **対応 API**: `PATCH .../pullRequests/:number`

#### `backlog pr close <number>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<number>` | number | Yes | PR 番号 |
| `--repo` | string | No | リポジトリ名 |
| `--comment` | string | No | クローズコメント |

- **対応 API**: `PATCH .../pullRequests/:number` (status を Close に変更)

#### `backlog pr merge <number>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<number>` | number | Yes | PR 番号 |
| `--repo` | string | No | リポジトリ名 |
| `--comment` | string | No | マージコメント |

- **対応 API**: `PATCH .../pullRequests/:number` (status を Merged に変更)

#### `backlog pr reopen <number>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<number>` | number | Yes | PR 番号 |
| `--repo` | string | No | リポジトリ名 |

- **対応 API**: `PATCH .../pullRequests/:number` (status を Open に変更)

#### `backlog pr comment <number>`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `<number>` | | number | Yes | PR 番号 | `:number` (URL) |
| `--repo` | `-R` | string | No | リポジトリ名 | `:repoIdOrName` (URL) |
| `--body` | `-b` | string | Yes* | コメント本文 | `content` |
| `--notify` | `-n` | string[] | No | 通知先 | `notifiedUserId[]` |

- **対応 API**: `POST .../pullRequests/:number/comments`

#### `backlog pr comments <number>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<number>` | number | Yes | PR 番号 |
| `--repo` | string | No | リポジトリ名 |
| `--limit` | number | No | 取得件数 |

- **対応 API**: `GET .../pullRequests/:number/comments`

#### `backlog pr status`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `--repo` | string | No | リポジトリ名 |

- **対応 API**: `GET .../pullRequests` (assigneeId=自分でフィルタ)

---

### 2.2 `backlog repo` — Git リポジトリ

#### `backlog repo list [project-key]`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `[project-key]` | string | No | プロジェクトキー |

- **対応 API**: `GET /api/v2/projects/:key/git/repositories`

#### `backlog repo view [repo-name]`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `[repo-name]` | string | No | リポジトリ名 |
| `--web` | boolean | No | ブラウザで開く |

- **対応 API**: `GET /api/v2/projects/:key/git/repositories/:repoIdOrName`

#### `backlog repo clone <repo-name>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<repo-name>` | string | Yes | リポジトリ名 |
| `--directory` | string | No | クローン先ディレクトリ |

- **対応 API**: ローカル `git clone` を実行

---

### 2.3 `backlog notification` — 通知管理

#### `backlog notification list`

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `--limit` | `-L` | number | No | 20 | 取得件数 | `count` |
| `--min-id` | | number | No | — | 最小通知ID | `minId` |
| `--max-id` | | number | No | — | 最大通知ID | `maxId` |
| `--order` | | string | No | `desc` | 並び順 | `order` |

- **対応 API**: `GET /api/v2/notifications`

#### `backlog notification count`

| 引数/オプション | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|----------------|
| `--already-read` | boolean | No | 既読を含める | `alreadyRead` |
| `--resource-already-read` | boolean | No | リソース既読を含める | `resourceAlreadyRead` |

- **対応 API**: `GET /api/v2/notifications/count`

#### `backlog notification read <id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<id>` | number | Yes | 通知 ID |

- **対応 API**: `POST /api/v2/notifications/:id/markAsRead`

#### `backlog notification read-all`

- **対応 API**: `POST /api/v2/notifications/markAsRead`

---

### 2.4 `backlog status` — ダッシュボード

- **対応 API**: `GET /api/v2/users/myself`, `GET /api/v2/notifications`, `GET /api/v2/users/myself/recentlyViewedIssues`, `GET /api/v2/issues` (assigneeId=自分)

---

### 2.5 `backlog browse [target]`

| 引数/オプション | 型 | 必須 | デフォルト | 説明 |
|------------------|------|------|------------|------|
| `[target]` | string | No | プロジェクトトップ | 課題キーまたはパス |
| `--issues` | boolean | No | false | 課題一覧を開く |
| `--wiki` | boolean | No | false | Wiki を開く |
| `--git` | boolean | No | false | Git リポジトリページを開く |
| `--settings` | boolean | No | false | プロジェクト設定を開く |

- **対応 API**: ローカルで URL を構築しブラウザで開く

---

## Phase 3: 管理機能

### 3.1 `backlog wiki` — Wiki 管理

#### `backlog wiki list`

| 引数/オプション | 短縮 | 型 | 必須 | デフォルト | 説明 | API パラメータ |
|------------------|------|------|------|------------|------|----------------|
| `--project` | `-p` | string | Yes* | — | プロジェクトキー | `projectIdOrKey` |
| `--keyword` | `-k` | string | No | — | キーワード検索 | `keyword` |
| `--sort` | | string | No | `updated` | ソートキー | `sort` |
| `--order` | | string | No | `desc` | 並び順 | `order` |
| `--offset` | | number | No | 0 | オフセット | `offset` |
| `--limit` | `-L` | number | No | 20 | 取得件数 | `count` |

- **対応 API**: `GET /api/v2/wikis`

#### `backlog wiki view <wiki-id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<wiki-id>` | number | Yes | Wiki ページ ID |
| `--web` | boolean | No | ブラウザで開く |

- **対応 API**: `GET /api/v2/wikis/:wikiId`

#### `backlog wiki create`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `--project` | `-p` | string | Yes* | プロジェクトキー | `projectId` |
| `--name` | `-n` | string | Yes* | ページ名 | `name` |
| `--body` | `-b` | string | Yes* | 本文 | `content` |
| `--notify` | | boolean | No | メール通知 | `mailNotify` |

- **対応 API**: `POST /api/v2/wikis`

#### `backlog wiki edit <wiki-id>`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `<wiki-id>` | | number | Yes | ページ ID | `:wikiId` (URL) |
| `--name` | `-n` | string | No | ページ名 | `name` |
| `--body` | `-b` | string | No | 本文 | `content` |
| `--notify` | | boolean | No | メール通知 | `mailNotify` |

- **対応 API**: `PATCH /api/v2/wikis/:wikiId`

#### `backlog wiki delete <wiki-id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<wiki-id>` | number | Yes | ページ ID |
| `--confirm` | boolean | No | 確認プロンプトをスキップ |

- **対応 API**: `DELETE /api/v2/wikis/:wikiId`

#### `backlog wiki count`

- **対応 API**: `GET /api/v2/wikis/count`

#### `backlog wiki tags`

- **対応 API**: `GET /api/v2/wikis/tags`

#### `backlog wiki history <wiki-id>`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `<wiki-id>` | | number | Yes | ページ ID | `:wikiId` (URL) |
| `--limit` | `-L` | number | No | 取得件数 | `count` |
| `--offset` | | number | No | オフセット | `offset` |

- **対応 API**: `GET /api/v2/wikis/:wikiId/history`

#### `backlog wiki attachments <wiki-id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<wiki-id>` | number | Yes | ページ ID |

- **対応 API**: `GET /api/v2/wikis/:wikiId/attachments`

---

### 3.2 `backlog project` (追加) — プロジェクト管理拡張

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

#### `backlog project edit <project-key>`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `<project-key>` | | string | Yes | プロジェクトキー | `:projectIdOrKey` (URL) |
| `--name` | `-n` | string | No | プロジェクト名 | `name` |
| `--key` | `-k` | string | No | プロジェクトキー | `key` |
| `--chart-enabled` | | boolean | No | チャート有効 | `chartEnabled` |
| `--archived` | | boolean | No | アーカイブ | `archived` |

- **対応 API**: `PATCH /api/v2/projects/:projectIdOrKey`

#### `backlog project delete <project-key>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<project-key>` | string | Yes | プロジェクトキー |
| `--confirm` | boolean | No | 確認スキップ |

- **対応 API**: `DELETE /api/v2/projects/:projectIdOrKey`

#### `backlog project users <project-key>`

- **対応 API**: `GET /api/v2/projects/:key/users`

#### `backlog project add-user <project-key>`

| 引数/オプション | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|----------------|
| `<project-key>` | string | Yes | プロジェクトキー | `:key` (URL) |
| `--user-id` | number | Yes | ユーザー ID | `userId` |

- **対応 API**: `POST /api/v2/projects/:key/users`

#### `backlog project remove-user <project-key>`

| 引数/オプション | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|----------------|
| `<project-key>` | string | Yes | プロジェクトキー | `:key` (URL) |
| `--user-id` | number | Yes | ユーザー ID | `userId` |

- **対応 API**: `DELETE /api/v2/projects/:key/users`

---

### 3.3 `backlog user` — ユーザー管理

#### `backlog user list`

- **対応 API**: `GET /api/v2/users`

#### `backlog user view <user-id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<user-id>` | number | Yes | ユーザー ID |

- **対応 API**: `GET /api/v2/users/:userId`

#### `backlog user me`

- **対応 API**: `GET /api/v2/users/myself`

#### `backlog user activities <user-id>`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `<user-id>` | | number | Yes | ユーザー ID | `:userId` (URL) |
| `--limit` | `-L` | number | No | 取得件数 | `count` |
| `--activity-type` | | number[] | No | タイプフィルタ | `activityTypeId[]` |

- **対応 API**: `GET /api/v2/users/:userId/activities`

---

### 3.4 `backlog team` — チーム管理

#### `backlog team list`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `--order` | | string | No | 並び順 | `order` |
| `--offset` | | number | No | オフセット | `offset` |
| `--limit` | `-L` | number | No | 取得件数 | `count` |

- **対応 API**: `GET /api/v2/teams`

#### `backlog team view <team-id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<team-id>` | number | Yes | チーム ID |

- **対応 API**: `GET /api/v2/teams/:teamId`

#### `backlog team create`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `--name` | `-n` | string | Yes | チーム名 | `name` |
| `--members` | | number[] | No | メンバー ID | `members[]` |

- **対応 API**: `POST /api/v2/teams`

#### `backlog team edit <team-id>`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `<team-id>` | | number | Yes | チーム ID | `:teamId` (URL) |
| `--name` | `-n` | string | No | チーム名 | `name` |
| `--members` | | number[] | No | メンバー ID | `members[]` |

- **対応 API**: `PATCH /api/v2/teams/:teamId`

#### `backlog team delete <team-id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<team-id>` | number | Yes | チーム ID |
| `--confirm` | boolean | No | 確認スキップ |

- **対応 API**: `DELETE /api/v2/teams/:teamId`

---

### 3.5 `backlog category` — カテゴリ管理

#### `backlog category list`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 |
|------------------|------|------|------|------|
| `--project` | `-p` | string | Yes* | プロジェクトキー |

- **対応 API**: `GET /api/v2/projects/:key/categories`

#### `backlog category create`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `--project` | `-p` | string | Yes* | プロジェクトキー | `:key` (URL) |
| `--name` | `-n` | string | Yes | カテゴリ名 | `name` |

- **対応 API**: `POST /api/v2/projects/:key/categories`

#### `backlog category edit <id>`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `<id>` | | number | Yes | カテゴリ ID | `:id` (URL) |
| `--name` | `-n` | string | Yes | カテゴリ名 | `name` |

- **対応 API**: `PATCH /api/v2/projects/:key/categories/:id`

#### `backlog category delete <id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<id>` | number | Yes | カテゴリ ID |
| `--confirm` | boolean | No | 確認スキップ |

- **対応 API**: `DELETE /api/v2/projects/:key/categories/:id`

---

### 3.6 `backlog milestone` — マイルストーン管理

#### `backlog milestone list`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 |
|------------------|------|------|------|------|
| `--project` | `-p` | string | Yes* | プロジェクトキー |

- **対応 API**: `GET /api/v2/projects/:key/versions`

#### `backlog milestone create`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `--project` | `-p` | string | Yes* | プロジェクトキー | `:key` (URL) |
| `--name` | `-n` | string | Yes | マイルストーン名 | `name` |
| `--description` | `-d` | string | No | 説明 | `description` |
| `--start-date` | | string | No | 開始日（yyyy-MM-dd） | `startDate` |
| `--release-due-date` | | string | No | リリース予定日 | `releaseDueDate` |

- **対応 API**: `POST /api/v2/projects/:key/versions`

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

#### `backlog milestone delete <id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<id>` | number | Yes | マイルストーン ID |
| `--confirm` | boolean | No | 確認スキップ |

- **対応 API**: `DELETE /api/v2/projects/:key/versions/:id`

---

### 3.7 `backlog issue-type` — 課題種別管理

#### `backlog issue-type list`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 |
|------------------|------|------|------|------|
| `--project` | `-p` | string | Yes* | プロジェクトキー |

- **対応 API**: `GET /api/v2/projects/:key/issueTypes`

#### `backlog issue-type create`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `--project` | `-p` | string | Yes* | プロジェクトキー | `:key` (URL) |
| `--name` | `-n` | string | Yes | 種別名 | `name` |
| `--color` | | string | Yes | 表示色（`#hex`） | `color` |

- **対応 API**: `POST /api/v2/projects/:key/issueTypes`

#### `backlog issue-type edit <id>`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `<id>` | | number | Yes | 種別 ID | `:id` (URL) |
| `--name` | `-n` | string | No | 種別名 | `name` |
| `--color` | | string | No | 表示色 | `color` |

- **対応 API**: `PATCH /api/v2/projects/:key/issueTypes/:id`

#### `backlog issue-type delete <id>`

| 引数/オプション | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|----------------|
| `<id>` | number | Yes | 種別 ID | `:id` (URL) |
| `--substitute-issue-type-id` | number | Yes | 代替種別 ID | `substituteIssueTypeId` |
| `--confirm` | boolean | No | 確認スキップ | — |

- **対応 API**: `DELETE /api/v2/projects/:key/issueTypes/:id`

---

### 3.8 `backlog status-type` — ステータス管理

#### `backlog status-type list`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 |
|------------------|------|------|------|------|
| `--project` | `-p` | string | Yes* | プロジェクトキー |

- **対応 API**: `GET /api/v2/projects/:key/statuses`

#### `backlog status-type create`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `--project` | `-p` | string | Yes* | プロジェクトキー | `:key` (URL) |
| `--name` | `-n` | string | Yes | ステータス名 | `name` |
| `--color` | | string | Yes | 表示色（`#hex`） | `color` |

- **対応 API**: `POST /api/v2/projects/:key/statuses`

#### `backlog status-type edit <id>`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `<id>` | | number | Yes | ステータス ID | `:statusId` (URL) |
| `--name` | `-n` | string | No | ステータス名 | `name` |
| `--color` | | string | No | 表示色 | `color` |

- **対応 API**: `PATCH /api/v2/projects/:key/statuses/:statusId`

#### `backlog status-type delete <id>`

| 引数/オプション | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|----------------|
| `<id>` | number | Yes | ステータス ID | `:statusId` (URL) |
| `--substitute-status-id` | number | Yes | 代替ステータス ID | `substituteStatusId` |
| `--confirm` | boolean | No | 確認スキップ | — |

- **対応 API**: `DELETE /api/v2/projects/:key/statuses/:statusId`

---

## Phase 4: 拡張機能

### 4.1 `backlog space` — スペース管理

#### `backlog space info`

- **対応 API**: `GET /api/v2/space`

#### `backlog space activities`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `--limit` | `-L` | number | No | 取得件数 | `count` |
| `--activity-type` | | number[] | No | タイプフィルタ | `activityTypeId[]` |

- **対応 API**: `GET /api/v2/space/activities`

#### `backlog space disk-usage`

- **対応 API**: `GET /api/v2/space/diskUsage`

#### `backlog space notification`

- **対応 API**: `GET /api/v2/space/notification`

---

### 4.2 `backlog webhook` — Webhook 管理

#### `backlog webhook list`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 |
|------------------|------|------|------|------|
| `--project` | `-p` | string | Yes* | プロジェクトキー |

- **対応 API**: `GET /api/v2/projects/:key/webhooks`

#### `backlog webhook view <id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<id>` | number | Yes | Webhook ID |

- **対応 API**: `GET /api/v2/projects/:key/webhooks/:id`

#### `backlog webhook create`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `--project` | `-p` | string | Yes* | プロジェクトキー | `:key` (URL) |
| `--name` | `-n` | string | Yes | Webhook 名 | `name` |
| `--hook-url` | | string | Yes | 通知先 URL | `hookUrl` |
| `--description` | `-d` | string | No | 説明 | `description` |
| `--all-event` | | boolean | No | 全イベント対象 | `allEvent` |
| `--activity-type-ids` | | number[] | No | 対象イベントタイプ | `activityTypeIds[]` |

- **対応 API**: `POST /api/v2/projects/:key/webhooks`

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

#### `backlog webhook delete <id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<id>` | number | Yes | Webhook ID |
| `--confirm` | boolean | No | 確認スキップ |

- **対応 API**: `DELETE /api/v2/projects/:key/webhooks/:webhookId`

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

#### `backlog star list [user-id]`

| 引数/オプション | 短縮 | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|------|----------------|
| `[user-id]` | | number | No | ユーザー ID（省略時は自分） | `:userId` (URL) |
| `--limit` | `-L` | number | No | 取得件数 | `count` |
| `--order` | | string | No | 並び順 | `order` |

- **対応 API**: `GET /api/v2/users/:userId/stars`

#### `backlog star count [user-id]`

| 引数/オプション | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|----------------|
| `[user-id]` | number | No | ユーザー ID | `:userId` (URL) |
| `--since` | string | No | 開始日 | `since` |
| `--until` | string | No | 終了日 | `until` |

- **対応 API**: `GET /api/v2/users/:userId/stars/count`

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

#### `backlog watching add`

| 引数/オプション | 型 | 必須 | 説明 | API パラメータ |
|------------------|------|------|------|----------------|
| `--issue` | string | Yes | 課題キー | `issueIdOrKey` |
| `--note` | string | No | メモ | `note` |

- **対応 API**: `POST /api/v2/watchings`

#### `backlog watching view <watching-id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<watching-id>` | number | Yes | ウォッチ ID |

- **対応 API**: `GET /api/v2/watchings/:watchingId`

#### `backlog watching delete <watching-id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<watching-id>` | number | Yes | ウォッチ ID |
| `--confirm` | boolean | No | 確認スキップ |

- **対応 API**: `DELETE /api/v2/watchings/:watchingId`

#### `backlog watching read <watching-id>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<watching-id>` | number | Yes | ウォッチ ID |

- **対応 API**: `POST /api/v2/watchings/:watchingId/markAsRead`

---

### 4.5 `backlog alias` — エイリアス

#### `backlog alias set <name> <expansion>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<name>` | string | Yes | エイリアス名 |
| `<expansion>` | string | Yes | 展開されるコマンド |
| `--shell` | boolean | No | シェルコマンドとして登録 |

- **対応 API**: ローカル設定

#### `backlog alias list`

- **対応 API**: ローカル設定

#### `backlog alias delete <name>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<name>` | string | Yes | エイリアス名 |

- **対応 API**: ローカル設定

---

### 4.6 `backlog auth` (追加) — 認証拡張

#### `backlog auth refresh`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `--hostname` | string | No | 対象スペース |

- **対応 API**: OAuth 2.0 Token Refresh

#### `backlog auth switch`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `--hostname` | string | No | 切り替え先スペース |

- **対応 API**: ローカル設定

---

### 4.7 `backlog completion` — シェル補完

#### `backlog completion <shell>`

| 引数/オプション | 型 | 必須 | 説明 |
|------------------|------|------|------|
| `<shell>` | string | Yes | シェル種別（`bash`/`zsh`/`fish`） |

- **対応 API**: ローカル処理
