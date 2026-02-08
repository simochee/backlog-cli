---
title: backlog project list
description: プロジェクトの一覧を表示する
---

```
backlog project list [flags]
```

アクセス可能なプロジェクトの一覧を表示します。

## オプション

`--archived`
: アーカイブ済みを含める

`--all`
: 全プロジェクト（管理者のみ）

`-L`, `--limit <int>` (default 20)
: 表示件数

## 使用例

```bash
# プロジェクト一覧
backlog project list

# アーカイブ済みを含める
backlog project list --archived

# 全プロジェクトを表示（管理者のみ）
backlog project list --all
```
