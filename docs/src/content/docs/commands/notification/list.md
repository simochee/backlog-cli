---
title: backlog notification list
description: 通知の一覧を表示する
---

```
backlog notification list [flags]
```

通知の一覧を表示します。

## オプション

| フラグ | 短縮 | 型 | デフォルト | 説明 |
|--------|------|------|------------|------|
| `--limit` | `-L` | number | `20` | 取得件数 |
| `--min-id` | | number | — | 最小通知 ID |
| `--max-id` | | number | — | 最大通知 ID |
| `--order` | | string | `desc` | 並び順（`asc` / `desc`） |

## 使用例

```bash
backlog notification list
backlog notification list --limit 50
```
