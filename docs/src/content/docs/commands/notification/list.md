---
title: backlog notification list
description: 通知の一覧を表示する
---

```
backlog notification list [flags]
```

通知の一覧を表示します。

対応する Backlog API については「[お知らせ一覧の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-notification/)」を参照してください。

## オプション

`-L`, `--limit <int>` (default 20)
: 取得件数

`--min-id <int>`
: 最小通知 ID

`--max-id <int>`
: 最大通知 ID

`--order <string>` (default "desc")
: 並び順: {asc|desc}

## 使用例

```bash
backlog notification list
backlog notification list --limit 50
```
