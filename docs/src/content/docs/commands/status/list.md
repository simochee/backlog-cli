---
title: backlog status list
description: ステータスの一覧を表示する
---

```
backlog status list [flags]
```

対応するBacklog APIについては「[プロジェクトの状態一覧の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-status-list-of-project/)」を参照してください。

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

## 使用例

```bash
backlog status list --project PROJ
```
