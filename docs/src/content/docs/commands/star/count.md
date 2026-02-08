---
title: backlog star count
description: スター数を表示する
---

```
backlog star count [user-id] [flags]
```

## 引数

| 引数        | 型     | 必須 | 説明                        |
| ----------- | ------ | ---- | --------------------------- |
| `[user-id]` | number | No   | ユーザー ID（省略時は自分） |

## オプション

| フラグ    | 型     | 説明                   |
| --------- | ------ | ---------------------- |
| `--since` | string | 開始日（`yyyy-MM-dd`） |
| `--until` | string | 終了日（`yyyy-MM-dd`） |

## 使用例

```bash
backlog star count
backlog star count --since 2025-01-01 --until 2025-12-31
```
