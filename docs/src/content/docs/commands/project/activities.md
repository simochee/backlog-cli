---
title: backlog project activities
description: プロジェクトの最近の更新を表示する
---

```
backlog project activities <project-key> [flags]
```

プロジェクトの最近のアクティビティを表示します。

## 引数

`<project-key> <string>`
: プロジェクトキー

## オプション

`-L`, `--limit <int>` (default 20)
: 取得件数

`--activity-type <string>`
: アクティビティタイプ ID（カンマ区切り）

## 使用例

```bash
backlog project activities PROJ
backlog project activities PROJ --limit 50
```
