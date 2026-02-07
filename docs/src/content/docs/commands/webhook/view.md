---
title: backlog webhook view
description: Webhook の詳細を表示する
---

```
backlog webhook view <id> [flags]
```

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<id>` | number | Yes | Webhook ID |

## オプション

| フラグ | 短縮 | 型 | 説明 |
|--------|------|------|------|
| `--project` | `-p` | string | プロジェクトキー（env: `BACKLOG_PROJECT`） |

## 使用例

```bash
backlog webhook view 12345 --project PROJ
```
