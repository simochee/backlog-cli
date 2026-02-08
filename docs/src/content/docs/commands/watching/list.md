---
title: backlog watching list
description: ウォッチの一覧を表示する
---

```
backlog watching list [user-id] [flags]
```

対応する Backlog API については「[ウォッチ一覧の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-watching-list/)」を参照してください。

## 引数

`[user-id] <int>`
: ユーザー ID（省略時は自分）

## オプション

`-L`, `--limit <int>` (default 20)
: 取得件数

`--order <string>` (default "desc")
: 並び順: {asc|desc}

`--sort <string>`
: ソートキー

## 使用例

```bash
backlog watching list
backlog watching list --limit 50
```
