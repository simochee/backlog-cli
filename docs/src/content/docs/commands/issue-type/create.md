---
title: backlog issue-type create
description: 課題種別を作成する
---

```
backlog issue-type create [flags]
```

## オプション

| フラグ | 短縮 | 型 | 必須 | 説明 |
|--------|------|------|------|------|
| `--project` | `-p` | string | Yes | プロジェクトキー（env: `BACKLOG_PROJECT`） |
| `--name` | `-n` | string | Yes | 種別名 |
| `--color` | | string | Yes | 表示色（`#hex` 形式） |

## 使用例

```bash
backlog issue-type create --project PROJ --name "機能追加" --color "#ff0000"
```
