---
title: backlog status delete
description: ステータスを削除する
---

```
backlog status delete <id> [flags]
```

削除するステータスに紐づく課題の移行先として、代替のステータスIDを指定してください。

対応するBacklog APIについては「[状態の削除](https://developer.nulab.com/ja/docs/backlog/api/2/delete-status/)」を参照してください。

## 引数

`<id> <int>`
: ステータスID

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`--substitute-status-id <int>`
: 代替ステータスID

`-y`, `--yes`
: 確認プロンプトをスキップ

## 使用例

```bash
backlog status delete 12345 --project PROJ --substitute-status-id 67890
```
