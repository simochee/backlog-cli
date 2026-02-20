---
title: backlog document list
description: ドキュメントの一覧を表示する
---

```
backlog document list [flags]
```

ドキュメントの一覧を取得します。

対応するBacklog APIについては「[ドキュメント一覧の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-list-of-documents/)」を参照してください。

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-k`, `--keyword <string>`
: キーワード検索

`--sort <string>` (default "updated")
: ソートキー: {created|updated}

`--order <string>` (default "desc")
: 並び順: {asc|desc}

`--offset <string>`
: オフセット

`-L`, `--limit <string>` (default "20")
: 取得件数

## 使用例

```bash
backlog document list --project PROJ
backlog document list --project PROJ --keyword "設計"
backlog document list --project PROJ --sort created --order asc
```
