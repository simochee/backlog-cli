---
title: backlog webhook edit
description: Webhook を編集する
---

```
backlog webhook edit <id> [flags]
```

## 引数

| 引数   | 型     | 必須 | 説明       |
| ------ | ------ | ---- | ---------- |
| `<id>` | number | Yes  | Webhook ID |

## オプション

| フラグ                | 短縮 | 型      | 説明                                       |
| --------------------- | ---- | ------- | ------------------------------------------ |
| `--project`           | `-p` | string  | プロジェクトキー（env: `BACKLOG_PROJECT`） |
| `--name`              | `-n` | string  | Webhook 名                                 |
| `--hook-url`          |      | string  | 通知先 URL                                 |
| `--description`       | `-d` | string  | 説明                                       |
| `--all-event`         |      | boolean | 全イベント対象                             |
| `--activity-type-ids` |      | string  | イベントタイプ ID（カンマ区切り）          |

## 使用例

```bash
backlog webhook edit 12345 --project PROJ --name "新しい名前"
```
