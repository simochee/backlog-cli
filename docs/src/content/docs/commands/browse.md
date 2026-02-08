---
title: backlog browse
description: Backlog をブラウザで開く
---

```
backlog browse [target] [flags]
```

Backlog のページをデフォルトブラウザで開きます。

## 引数

`[target] <string>`
: 課題キーまたはパス

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: BACKLOG_PROJECT）

`--issues`
: 課題一覧を開く

`--wiki`
: Wiki を開く

`--git`
: Git リポジトリページを開く

`--settings`
: プロジェクト設定を開く

## 使用例

```bash
# プロジェクトのトップを開く
backlog browse --project PROJ

# 課題を開く
backlog browse PROJECT-123

# 課題一覧を開く
backlog browse --project PROJ --issues

# Wiki を開く
backlog browse --project PROJ --wiki

# Git リポジトリページを開く
backlog browse --project PROJ --git
```
