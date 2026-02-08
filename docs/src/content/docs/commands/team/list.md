---
title: backlog team list
description: チームの一覧を表示する
---

```
backlog team list [flags]
```

## オプション

| フラグ     | 短縮 | 型     | デフォルト | 説明                     |
| ---------- | ---- | ------ | ---------- | ------------------------ |
| `--order`  |      | string | `desc`     | 並び順（`asc` / `desc`） |
| `--offset` |      | number | `0`        | オフセット               |
| `--limit`  | `-L` | number | `20`       | 取得件数                 |

## 使用例

```bash
backlog team list
backlog team list --limit 50
```
