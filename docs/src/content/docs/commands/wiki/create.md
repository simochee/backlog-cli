---
title: backlog wiki create
description: Wiki ページを作成する
---

```
backlog wiki create [flags]
```

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
