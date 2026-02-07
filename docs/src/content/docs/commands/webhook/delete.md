---
title: backlog webhook delete
description: Webhook を削除する
---

```
backlog webhook delete <id> [flags]
```

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<id>` | number | Yes | Webhook ID |

## オプション

| フラグ | 短縮 | 型 | 説明 |
|--------|------|------|------|
| `--project` | `-p` | string | プロジェクトキー（env: `BACKLOG_PROJECT`） |
| `--confirm` | | boolean | 確認プロンプトをスキップ |

## 使用例

```bash
backlog webhook delete 12345 --project PROJ
backlog webhook delete 12345 --project PROJ --confirm
```
