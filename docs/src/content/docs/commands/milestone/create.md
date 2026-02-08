---
title: backlog milestone create
description: マイルストーンを作成する
---

```
backlog milestone create [flags]
```

対応する Backlog API については「[バージョン(マイルストーン)の追加](https://developer.nulab.com/ja/docs/backlog/api/2/add-version-milestone/)」を参照してください。

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

## 使用例

```bash
backlog milestone create --project PROJ --name "v1.0.0"
backlog milestone create --project PROJ --name "Sprint 1" \
  --start-date 2025-01-01 --release-due-date 2025-01-14
```
