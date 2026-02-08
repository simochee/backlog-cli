---
title: backlog pr edit
description: プルリクエストを編集する
---

```
backlog pr edit <number> [flags]
```

プルリクエストの情報を編集します。

対応する Backlog API については「[プルリクエストの更新](https://developer.nulab.com/ja/docs/backlog/api/2/update-pull-request/)」を参照してください。

## 引数

`<number> <int>`
: プルリクエスト番号

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-R`, `--repo <string>`
: リポジトリ名

`-t`, `--title <string>`
: タイトル

`-b`, `--body <string>`
: 説明

`-a`, `--assignee <string>`
: 担当者

`--issue <string>`
: 関連課題キー

## 使用例

```bash
backlog pr edit 42 --project PROJ --repo my-repo --title "新しいタイトル"
```
