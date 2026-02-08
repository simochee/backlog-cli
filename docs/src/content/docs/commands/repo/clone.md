---
title: backlog repo clone
description: リポジトリをクローンする
---

```
backlog repo clone <repo-name> [flags]
```

Backlog Git リポジトリをローカルにクローンします。

## 引数

`<repo-name> <string>`
: リポジトリ名

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-d`, `--directory <string>`
: クローン先ディレクトリ

## 使用例

```bash
backlog repo clone my-repo --project PROJ
backlog repo clone my-repo --project PROJ --directory ./my-local-repo
```
