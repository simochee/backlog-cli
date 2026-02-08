---
title: backlog status-type list
description: ステータスの一覧を表示する
---

```
backlog status-type list [flags]
```

対応する Backlog API については「[プロジェクトの状態一覧の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-status-list-of-project/)」を参照してください。

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

## 使用例

```bash
backlog status-type list --project PROJ
```
