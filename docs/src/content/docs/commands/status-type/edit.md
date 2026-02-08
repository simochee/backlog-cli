---
title: backlog status-type edit
description: ステータスを編集する
---

```
backlog status-type edit <id> [flags]
```

対応する Backlog API については「[状態情報の更新](https://developer.nulab.com/ja/docs/backlog/api/2/update-status/)」を参照してください。

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
