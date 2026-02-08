---
title: backlog pr view
description: プルリクエストの詳細を表示する
---

```
backlog pr view <number> [flags]
```

プルリクエストの詳細情報を表示します。

## 引数

`<number> <int>`
: プルリクエスト番号

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-R`, `--repo <string>`
: リポジトリ名

`--comments`
: コメントも表示する

`--web`
: ブラウザで開く

## 使用例

```bash
backlog pr view 42 --project PROJ --repo my-repo
backlog pr view 42 --project PROJ --repo my-repo --comments
backlog pr view 42 --project PROJ --repo my-repo --web
```
