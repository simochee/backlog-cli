---
title: backlog star list
description: スターの一覧を表示する
---

```
backlog star list [user-id] [flags]
```

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
