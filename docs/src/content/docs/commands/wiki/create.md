---
title: backlog wiki create
description: Wiki ページを作成する
---

```
backlog wiki create [flags]
```

対応する Backlog API については「[Wikiページの追加](https://developer.nulab.com/ja/docs/backlog/api/2/add-wiki-page/)」を参照してください。

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-n`, `--name <string>`
: ページ名

`-b`, `--body <string>`
: 本文

`--notify`
: メール通知

## 使用例

```bash
backlog wiki create --project PROJ --name "設計ドキュメント" --body "# 概要"
```
