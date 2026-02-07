---
title: backlog pr list
description: プルリクエストの一覧を表示する
---

```
backlog pr list [flags]
```

プルリクエストの一覧を取得します。

## オプション

| フラグ         | 短縮 | 型     | デフォルト | 説明                                                     |
| -------------- | ---- | ------ | ---------- | -------------------------------------------------------- |
| `--project`    | `-p` | string | —          | プロジェクトキー（env: `BACKLOG_PROJECT`）               |
| `--repo`       | `-R` | string | —          | リポジトリ名                                             |
| `--status`     | `-S` | string | `open`     | ステータス（`open` / `closed` / `merged`、カンマ区切り） |
| `--assignee`   | `-a` | string | —          | 担当者（ユーザー名 or `@me`）                            |
| `--created-by` |      | string | —          | 作成者                                                   |
| `--issue`      |      | string | —          | 関連課題キー                                             |
| `--limit`      | `-L` | number | `20`       | 取得件数（1-100）                                        |
| `--offset`     |      | number | `0`        | オフセット                                               |

## 使用例

```bash
backlog pr list --project PROJ --repo my-repo
backlog pr list --project PROJ --repo my-repo --status closed
backlog pr list --project PROJ --repo my-repo --assignee @me
```
