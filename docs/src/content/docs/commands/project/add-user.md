---
title: backlog project add-user
description: プロジェクトにメンバーを追加する
---

```
backlog project add-user <project-key> [flags]
```

プロジェクトにメンバーを追加します。

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
backlog project add-user PROJ --user-id 12345
```
