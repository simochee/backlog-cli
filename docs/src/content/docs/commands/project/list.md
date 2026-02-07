---
title: backlog project list
description: プロジェクトの一覧を表示する
---

```
backlog project list [flags]
```

アクセス可能なプロジェクトの一覧を表示します。

## オプション

| フラグ | 短縮 | 型 | デフォルト | 説明 |
|--------|------|------|------------|------|
| `--archived` | | boolean | — | アーカイブ済みを含める |
| `--all` | | boolean | `false` | 全プロジェクト（管理者のみ） |
| `--limit` | `-L` | number | `20` | 表示件数 |

## 使用例

```bash
# プロジェクト一覧
backlog project list

# アーカイブ済みを含める
backlog project list --archived

# 全プロジェクトを表示（管理者のみ）
backlog project list --all
```
