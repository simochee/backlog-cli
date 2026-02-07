---
title: backlog project create
description: プロジェクトを作成する
---

```
backlog project create [flags]
```

新しいプロジェクトを作成します。

## オプション

| フラグ | 短縮 | 型 | 必須 | 説明 |
|--------|------|------|------|------|
| `--name` | `-n` | string | Yes | プロジェクト名 |
| `--key` | `-k` | string | Yes | プロジェクトキー（英大文字） |
| `--chart-enabled` | | boolean | No | チャート有効 |
| `--subtasking-enabled` | | boolean | No | サブタスク有効 |
| `--project-leader-can-edit-project-leader` | | boolean | No | PL 変更権限 |
| `--text-formatting-rule` | | string | No | 書式ルール（`markdown` / `backlog`） |

## 使用例

```bash
backlog project create --name "新プロジェクト" --key NEWPROJ
backlog project create --name "開発プロジェクト" --key DEV --text-formatting-rule markdown
```
