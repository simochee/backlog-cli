---
title: backlog status-type edit
description: ステータスを編集する
---

```
backlog status-type edit <id> [flags]
```

## 引数

`<id> <int>`
: ステータス ID

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-n`, `--name <string>`
: ステータス名

`--color <string>`
: 表示色（`#hex` 形式）

## 使用例

```bash
backlog status-type edit 12345 --project PROJ --name "確認待ち"
```
