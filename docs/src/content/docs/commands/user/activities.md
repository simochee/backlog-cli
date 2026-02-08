---
title: backlog user activities
description: ユーザーのアクティビティを表示する
---

```
backlog user activities <user-id> [flags]
```

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
