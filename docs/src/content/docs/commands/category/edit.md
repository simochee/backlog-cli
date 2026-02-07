---
title: backlog category edit
description: カテゴリを編集する
---

```
backlog category edit <id> [flags]
```

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<id>` | number | Yes | カテゴリ ID |

## オプション

| フラグ | 短縮 | 型 | 必須 | 説明 |
|--------|------|------|------|------|
| `--project` | `-p` | string | Yes | プロジェクトキー |
| `--name` | `-n` | string | Yes | カテゴリ名 |

## 使用例

```bash
backlog category edit 12345 --project PROJ --name "バックエンド"
```
