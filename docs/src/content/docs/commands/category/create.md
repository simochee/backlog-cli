---
title: backlog category create
description: カテゴリを作成する
---

```
backlog category create [flags]
```

対応する Backlog API については「[カテゴリーの追加](https://developer.nulab.com/ja/docs/backlog/api/2/add-category/)」を参照してください。

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-n`, `--name <string>`
: カテゴリ名

## 使用例

```bash
backlog category create --project PROJ --name "フロントエンド"
```
