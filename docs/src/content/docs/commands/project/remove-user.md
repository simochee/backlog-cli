---
title: backlog project remove-user
description: プロジェクトからメンバーを削除する
---

```
backlog project remove-user <project-key> [flags]
```

プロジェクトからメンバーを削除します。

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<project-key>` | string | Yes | プロジェクトキー |

## オプション

| フラグ | 型 | 必須 | 説明 |
|--------|------|------|------|
| `--user-id` | number | Yes | ユーザー ID |

## 使用例

```bash
backlog project remove-user PROJ --user-id 12345
```
