---
title: backlog team list
description: チームの一覧を表示する
---

```
backlog team list [flags]
```

対応するBacklog APIについては「[チーム一覧の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-list-of-teams/)」を参照してください。

## オプション

`--order <string>` (default "desc")
: 並び順: {asc|desc}

`--offset <int>` (default 0)
: オフセット

`-L`, `--limit <int>` (default 20)
: 取得件数

## 使用例

```bash
backlog team list
backlog team list --limit 50
```
