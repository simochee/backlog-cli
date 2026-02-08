---
title: backlog pr merge
description: プルリクエストをマージする
---

```
backlog pr merge <number> [flags]
```

プルリクエストをマージします。

対応する Backlog API については「[プルリクエストの更新](https://developer.nulab.com/ja/docs/backlog/api/2/update-pull-request/)」を参照してください。

## 引数

`<number> <int>`
: プルリクエスト番号

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-R`, `--repo <string>`
: リポジトリ名

`-c`, `--comment <string>`
: マージコメント

## 使用例

```bash
backlog pr merge 42 --project PROJ --repo my-repo
backlog pr merge 42 --project PROJ --repo my-repo --comment "LGTM"
```
