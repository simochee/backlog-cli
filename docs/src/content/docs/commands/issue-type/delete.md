---
title: backlog issue-type delete
description: 課題種別を削除する
---

```
backlog issue-type delete <id> [flags]
```

削除する種別に紐づく課題の移行先として、代替の種別IDを指定してください。

対応するBacklog APIについては「[種別の削除](https://developer.nulab.com/ja/docs/backlog/api/2/delete-issue-type/)」を参照してください。

## 引数

`<id> <int>`
: 種別ID

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`--substitute-issue-type-id <int>`
: 代替種別ID

`-y`, `--yes`
: 確認プロンプトをスキップ

## 使用例

```bash
backlog issue-type delete 12345 --project PROJ --substitute-issue-type-id 67890
```
