---
title: backlog webhook delete
description: Webhook を削除する
---

```
backlog webhook delete <id> [flags]
```

対応するBacklog APIについては「[Webhookの削除](https://developer.nulab.com/ja/docs/backlog/api/2/delete-webhook/)」を参照してください。

## 引数

`<id> <int>`
: Webhook ID

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-y`, `--yes`
: 確認プロンプトをスキップ

## 使用例

```bash
backlog webhook delete 12345 --project PROJ
backlog webhook delete 12345 --project PROJ --yes
```
