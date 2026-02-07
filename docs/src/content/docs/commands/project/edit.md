---
title: backlog project edit
description: プロジェクトを編集する
---

```
backlog project edit <project-key> [flags]
```

プロジェクトの設定を編集します。

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<project-key>` | string | Yes | プロジェクトキー |

## オプション

| フラグ | 短縮 | 型 | 説明 |
|--------|------|------|------|
| `--name` | `-n` | string | プロジェクト名 |
| `--key` | `-k` | string | 新しいプロジェクトキー |
| `--chart-enabled` | | boolean | チャート有効 |
| `--archived` | | boolean | アーカイブ |

## 使用例

```bash
backlog project edit PROJ --name "リネーム後"
backlog project edit PROJ --archived
```
