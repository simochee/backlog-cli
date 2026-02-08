---
title: backlog milestone delete
description: マイルストーンを削除する
---

```
backlog milestone delete <id> [flags]
```

## 引数

`<id> <int>`
: マイルストーン ID

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`--confirm`
: 確認プロンプトをスキップ

## 使用例

```bash
backlog milestone delete 12345 --project PROJ
backlog milestone delete 12345 --project PROJ --confirm
```
