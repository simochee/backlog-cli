---
title: backlog wiki list
description: Wiki ページの一覧を表示する
---

```
backlog wiki list [flags]
```

Wiki ページの一覧を取得します。

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-k`, `--keyword <string>`
: キーワード検索

`--sort <string>` (default "updated")
: ソートキー

`--order <string>` (default "desc")
: 並び順: {asc|desc}

`--offset <int>` (default 0)
: オフセット

`-L`, `--limit <int>` (default 20)
: 取得件数

## 使用例

```bash
backlog wiki list --project PROJ
backlog wiki list --project PROJ --keyword "設計"
```
