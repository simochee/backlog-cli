---
title: backlog star list
description: スターの一覧を表示する
---

```
backlog star list [user-id] [flags]
```

対応する Backlog API については「[ユーザーの受け取ったスター一覧の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-received-star-list/)」を参照してください。

## 引数

`[user-id] <int>`
: ユーザー ID（省略時は自分）

## オプション

`-L`, `--limit <int>` (default 20)
: 取得件数

`--order <string>` (default "desc")
: 並び順: {asc|desc}

## 使用例

```bash
backlog star list
backlog star list 12345
```
