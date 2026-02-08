---
title: backlog pr create
description: プルリクエストを作成する
---

```
backlog pr create [flags]
```

新しいプルリクエストを作成します。

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-R`, `--repo <string>`
: リポジトリ名

`-t`, `--title <string>`
: PR タイトル

`-b`, `--body <string>`
: PR 説明

`-B`, `--base <string>`
: マージ先ブランチ

`--branch <string>`
: マージ元ブランチ（デフォルト: 現在のブランチ）

`-a`, `--assignee <string>`
: 担当者

`--issue <string>`
: 関連課題キー

`--web`
: 作成後ブラウザで開く

## 使用例

```bash
backlog pr create --project PROJ --repo my-repo \
  --title "機能追加" --body "詳細な説明" \
  --base main --branch feature/new-feature

backlog pr create --project PROJ --repo my-repo \
  --title "バグ修正" --base develop --issue PROJ-123 --web
```
