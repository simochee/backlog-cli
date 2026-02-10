---
title: backlog wiki count
description: Wiki ページ数を表示する
---

```
backlog wiki count [flags]
```

プロジェクトのWikiページ数を表示します。

対応するBacklog APIについては「[Wikiページ数の取得](https://developer.nulab.com/ja/docs/backlog/api/2/count-wiki-page/)」を参照してください。

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

## 使用例

```bash
backlog wiki count --project PROJ
```
