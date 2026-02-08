# Command Reference

Legend: `<arg>` positional argument, `-X, --flag` option (`-X` is alias), **(required)** must be specified, `(env: VAR)` supports env var fallback, dates use `yyyy-MM-dd`

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

| Flag | Alias | Description | Default |
|------|-------|-------------|---------|
| `--project` | `-p` | Project key (comma-separated for multiple) (env: BACKLOG_PROJECT) | |
| `--assignee` | `-a` | Assignee (username or `@me`) | |
| `--status` | `-S` | Status name (comma-separated for multiple) | |
| `--type` | `-T` | Issue type name (comma-separated for multiple) | |
| `--priority` | `-P` | Priority name | |
| `--keyword` | `-k` | Keyword search | |
| `--created-since` | | Created after date | |
| `--created-until` | | Created before date | |
| `--updated-since` | | Updated after date | |
| `--updated-until` | | Updated before date | |
| `--due-since` | | Due after date | |
| `--due-until` | | Due before date | |
| `--sort` | | Sort key | `updated` |
| `--order` | | `asc` or `desc` | `desc` |
| `--limit` | `-L` | Number of results (1-100) | `20` |
| `--offset` | | Pagination offset | |

### issue view

```
backlog issue view <issueKey> [--comments] [--web]
```

### issue create

| Flag | Alias | Description |
|------|-------|-------------|
| `--project` | `-p` | **(required)** Project key (env: BACKLOG_PROJECT) |
| `--title` | `-t` | **(required)** Issue title |
| `--type` | `-T` | **(required)** Issue type name |
| `--priority` | `-P` | **(required)** Priority name |
| `--description` | `-d` | Description (`-` for stdin) |
| `--assignee` | `-a` | Assignee username |
| `--start-date` | | Start date |
| `--due-date` | | Due date |
| `--web` | | Open in browser after creation |

### issue edit

```
backlog issue edit <issueKey> [-t <title>] [-d <desc>] [-S <status>] [-T <type>] [-P <priority>] [-a <assignee>] [-c <comment>]
```

### issue close / reopen / comment

```
backlog issue close <issueKey> [-c <comment>] [-r <resolution>]   # -r default: 完了
backlog issue reopen <issueKey> [-c <comment>]
backlog issue comment <issueKey> -b <body>                        # -b - for stdin
```

### issue status

```
backlog issue status
```

No arguments. Shows summary of issues related to you.

## pr

### pr list

| Flag | Alias | Description | Default |
|------|-------|-------------|---------|
| `--repo` | `-R` | **(required)** Repository name | |
| `--project` | `-p` | Project key (env: BACKLOG_PROJECT) | |
| `--status` | `-S` | `open`, `closed`, `merged` (comma-separated) | `open` |
| `--assignee` | `-a` | Assignee | |
| `--created-by` | | Creator | |
| `--issue` | | Related issue key | |
| `--limit` | `-L` | Number of results | `20` |
| `--offset` | | Pagination offset | |

### pr create

| Flag | Alias | Description |
|------|-------|-------------|
| `--repo` | `-R` | **(required)** Repository name |
| `--project` | `-p` | **(required)** Project key (env: BACKLOG_PROJECT) |
| `--title` | `-t` | **(required)** Title |
| `--base` | `-B` | **(required)** Base branch (merge target) |
| `--branch` | | **(required)** Source branch |
| `--body` | `-b` | Description |
| `--assignee` | `-a` | Assignee |
| `--issue` | | Related issue key |
| `--web` | | Open in browser after creation |

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

## Project Settings

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

| Flag | Alias | Description | Default |
|------|-------|-------------|---------|
| `<endpoint>` | | **(required)** API path (`/api/v2` prefix optional) | |
| `--method` | `-X` | HTTP method | `GET` |
| `--field` | `-f` | `key=value` (query param for GET, body for others) | |
| `--header` | `-H` | Additional header | |
| `--include` | `-i` | Show response headers | |
| `--paginate` | | Auto-paginate all results (GET only) | |
| `--silent` | | Suppress output | |

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
