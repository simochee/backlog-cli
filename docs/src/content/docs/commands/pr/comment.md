---
title: backlog pr comment
description: プルリクエストにコメントを追加する
---

```
backlog pr comment <number> [flags]
```

プルリクエストにコメントを追加します。

対応する Backlog API については「[プルリクエストコメントの追加](https://developer.nulab.com/ja/docs/backlog/api/2/add-pull-request-comment/)」を参照してください。

## 引数

`<number> <int>`
: プルリクエスト番号

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-R`, `--repo <string>`
: リポジトリ名

`-b`, `--body <string>`
: コメント本文（`-` で標準入力）

## 使用例

```bash
backlog pr comment 42 --project PROJ --repo my-repo --body "確認しました"
```
