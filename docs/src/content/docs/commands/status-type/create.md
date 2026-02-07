---
title: backlog status-type create
description: ステータスを作成する
---

```
backlog status-type create [flags]
```

## オプション

| フラグ | 短縮 | 型 | 必須 | 説明 |
|--------|------|------|------|------|
| `--project` | `-p` | string | Yes | プロジェクトキー |
| `--name` | `-n` | string | Yes | ステータス名 |
| `--color` | | string | Yes | 表示色（`#hex` 形式） |

## 使用例

```bash
backlog status-type create --project PROJ --name "レビュー中" --color "#0000ff"
```
