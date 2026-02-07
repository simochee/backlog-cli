---
title: backlog user activities
description: ユーザーのアクティビティを表示する
---

```
backlog user activities <user-id> [flags]
```

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<user-id>` | number | Yes | ユーザー ID |

## オプション

| フラグ | 短縮 | 型 | デフォルト | 説明 |
|--------|------|------|------------|------|
| `--limit` | `-L` | number | `20` | 取得件数 |
| `--activity-type` | | string | — | アクティビティタイプ ID（カンマ区切り） |

## 使用例

```bash
backlog user activities 12345
backlog user activities 12345 --limit 50
```
