---
title: backlog status-type delete
description: ステータスを削除する
---

```
backlog status-type delete <id> [flags]
```

削除するステータスに紐づく課題の移行先として、代替のステータス ID を指定してください。

## 引数

`<id> <int>`
: ステータス ID

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`--substitute-status-id <int>`
: 代替ステータス ID

`--confirm`
: 確認プロンプトをスキップ

## 使用例

```bash
backlog status-type delete 12345 --project PROJ --substitute-status-id 67890
```
