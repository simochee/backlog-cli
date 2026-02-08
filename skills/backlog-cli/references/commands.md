# コマンドリファレンス

凡例: `<arg>` 位置引数、`-X, --flag` オプション（`-X` はエイリアス）、**(必須)** 省略不可、`(env: VAR)` 環境変数対応、日付は `yyyy-MM-dd`

## auth

```
backlog auth login [-h <host>] [-m api-key|oauth] [--with-token]
backlog auth logout [-h <host>]
backlog auth status [-h <host>] [--show-token]
backlog auth token [-h <host>]
backlog auth refresh [-h <host>]
backlog auth switch [-h <host>]
```

## config

```
backlog config get <key> [--hostname <host>]
backlog config set <key> <value> [--hostname <host>]
backlog config list [--hostname <host>]
```

## issue

### issue list

| フラグ | エイリアス | 説明 | デフォルト |
|--------|-----------|------|-----------|
| `--project` | `-p` | プロジェクトキー（カンマ区切り複数可）(env: BACKLOG_PROJECT) | |
| `--assignee` | `-a` | 担当者（ユーザー名 or `@me`） | |
| `--status` | `-S` | ステータス名（カンマ区切り複数可） | |
| `--type` | `-T` | 課題種別名（カンマ区切り複数可） | |
| `--priority` | `-P` | 優先度名 | |
| `--keyword` | `-k` | キーワード検索 | |
| `--created-since` | | 作成日の開始 | |
| `--created-until` | | 作成日の終了 | |
| `--updated-since` | | 更新日の開始 | |
| `--updated-until` | | 更新日の終了 | |
| `--due-since` | | 期限日の開始 | |
| `--due-until` | | 期限日の終了 | |
| `--sort` | | ソートキー | `updated` |
| `--order` | | `asc` or `desc` | `desc` |
| `--limit` | `-L` | 取得件数（1-100） | `20` |
| `--offset` | | ページネーション | |

### issue view

```
backlog issue view <issueKey> [--comments] [--web]
```

### issue create

| フラグ | エイリアス | 説明 |
|--------|-----------|------|
| `--project` | `-p` | **(必須)** プロジェクトキー (env: BACKLOG_PROJECT) |
| `--title` | `-t` | **(必須)** 課題タイトル |
| `--type` | `-T` | **(必須)** 課題種別名 |
| `--priority` | `-P` | **(必須)** 優先度名 |
| `--description` | `-d` | 説明（`-` でstdin） |
| `--assignee` | `-a` | 担当者 |
| `--start-date` | | 開始日 |
| `--due-date` | | 期限日 |
| `--web` | | 作成後ブラウザで開く |

### issue edit

```
backlog issue edit <issueKey> [-t <title>] [-d <desc>] [-S <status>] [-T <type>] [-P <priority>] [-a <assignee>] [-c <comment>]
```

### issue close / reopen / comment

```
backlog issue close <issueKey> [-c <comment>] [-r <resolution>]   # -r デフォルト: 完了
backlog issue reopen <issueKey> [-c <comment>]
backlog issue comment <issueKey> -b <body>                        # -b - でstdin
```

### issue status

```
backlog issue status
```

引数なし。自分に関連する課題のサマリ。

## pr

### pr list

| フラグ | エイリアス | 説明 | デフォルト |
|--------|-----------|------|-----------|
| `--repo` | `-R` | **(必須)** リポジトリ名 | |
| `--project` | `-p` | プロジェクトキー (env: BACKLOG_PROJECT) | |
| `--status` | `-S` | `open`, `closed`, `merged`（カンマ区切り） | `open` |
| `--assignee` | `-a` | 担当者 | |
| `--created-by` | | 作成者 | |
| `--issue` | | 関連課題キー | |
| `--limit` | `-L` | 取得件数 | `20` |
| `--offset` | | ページネーション | |

### pr create

| フラグ | エイリアス | 説明 |
|--------|-----------|------|
| `--repo` | `-R` | **(必須)** リポジトリ名 |
| `--project` | `-p` | **(必須)** プロジェクトキー (env: BACKLOG_PROJECT) |
| `--title` | `-t` | **(必須)** タイトル |
| `--base` | `-B` | **(必須)** ベースブランチ |
| `--branch` | | **(必須)** ソースブランチ |
| `--body` | `-b` | 説明 |
| `--assignee` | `-a` | 担当者 |
| `--issue` | | 関連課題キー |
| `--web` | | 作成後ブラウザで開く |

### pr view / edit / close / reopen / merge / comment / comments / status

```
backlog pr view <number> -R <repo> [-p <project>] [--comments] [--web]
backlog pr edit <number> -R <repo> [-p <project>] [-t <title>] [-b <body>] [-a <assignee>] [--issue <key>]
backlog pr close <number> -R <repo> [-p <project>] [-c <comment>]
backlog pr reopen <number> -R <repo> [-p <project>]
backlog pr merge <number> -R <repo> [-p <project>] [-c <comment>]
backlog pr comment <number> -R <repo> [-p <project>] -b <body>
backlog pr comments <number> -R <repo> [-p <project>] [-L <limit>]
backlog pr status -R <repo> [-p <project>]
```

## project

```
backlog project list [--archived] [--all] [-L <limit>]
backlog project view <projectKey> [--web]
backlog project create [-n <name>] [-k <key>] [--chart-enabled] [--subtasking-enabled] [--text-formatting-rule markdown|backlog]
backlog project edit <projectKey> [-n <name>] [-k <key>] [--chart-enabled] [--archived]
backlog project delete <projectKey> [--confirm]
backlog project users <projectKey>
backlog project add-user <projectKey> --user-id <id>
backlog project remove-user <projectKey> --user-id <id>
backlog project activities <projectKey> [-L <limit>] [--activity-type <ids>]
```

## repo

```
backlog repo list <projectKey>
backlog repo view <repoName> -p <project> [--web]
backlog repo clone <repoName> -p <project> [-d <directory>]
```

## notification

```
backlog notification list [-L <limit>] [--min-id <id>] [--max-id <id>] [--order asc|desc]
backlog notification count [--already-read] [--resource-already-read]
backlog notification read <id>
backlog notification read-all
```

## wiki

```
backlog wiki list [-p <project>] [-k <keyword>] [--sort <key>] [--order asc|desc] [-L <limit>]
backlog wiki view <wiki-id> [--web]
backlog wiki create -p <project> -n <name> -b <body> [--notify]
backlog wiki edit <wiki-id> [-n <name>] [-b <body>] [--notify]
backlog wiki delete <wiki-id> [--confirm]
backlog wiki count -p <project>
backlog wiki tags -p <project>
backlog wiki history <wiki-id> [-L <limit>] [--offset <n>]
backlog wiki attachments <wiki-id>
```

## user

```
backlog user list
backlog user view <user-id>
backlog user me
backlog user activities <user-id> [-L <limit>] [--activity-type <ids>]
```

## team

```
backlog team list [--order asc|desc] [-L <limit>] [--offset <n>]
backlog team view <team-id>
backlog team create [-n <name>] [--members <ids>]
backlog team edit <team-id> [-n <name>] [--members <ids>]
backlog team delete <team-id> [--confirm]
```

## プロジェクト設定

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
backlog milestone create -p <project> -n <name> [-d <desc>] [--start-date <date>] [--release-due-date <date>]
backlog milestone edit <id> -p <project> [-n <name>] [-d <desc>] [--start-date <date>] [--release-due-date <date>] [--archived]
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

## space

```
backlog space info
backlog space activities [-L <limit>] [--activity-type <ids>]
backlog space disk-usage
backlog space notification
```

## webhook

```
backlog webhook list -p <project>
backlog webhook view <id> -p <project>
backlog webhook create -p <project> -n <name> --hook-url <url> [-d <desc>] [--all-event] [--activity-type-ids <ids>]
backlog webhook edit <id> -p <project> [-n <name>] [--hook-url <url>] [-d <desc>] [--all-event] [--activity-type-ids <ids>]
backlog webhook delete <id> -p <project> [--confirm]
```

## star

```
backlog star add [--issue <key>] [--comment <id>] [--wiki <id>] [--pr-comment <id>]
backlog star list [<user-id>] [-L <limit>] [--order asc|desc]
backlog star count [<user-id>] [--since <date>] [--until <date>]
```

## watching

```
backlog watching list [<user-id>] [-L <limit>] [--order asc|desc] [--sort <key>]
backlog watching add --issue <key> [--note <text>]
backlog watching view <watching-id>
backlog watching delete <watching-id> [--confirm]
backlog watching read <watching-id>
```

## alias

```
backlog alias set <name> <expansion> [--shell]
backlog alias list
backlog alias delete <name>
```

## api

```
backlog api <endpoint> [-X <METHOD>] [-f <key=value>] [-H <header>] [-i] [--paginate] [--silent]
```

| フラグ | エイリアス | 説明 | デフォルト |
|--------|-----------|------|-----------|
| `<endpoint>` | | **(必須)** APIパス（`/api/v2` 省略可） | |
| `--method` | `-X` | HTTP メソッド | `GET` |
| `--field` | `-f` | `key=value`（GETはクエリ、他はボディ） | |
| `--header` | `-H` | 追加ヘッダー | |
| `--include` | `-i` | レスポンスヘッダー表示 | |
| `--paginate` | | 全件自動取得（GETのみ） | |
| `--silent` | | 出力抑制 | |

## browse

```
backlog browse [<target>] [-p <project>] [--issues] [--wiki] [--git] [--settings]
```

## status

```
backlog status
```

## completion

```
backlog completion <bash|zsh|fish>
```
