---
title: backlog repo view
description: リポジトリの詳細を表示する
---

```
backlog repo view <repo-name> [flags]
```

Git リポジトリの詳細情報を表示します。

対応する Backlog API については「[Gitリポジトリの取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-git-repository/)」を参照してください。

## 引数

`<repo-name> <string>`
: リポジトリ名

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`--web`
: ブラウザで開く

## 使用例

```bash
backlog repo view my-repo --project PROJ
backlog repo view my-repo --project PROJ --web
```
