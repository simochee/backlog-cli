# backlog-cli コマンドリファレンス

## 凡例

- `<arg>` — 位置引数（positional）。必須の場合 **(必須)** と表記
- `-X, --flag` — オプションフラグ。`-X` はエイリアス
- `(env: VAR)` — 環境変数でもデフォルト値を指定可能
- 日付形式はすべて `yyyy-MM-dd`

---

## auth — 認証管理

### auth login

```
backlog auth login [-h <hostname>] [-m api-key|oauth] [--with-token]
```

| フラグ | エイリアス | 説明 |
|--------|-----------|------|
| `--hostname` | `-h` | スペースホスト名（例: xxx.backlog.com） |
| `--method` | `-m` | 認証方式: `api-key`（デフォルト）または `oauth` |
| `--with-token` | | stdinからトークンを読み取る |

### auth logout

```
backlog auth logout [-h <hostname>]
```

### auth status

```
backlog auth status [-h <hostname>] [--show-token]
```

### auth token

```
backlog auth token [-h <hostname>]
```

現在のスペースの認証トークンを標準出力に表示する。

### auth refresh

```
backlog auth refresh [-h <hostname>]
```

### auth switch

```
backlog auth switch [-h <hostname>]
```

---

## config — 設定管理

### config get / set / list

```
backlog config get <key> [--hostname <host>]
backlog config set <key> <value> [--hostname <host>]
backlog config list [--hostname <host>]
```

---

## issue — 課題管理

### issue list

```
backlog issue list [options]
```

| フラグ | エイリアス | 説明 | デフォルト |
|--------|-----------|------|-----------|
| `--project` | `-p` | プロジェクトキー（カンマ区切りで複数指定可）(env: BACKLOG_PROJECT) | |
| `--assignee` | `-a` | 担当者（ユーザー名 or `@me`） | |
| `--status` | `-S` | ステータス名（カンマ区切りで複数指定可） | |
| `--type` | `-T` | 課題種別名（カンマ区切りで複数指定可） | |
| `--priority` | `-P` | 優先度名 | |
| `--keyword` | `-k` | キーワード検索 | |
| `--created-since` | | 作成日の開始 | |
| `--created-until` | | 作成日の終了 | |
| `--updated-since` | | 更新日の開始 | |
| `--updated-until` | | 更新日の終了 | |
| `--due-since` | | 期限日の開始 | |
| `--due-until` | | 期限日の終了 | |
| `--sort` | | ソートキー | `updated` |
| `--order` | | ソート順: `asc` or `desc` | `desc` |
| `--limit` | `-L` | 取得件数（1-100） | `20` |
| `--offset` | | ページネーションオフセット | |

### issue view

```
backlog issue view <issueKey> [--comments] [--web]
```

| 引数/フラグ | 説明 |
|------------|------|
| `<issueKey>` | **(必須)** 課題キー（例: `PROJ-123`） |
| `--comments` | コメントを含めて表示 |
| `--web` | ブラウザで開く |

### issue create

```
backlog issue create -p <project> -t <title> -T <type> -P <priority> [options]
```

| フラグ | エイリアス | 説明 |
|--------|-----------|------|
| `--project` | `-p` | **(必須)** プロジェクトキー (env: BACKLOG_PROJECT) |
| `--title` | `-t` | **(必須)** 課題タイトル |
| `--type` | `-T` | **(必須)** 課題種別名 |
| `--priority` | `-P` | **(必須)** 優先度名 |
| `--description` | `-d` | 課題の説明（`-` でstdin） |
| `--assignee` | `-a` | 担当者ユーザー名 |
| `--start-date` | | 開始日 |
| `--due-date` | | 期限日 |
| `--web` | | 作成後ブラウザで開く |

### issue edit

```
backlog issue edit <issueKey> [options]
```

| フラグ | エイリアス | 説明 |
|--------|-----------|------|
| `--title` | `-t` | 課題タイトル |
| `--description` | `-d` | 課題の説明 |
| `--status` | `-S` | ステータス名 |
| `--type` | `-T` | 課題種別名 |
| `--priority` | `-P` | 優先度名 |
| `--assignee` | `-a` | 担当者ユーザー名 |
| `--comment` | `-c` | 更新コメント |

### issue close

```
backlog issue close <issueKey> [-c <comment>] [-r <resolution>]
```

`-r` のデフォルトは `完了`。

### issue reopen

```
backlog issue reopen <issueKey> [-c <comment>]
```

### issue comment

```
backlog issue comment <issueKey> -b <body>
```

`-b -` でstdinから読み取り。

### issue status

```
backlog issue status
```

自分に関連する課題のステータスサマリを表示。引数なし。

---

## pr — プルリクエスト管理

### pr list

```
backlog pr list -R <repo> [-p <project>] [options]
```

| フラグ | エイリアス | 説明 | デフォルト |
|--------|-----------|------|-----------|
| `--repo` | `-R` | **(必須)** リポジトリ名 | |
| `--project` | `-p` | プロジェクトキー (env: BACKLOG_PROJECT) | |
| `--status` | `-S` | ステータス: `open`, `closed`, `merged`（カンマ区切り） | `open` |
| `--assignee` | `-a` | 担当者（ユーザー名 or `@me`） | |
| `--created-by` | | 作成者（ユーザー名 or `@me`） | |
| `--issue` | | 関連課題キー | |
| `--limit` | `-L` | 取得件数 | `20` |
| `--offset` | | ページネーションオフセット | |

### pr view

```
backlog pr view <number> -R <repo> [-p <project>] [--comments] [--web]
```

### pr create

```
backlog pr create -R <repo> -t <title> -B <base> --branch <branch> [-p <project>] [options]
```

| フラグ | エイリアス | 説明 |
|--------|-----------|------|
| `--repo` | `-R` | **(必須)** リポジトリ名 |
| `--project` | `-p` | **(必須)** プロジェクトキー (env: BACKLOG_PROJECT) |
| `--title` | `-t` | **(必須)** PRタイトル |
| `--base` | `-B` | **(必須)** ベースブランチ（マージ先） |
| `--branch` | | **(必須)** ソースブランチ |
| `--body` | `-b` | PRの説明 |
| `--assignee` | `-a` | 担当者（ユーザー名 or `@me`） |
| `--issue` | | 関連課題キー |
| `--web` | | 作成後ブラウザで開く |

### pr edit

```
backlog pr edit <number> -R <repo> [-p <project>] [options]
```

フラグ: `--title`, `--body`, `--assignee`, `--issue`

### pr close / reopen

```
backlog pr close <number> -R <repo> [-p <project>] [-c <comment>]
backlog pr reopen <number> -R <repo> [-p <project>]
```

### pr merge

```
backlog pr merge <number> -R <repo> [-p <project>] [-c <comment>]
```

### pr comment

```
backlog pr comment <number> -R <repo> [-p <project>] -b <body>
```

### pr comments

```
backlog pr comments <number> -R <repo> [-p <project>] [-L <limit>]
```

### pr status

```
backlog pr status -R <repo> [-p <project>]
```

---

## project — プロジェクト管理

### project list

```
backlog project list [--archived] [--all] [-L <limit>]
```

### project view

```
backlog project view <projectKey> [--web]
```

### project create

```
backlog project create [-n <name>] [-k <key>] [options]
```

フラグ: `--name`, `--key`, `--chart-enabled`, `--subtasking-enabled`, `--text-formatting-rule markdown|backlog`

### project edit

```
backlog project edit <projectKey> [options]
```

フラグ: `--name`, `--key`, `--chart-enabled`, `--archived`

### project delete

```
backlog project delete <projectKey> [--confirm]
```

### project users

```
backlog project users <projectKey>
```

### project add-user / remove-user

```
backlog project add-user <projectKey> --user-id <id>
backlog project remove-user <projectKey> --user-id <id>
```

### project activities

```
backlog project activities <projectKey> [-L <limit>] [--activity-type <ids>]
```

---

## repo — リポジトリ管理

```
backlog repo list <projectKey>
backlog repo view <repoName> -p <project> [--web]
backlog repo clone <repoName> -p <project> [-d <directory>]
```

---

## notification — 通知管理

```
backlog notification list [-L <limit>] [--min-id <id>] [--max-id <id>] [--order asc|desc]
backlog notification count [--already-read] [--resource-already-read]
backlog notification read <id>
backlog notification read-all
```

---

## wiki — Wiki管理

### wiki list

```
backlog wiki list [-p <project>] [-k <keyword>] [--sort <key>] [--order asc|desc] [-L <limit>]
```

### wiki view / create / edit / delete

```
backlog wiki view <wiki-id> [--web]
backlog wiki create -p <project> -n <name> -b <body> [--notify]
backlog wiki edit <wiki-id> [-n <name>] [-b <body>] [--notify]
backlog wiki delete <wiki-id> [--confirm]
```

### wiki count / tags / history / attachments

```
backlog wiki count -p <project>
backlog wiki tags -p <project>
backlog wiki history <wiki-id> [-L <limit>] [--offset <n>]
backlog wiki attachments <wiki-id>
```

---

## user — ユーザー管理

```
backlog user list
backlog user view <user-id>
backlog user me
backlog user activities <user-id> [-L <limit>] [--activity-type <ids>]
```

---

## team — チーム管理

```
backlog team list [--order asc|desc] [-L <limit>] [--offset <n>]
backlog team view <team-id>
backlog team create [-n <name>] [--members <ids>]
backlog team edit <team-id> [-n <name>] [--members <ids>]
backlog team delete <team-id> [--confirm]
```

---

## プロジェクト設定コマンド

### category

```
backlog category list -p <project>
backlog category create -p <project> -n <name>
backlog category edit <id> -p <project> -n <name>
backlog category delete <id> -p <project> [--confirm]
```

### milestone

```
backlog milestone list -p <project>
backlog milestone create -p <project> -n <name> [-d <description>] [--start-date <date>] [--release-due-date <date>]
backlog milestone edit <id> -p <project> [-n <name>] [-d <description>] [--start-date <date>] [--release-due-date <date>] [--archived]
backlog milestone delete <id> -p <project> [--confirm]
```

### issue-type

```
backlog issue-type list -p <project>
backlog issue-type create -p <project> -n <name> [--color <#hex>]
backlog issue-type edit <id> -p <project> [-n <name>] [--color <#hex>]
backlog issue-type delete <id> -p <project> --substitute-issue-type-id <id> [--confirm]
```

### status-type

```
backlog status-type list -p <project>
backlog status-type create -p <project> -n <name> [--color <#hex>]
backlog status-type edit <id> -p <project> [-n <name>] [--color <#hex>]
backlog status-type delete <id> -p <project> --substitute-status-id <id> [--confirm]
```

---

## space — スペース管理

```
backlog space info
backlog space activities [-L <limit>] [--activity-type <ids>]
backlog space disk-usage
backlog space notification
```

---

## webhook — Webhook管理

```
backlog webhook list -p <project>
backlog webhook view <id> -p <project>
backlog webhook create -p <project> -n <name> --hook-url <url> [-d <description>] [--all-event] [--activity-type-ids <ids>]
backlog webhook edit <id> -p <project> [-n <name>] [--hook-url <url>] [-d <description>] [--all-event] [--activity-type-ids <ids>]
backlog webhook delete <id> -p <project> [--confirm]
```

---

## star — スター管理

```
backlog star add [--issue <key>] [--comment <id>] [--wiki <id>] [--pr-comment <id>]
backlog star list [<user-id>] [-L <limit>] [--order asc|desc]
backlog star count [<user-id>] [--since <date>] [--until <date>]
```

---

## watching — ウォッチ管理

```
backlog watching list [<user-id>] [-L <limit>] [--order asc|desc] [--sort <key>]
backlog watching add --issue <key> [--note <text>]
backlog watching view <watching-id>
backlog watching delete <watching-id> [--confirm]
backlog watching read <watching-id>
```

---

## alias — エイリアス管理

```
backlog alias set <name> <expansion> [--shell]
backlog alias list
backlog alias delete <name>
```

---

## その他のコマンド

### api — 汎用APIリクエスト

```
backlog api <endpoint> [-X <METHOD>] [-f <key=value>] [-H <header>] [-i] [--paginate] [--silent]
```

| フラグ | エイリアス | 説明 | デフォルト |
|--------|-----------|------|-----------|
| `<endpoint>` | | **(必須)** APIパス（例: `/issues`）。`/api/v2`プレフィックスは省略可 | |
| `--method` | `-X` | HTTPメソッド | `GET` |
| `--field` | `-f` | リクエストフィールド（`key=value`）。GETではクエリパラメータ、それ以外ではボディ | |
| `--header` | `-H` | 追加ヘッダー | |
| `--include` | `-i` | レスポンスヘッダーを含める | |
| `--paginate` | | 全件自動取得（GETのみ） | |
| `--silent` | | 出力を抑制 | |

### browse — ブラウザで開く

```
backlog browse [<target>] [-p <project>] [--issues] [--wiki] [--git] [--settings]
```

### status — ダッシュボード

```
backlog status
```

### completion — シェル補完

```
backlog completion <bash|zsh|fish>
```

---

## データモデル（スキーマ型参照）

CLI の `--json` 出力や `backlog api` コマンドのレスポンスで返されるデータ構造。

### Issue（課題）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | 課題ID |
| `projectId` | number | プロジェクトID |
| `issueKey` | string | 課題キー（例: `PROJ-123`） |
| `keyId` | number | 課題番号 |
| `issueType` | IssueType | 課題種別 |
| `summary` | string | タイトル |
| `description` | string | 説明 |
| `priority` | Priority | 優先度 |
| `status` | Status | ステータス |
| `assignee` | User \| null | 担当者 |
| `category` | {id, name}[] | カテゴリ |
| `versions` | {id, name}[] | 発生バージョン |
| `milestone` | {id, name}[] | マイルストーン |
| `startDate` | string \| null | 開始日 |
| `dueDate` | string \| null | 期限日 |
| `estimatedHours` | number \| null | 予定時間 |
| `actualHours` | number \| null | 実績時間 |
| `parentIssueId` | number \| null | 親課題ID |
| `createdUser` | User | 作成者 |
| `created` | string | 作成日時 |
| `updatedUser` | User | 更新者 |
| `updated` | string | 更新日時 |

### PullRequest（プルリクエスト）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | PR ID |
| `projectId` | number | プロジェクトID |
| `repositoryId` | number | リポジトリID |
| `number` | number | PR番号 |
| `summary` | string | タイトル |
| `description` | string | 説明 |
| `base` | string | ベースブランチ |
| `branch` | string | ソースブランチ |
| `status` | {id, name} | ステータス（1: Open, 2: Closed, 3: Merged） |
| `assignee` | User \| null | 担当者 |
| `issue` | Issue \| null | 関連課題 |
| `baseCommit` | string \| null | ベースコミットSHA |
| `branchCommit` | string \| null | ブランチコミットSHA |
| `mergeCommit` | string \| null | マージコミットSHA |
| `closeAt` | string \| null | クローズ日時 |
| `mergeAt` | string \| null | マージ日時 |
| `createdUser` | User | 作成者 |
| `created` | string | 作成日時 |
| `updatedUser` | User | 更新者 |
| `updated` | string | 更新日時 |

### Project（プロジェクト）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | プロジェクトID |
| `projectKey` | string | プロジェクトキー |
| `name` | string | プロジェクト名 |
| `chartEnabled` | boolean | チャート有効 |
| `subtaskingEnabled` | boolean | サブタスク有効 |
| `textFormattingRule` | "backlog" \| "markdown" | テキスト書式 |
| `archived` | boolean | アーカイブ済み |

### User（ユーザー）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | ユーザーID |
| `userId` | string | ユーザーログインID |
| `name` | string | 表示名 |
| `roleType` | number | 権限（1: Admin, 2: 一般, 3: レポーター, 4: ビューアー, 5: ゲストレポーター, 6: ゲストビューアー） |
| `lang` | string \| null | 言語 |
| `mailAddress` | string | メールアドレス |
| `lastLoginTime` | string \| null | 最終ログイン日時 |

### Comment（コメント）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | コメントID |
| `content` | string | 本文 |
| `changeLog` | ChangeLog[] | 変更履歴 |
| `createdUser` | User | 作成者 |
| `created` | string | 作成日時 |
| `updated` | string | 更新日時 |
| `stars` | Star[] | スター |
| `notifications` | Notification[] | 通知 |

### Status（ステータス）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | ステータスID |
| `projectId` | number | プロジェクトID |
| `name` | string | ステータス名 |
| `color` | string | 表示色 |
| `displayOrder` | number | 表示順 |

### IssueType（課題種別）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | 種別ID |
| `projectId` | number | プロジェクトID |
| `name` | string | 種別名 |
| `color` | string | 表示色 |
| `displayOrder` | number | 表示順 |

### Priority（優先度）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | 優先度ID |
| `name` | string | 優先度名 |

Backlogの標準優先度: `高`, `中`, `低`

### Wiki（Wikiページ）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | WikiページID |
| `projectId` | number | プロジェクトID |
| `name` | string | ページ名 |
| `content` | string | 本文 |
| `tags` | {id, name}[] | タグ |
| `attachments` | Attachment[] | 添付ファイル |
| `createdUser` | User | 作成者 |
| `created` | string | 作成日時 |
| `updatedUser` | User | 更新者 |
| `updated` | string | 更新日時 |

### Milestone（マイルストーン）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | マイルストーンID |
| `projectId` | number | プロジェクトID |
| `name` | string | マイルストーン名 |
| `description` | string | 説明 |
| `startDate` | string \| null | 開始日 |
| `releaseDueDate` | string \| null | リリース期限日 |
| `archived` | boolean | アーカイブ済み |

### Notification（通知）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | 通知ID |
| `alreadyRead` | boolean | 既読 |
| `reason` | number | 通知理由 |
| `resourceAlreadyRead` | boolean | リソース既読 |
| `project` | Project | プロジェクト |
| `issue` | Issue? | 関連課題 |
| `comment` | Comment? | 関連コメント |
| `pullRequest` | PullRequest? | 関連PR |
| `sender` | User | 送信者 |
| `created` | string | 作成日時 |

### Repository（Gitリポジトリ）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | リポジトリID |
| `projectId` | number | プロジェクトID |
| `name` | string | リポジトリ名 |
| `description` | string \| null | 説明 |
| `httpUrl` | string | HTTP URL |
| `sshUrl` | string | SSH URL |
| `pushedAt` | string \| null | 最終プッシュ日時 |
