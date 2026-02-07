---
title: backlog watching list
description: ウォッチの一覧を表示する
---

```
backlog watching list [user-id] [flags]
```

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `[user-id]` | number | No | ユーザー ID（省略時は自分） |

## オプション

| フラグ | 短縮 | 型 | デフォルト | 説明 |
|--------|------|------|------------|------|
| `--limit` | `-L` | number | `20` | 取得件数 |
| `--order` | | string | `desc` | 並び順（`asc` / `desc`） |
| `--sort` | | string | — | ソートキー |

## 使用例

```bash
backlog watching list
backlog watching list --limit 50
```
