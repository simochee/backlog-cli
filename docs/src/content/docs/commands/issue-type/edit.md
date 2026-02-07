---
title: backlog issue-type edit
description: 課題種別を編集する
---

```
backlog issue-type edit <id> [flags]
```

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<id>` | number | Yes | 種別 ID |

## オプション

| フラグ | 短縮 | 型 | 説明 |
|--------|------|------|------|
| `--project` | `-p` | string | プロジェクトキー |
| `--name` | `-n` | string | 種別名 |
| `--color` | | string | 表示色（`#hex` 形式） |

## 使用例

```bash
backlog issue-type edit 12345 --project PROJ --name "バグ修正"
backlog issue-type edit 12345 --project PROJ --color "#00ff00"
```
