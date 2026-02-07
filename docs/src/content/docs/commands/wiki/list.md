---
title: backlog wiki list
description: Wiki ページの一覧を表示する
---

```
backlog wiki list [flags]
```

Wiki ページの一覧を取得します。

## オプション

| フラグ | 短縮 | 型 | デフォルト | 説明 |
|--------|------|------|------------|------|
| `--project` | `-p` | string | — | プロジェクトキー（env: `BACKLOG_PROJECT`） |
| `--keyword` | `-k` | string | — | キーワード検索 |
| `--sort` | | string | `updated` | ソートキー |
| `--order` | | string | `desc` | 並び順（`asc` / `desc`） |
| `--offset` | | number | `0` | オフセット |
| `--limit` | `-L` | number | `20` | 取得件数 |

## 使用例

```bash
backlog wiki list --project PROJ
backlog wiki list --project PROJ --keyword "設計"
```
