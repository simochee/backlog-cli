---
title: backlog team edit
description: チームを編集する
---

```
backlog team edit <team-id> [flags]
```

対応するBacklog APIについては「[チーム情報の更新](https://developer.nulab.com/ja/docs/backlog/api/2/update-team/)」を参照してください。

## 引数

`<team-id> <int>`
: チームID

## オプション

`-n`, `--name <string>`
: チーム名

`--members <string>`
: メンバー ID（カンマ区切り）

## 使用例

```bash
backlog team edit 12345 --name "新チーム名"
```
