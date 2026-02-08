---
title: backlog webhook view
description: Webhook の詳細を表示する
---

```
backlog webhook view <id> [flags]
```

対応する Backlog API については「[Webhookの取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-webhook/)」を参照してください。

## 引数

`<id> <int>`
: Webhook ID

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

## 使用例

```bash
backlog webhook view 12345 --project PROJ
```
