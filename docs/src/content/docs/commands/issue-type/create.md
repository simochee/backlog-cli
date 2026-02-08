---
title: backlog issue-type create
description: 課題種別を作成する
---

```
backlog issue-type create [flags]
```

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-n`, `--name <string>`
: 種別名

`--color <string>`
: 表示色（`#hex` 形式）

## 使用例

```bash
backlog issue-type create --project PROJ --name "機能追加" --color "#ff0000"
```
