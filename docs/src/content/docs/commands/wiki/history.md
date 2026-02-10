---
title: backlog wiki history
description: Wiki ページの編集履歴を表示する
---

```
backlog wiki history <wiki-id> [flags]
```

対応するBacklog APIについては「[Wikiページ更新履歴一覧の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-wiki-page-history/)」を参照してください。

## 引数

`<wiki-id> <int>`
: ページID

## オプション

`-L`, `--limit <int>` (default 20)
: 取得件数

`--offset <int>` (default 0)
: オフセット

## 使用例

```bash
backlog wiki history 12345
backlog wiki history 12345 --limit 50
```
