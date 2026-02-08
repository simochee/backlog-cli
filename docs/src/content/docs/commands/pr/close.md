---
title: backlog pr close
description: プルリクエストをクローズする
---

```
backlog pr close <number> [flags]
```

プルリクエストをクローズします。

## 引数

`<number> <int>`
: プルリクエスト番号

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-R`, `--repo <string>`
: リポジトリ名

`-c`, `--comment <string>`
: クローズコメント

## 使用例

```bash
backlog pr close 42 --project PROJ --repo my-repo
backlog pr close 42 --project PROJ --repo my-repo --comment "別の PR に統合しました"
```
