---
title: backlog category delete
description: カテゴリを削除する
---

```
backlog category delete <id> [flags]
```

対応する Backlog API については「[カテゴリーの削除](https://developer.nulab.com/ja/docs/backlog/api/2/delete-category/)」を参照してください。

## 引数

`<id> <int>`
: カテゴリ ID

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-y`, `--yes`
: 確認プロンプトをスキップ

## 使用例

```bash
backlog category delete 12345 --project PROJ
backlog category delete 12345 --project PROJ --yes
```
