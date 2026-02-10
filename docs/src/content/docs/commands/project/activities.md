---
title: backlog project activities
description: プロジェクトの最近の更新を表示する
---

```
backlog project activities <project-key> [flags]
```

プロジェクトの最近のアクティビティを表示します。

対応するBacklog APIについては「[プロジェクトの最近の活動の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-project-recent-updates/)」を参照してください。

## 引数

`<project-key> <string>`
: プロジェクトキー

## オプション

`-L`, `--limit <int>` (default 20)
: 取得件数

`--activity-type <string>`
: アクティビティタイプID（カンマ区切り）

## 使用例

```bash
backlog project activities PROJ
backlog project activities PROJ --limit 50
```
