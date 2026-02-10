---
title: backlog issue-type edit
description: 課題種別を編集する
---

```
backlog issue-type edit <id> [flags]
```

対応するBacklog APIについては「[種別情報の更新](https://developer.nulab.com/ja/docs/backlog/api/2/update-issue-type/)」を参照してください。

## 引数

`<id> <int>`
: 種別ID

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-n`, `--name <string>`
: 種別名

`--color <string>`
: 表示色（`#hex` 形式）

## 使用例

```bash
backlog issue-type edit 12345 --project PROJ --name "バグ修正"
backlog issue-type edit 12345 --project PROJ --color "#00ff00"
```
