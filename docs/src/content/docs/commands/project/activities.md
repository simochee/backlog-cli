---
title: backlog project activities
description: プロジェクトの最近の更新を表示する
---

```
backlog project activities <project-key> [flags]
```

プロジェクトの最近のアクティビティを表示します。

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<project-key>` | string | Yes | プロジェクトキー |

## オプション

| フラグ | 短縮 | 型 | デフォルト | 説明 |
|--------|------|------|------------|------|
| `--limit` | `-L` | number | `20` | 取得件数 |
| `--activity-type` | | string | — | アクティビティタイプ ID（カンマ区切り） |

## 使用例

```bash
backlog project activities PROJ
backlog project activities PROJ --limit 50
```
