---
title: backlog pr reopen
description: プルリクエストを再オープンする
---

```
backlog pr reopen <number> [flags]
```

クローズしたプルリクエストを再オープンします。

## 引数

`<number> <int>`
: プルリクエスト番号

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-R`, `--repo <string>`
: リポジトリ名

## 使用例

```bash
backlog pr reopen 42 --project PROJ --repo my-repo
```
