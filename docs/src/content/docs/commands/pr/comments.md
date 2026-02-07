---
title: backlog pr comments
description: プルリクエストのコメント一覧を表示する
---

```
backlog pr comments <number> [flags]
```

プルリクエストのコメント一覧を表示します。

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<number>` | number | Yes | プルリクエスト番号 |

## オプション

| フラグ | 短縮 | 型 | デフォルト | 説明 |
|--------|------|------|------------|------|
| `--project` | `-p` | string | — | プロジェクトキー |
| `--repo` | `-R` | string | — | リポジトリ名 |
| `--limit` | `-L` | number | `20` | 取得件数 |

## 使用例

```bash
backlog pr comments 42 --project PROJ --repo my-repo
backlog pr comments 42 --project PROJ --repo my-repo --limit 50
```
