---
title: backlog document tree
description: ドキュメントのツリー構造を表示する
---

```
backlog document tree [flags]
```

プロジェクトのドキュメントをツリー構造で表示します。

対応するBacklog APIについては「[ドキュメントツリーの取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-document-tree/)」を参照してください。

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

## 使用例

```bash
backlog document tree --project PROJ
backlog document tree --project PROJ --json
```
