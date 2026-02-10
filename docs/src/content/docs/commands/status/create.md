---
title: backlog status create
description: ステータスを作成する
---

```
backlog status create [flags]
```

対応する Backlog API については「[状態の追加](https://developer.nulab.com/ja/docs/backlog/api/2/add-status/)」を参照してください。

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-n`, `--name <string>`
: ステータス名

`--color <string>`
: 表示色（`#hex` 形式）

## 使用例

```bash
backlog status create --project PROJ --name "レビュー中" --color "#0000ff"
```
