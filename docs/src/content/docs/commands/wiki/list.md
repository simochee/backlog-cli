---
title: backlog wiki list
description: Wiki ページの一覧を表示する
---

```
backlog wiki list [flags]
```

Wiki ページの一覧を取得します。

対応する Backlog API については「[Wikiページ一覧の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-wiki-page-list/)」を参照してください。

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
