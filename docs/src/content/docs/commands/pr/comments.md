---
title: backlog pr comments
description: プルリクエストのコメント一覧を表示する
---

```
backlog pr comments <number> [flags]
```

プルリクエストのコメント一覧を表示します。

対応するBacklog APIについては「[プルリクエストコメントの取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-pull-request-comment/)」を参照してください。

## 引数

`<number> <int>`
: プルリクエスト番号

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-R`, `--repo <string>`
: リポジトリ名

`-L`, `--limit <int>` (default 20)
: 取得件数

## 使用例

```bash
backlog pr comments 42 --project PROJ --repo my-repo
backlog pr comments 42 --project PROJ --repo my-repo --limit 50
```
