---
title: backlog pr reopen
description: プルリクエストを再オープンする
---

```
backlog pr reopen <number> [flags]
```

クローズしたプルリクエストを再オープンします。

対応するBacklog APIについては「[プルリクエストの更新](https://developer.nulab.com/ja/docs/backlog/api/2/update-pull-request/)」を参照してください。

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
