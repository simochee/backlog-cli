---
title: backlog webhook create
description: Webhook を作成する
---

```
backlog webhook create [flags]
```

## オプション

| フラグ                | 短縮 | 型      | 必須 | 説明                                       |
| --------------------- | ---- | ------- | ---- | ------------------------------------------ |
| `--project`           | `-p` | string  | Yes  | プロジェクトキー（env: `BACKLOG_PROJECT`） |
| `--name`              | `-n` | string  | Yes  | Webhook 名                                 |
| `--hook-url`          |      | string  | Yes  | 通知先 URL                                 |
| `--description`       | `-d` | string  | No   | 説明                                       |
| `--all-event`         |      | boolean | No   | 全イベント対象                             |
| `--activity-type-ids` |      | string  | No   | 対象イベントタイプ ID（カンマ区切り）      |

## 使用例

```bash
backlog webhook create --project PROJ \
  --name "Slack通知" \
  --hook-url "https://hooks.slack.com/services/xxx" \
  --all-event
```
