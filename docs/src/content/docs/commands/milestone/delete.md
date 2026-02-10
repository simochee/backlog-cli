---
title: backlog milestone delete
description: マイルストーンを削除する
---

```
backlog milestone delete <id> [flags]
```

対応する Backlog API については「[バージョン(マイルストーン)の削除](https://developer.nulab.com/ja/docs/backlog/api/2/delete-version/)」を参照してください。

## 引数

`<id> <int>`
: マイルストーン ID

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-y`, `--yes`
: 確認プロンプトをスキップ

## 使用例

```bash
backlog milestone delete 12345 --project PROJ
backlog milestone delete 12345 --project PROJ --yes
```
