---
title: backlog status-type create
description: ステータスを作成する
---

```
backlog status-type create [flags]
```

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-n`, `--name <string>`
: ステータス名

`--color <string>`
: 表示色（`#hex` 形式）

## 使用例

```bash
backlog status-type create --project PROJ --name "レビュー中" --color "#0000ff"
```
