---
title: backlog wiki tags
description: Wiki タグの一覧を表示する
---

```
backlog wiki tags [flags]
```

プロジェクトのWikiタグ一覧を表示します。

対応するBacklog APIについては「[Wikiページタグ一覧の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-wiki-page-tag-list/)」を参照してください。

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

## 使用例

```bash
backlog wiki tags --project PROJ
```
