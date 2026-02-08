---
title: backlog milestone edit
description: マイルストーンを編集する
---

```
backlog milestone edit <id> [flags]
```

対応する Backlog API については「[バージョン(マイルストーン)情報の更新](https://developer.nulab.com/ja/docs/backlog/api/2/update-version-milestone/)」を参照してください。

## 引数

`<id> <int>`
: マイルストーン ID

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-n`, `--name <string>`
: マイルストーン名

`-d`, `--description <string>`
: 説明

`--start-date <string>`
: 開始日（`yyyy-MM-dd`）

`--release-due-date <string>`
: リリース予定日（`yyyy-MM-dd`）

`--archived`
: アーカイブ

## 使用例

```bash
backlog milestone edit 12345 --project PROJ --name "v1.1.0"
backlog milestone edit 12345 --project PROJ --archived
```
