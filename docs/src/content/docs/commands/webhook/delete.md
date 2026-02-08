---
title: backlog webhook delete
description: Webhook を削除する
---

```
backlog webhook delete <id> [flags]
```

## 引数

`<id> <int>`
: Webhook ID

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`--confirm`
: 確認プロンプトをスキップ

## 使用例

```bash
backlog webhook delete 12345 --project PROJ
backlog webhook delete 12345 --project PROJ --confirm
```
