---
title: backlog category delete
description: カテゴリを削除する
---

```
backlog category delete <id> [flags]
```

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<id>` | number | Yes | カテゴリ ID |

## オプション

| フラグ | 短縮 | 型 | 説明 |
|--------|------|------|------|
| `--project` | `-p` | string | プロジェクトキー |
| `--confirm` | | boolean | 確認プロンプトをスキップ |

## 使用例

```bash
backlog category delete 12345 --project PROJ
backlog category delete 12345 --project PROJ --confirm
```
