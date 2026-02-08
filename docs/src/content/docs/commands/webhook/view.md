---
title: backlog webhook view
description: Webhook の詳細を表示する
---

```
backlog webhook view <id> [flags]
```

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
