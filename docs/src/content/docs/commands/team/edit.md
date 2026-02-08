---
title: backlog team edit
description: チームを編集する
---

```
backlog team edit <team-id> [flags]
```

## 引数

`<team-id> <int>`
: チーム ID

## オプション

`-n`, `--name <string>`
: チーム名

`--members <string>`
: メンバー ID（カンマ区切り）

## 使用例

```bash
backlog team edit 12345 --name "新チーム名"
```
