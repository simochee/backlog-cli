---
title: backlog category edit
description: カテゴリを編集する
---

```
backlog category edit <id> [flags]
```

対応する Backlog API については「[カテゴリー情報の更新](https://developer.nulab.com/ja/docs/backlog/api/2/update-category/)」を参照してください。

## 引数

`<id> <int>`
: カテゴリ ID

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-n`, `--name <string>`
: カテゴリ名

## 使用例

```bash
backlog category edit 12345 --project PROJ --name "バックエンド"
```
