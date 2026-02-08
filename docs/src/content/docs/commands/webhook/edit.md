---
title: backlog webhook edit
description: Webhook を編集する
---

```
backlog webhook edit <id> [flags]
```

対応する Backlog API については「[Webhookの更新](https://developer.nulab.com/ja/docs/backlog/api/2/update-webhook/)」を参照してください。

## 引数

`<id> <int>`
: Webhook ID

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-n`, `--name <string>`
: Webhook 名

`--hook-url <string>`
: 通知先 URL

`-d`, `--description <string>`
: 説明

`--all-event`
: 全イベント対象

`--activity-type-ids <string>`
: イベントタイプ ID（カンマ区切り）

## 使用例

```bash
backlog webhook edit 12345 --project PROJ --name "新しい名前"
```
