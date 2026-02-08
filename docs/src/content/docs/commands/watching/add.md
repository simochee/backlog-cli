---
title: backlog watching add
description: ウォッチを追加する
---

```
backlog watching add [flags]
```

## オプション

| フラグ    | 型     | 必須 | 説明     |
| --------- | ------ | ---- | -------- |
| `--issue` | string | Yes  | 課題キー |
| `--note`  | string | No   | メモ     |

## 使用例

```bash
backlog watching add --issue PROJECT-123
backlog watching add --issue PROJECT-123 --note "進捗を確認する"
```
