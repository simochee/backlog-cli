---
title: backlog webhook list
description: Webhook の一覧を表示する
---

```
backlog webhook list [flags]
```

対応するBacklog APIについては「[Webhook一覧の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-list-of-webhooks/)」を参照してください。

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

## 使用例

```bash
backlog webhook list --project PROJ
```
