---
title: backlog webhook create
description: Webhook を作成する
---

```
backlog webhook create [flags]
```

対応する Backlog API については「[Webhookの追加](https://developer.nulab.com/ja/docs/backlog/api/2/add-webhook/)」を参照してください。

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
: 対象イベントタイプ ID（カンマ区切り）

## 使用例

```bash
backlog webhook create --project PROJ \
  --name "Slack通知" \
  --hook-url "https://hooks.slack.com/services/xxx" \
  --all-event
```
