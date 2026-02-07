---
title: backlog team edit
description: チームを編集する
---

```
backlog team edit <team-id> [flags]
```

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<team-id>` | number | Yes | チーム ID |

## オプション

| フラグ | 短縮 | 型 | 説明 |
|--------|------|------|------|
| `--name` | `-n` | string | チーム名 |
| `--members` | | string | メンバー ID（カンマ区切り） |

## 使用例

```bash
backlog team edit 12345 --name "新チーム名"
```
