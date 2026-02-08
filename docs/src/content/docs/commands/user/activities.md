---
title: backlog user activities
description: ユーザーのアクティビティを表示する
---

```
backlog user activities <user-id> [flags]
```

対応する Backlog API については「[ユーザーの最近の活動の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-user-recent-updates/)」を参照してください。

## 引数

`<user-id> <int>`
: ユーザー ID

## オプション

`-L`, `--limit <int>` (default 20)
: 取得件数

`--activity-type <string>`
: アクティビティタイプ ID（カンマ区切り）

## 使用例

```bash
backlog user activities 12345
backlog user activities 12345 --limit 50
```
