---
title: backlog category create
description: カテゴリを作成する
---

```
backlog category create [flags]
```

## オプション

| フラグ | 短縮 | 型 | 必須 | 説明 |
|--------|------|------|------|------|
| `--project` | `-p` | string | Yes | プロジェクトキー |
| `--name` | `-n` | string | Yes | カテゴリ名 |

## 使用例

```bash
backlog category create --project PROJ --name "フロントエンド"
```
