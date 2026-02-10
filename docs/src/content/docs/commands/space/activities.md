---
title: backlog space activities
description: スペースのアクティビティを表示する
---

```
backlog space activities [flags]
```

スペース全体の最近のアクティビティを表示します。

対応するBacklog APIについては「[最近の更新の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-recent-updates/)」を参照してください。

## オプション

`-L`, `--limit <int>` (default 20)
: 取得件数

`--activity-type <string>`
: アクティビティタイプID（カンマ区切り）

## 使用例

```bash
backlog space activities
backlog space activities --limit 50
```
