---
title: backlog pr list
description: プルリクエストの一覧を表示する
---

```
backlog pr list [flags]
```

プルリクエストの一覧を取得します。

対応する Backlog API については「[プルリクエスト一覧の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-pull-request-list/)」を参照してください。

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-R`, `--repo <string>`
: リポジトリ名

`-S`, `--status <string>` (default "open")
: ステータス: {open|closed|merged}

`-a`, `--assignee <string>`
: 担当者（ユーザー名 or `@me`）

`--created-by <string>`
: 作成者

`--issue <string>`
: 関連課題キー

`-L`, `--limit <int>` (default 20)
: 取得件数（1-100）

`--offset <int>` (default 0)
: オフセット

## 使用例

```bash
backlog pr list --project PROJ --repo my-repo
backlog pr list --project PROJ --repo my-repo --status closed
backlog pr list --project PROJ --repo my-repo --assignee @me
```
