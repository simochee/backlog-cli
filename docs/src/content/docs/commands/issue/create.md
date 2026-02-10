---
title: backlog issue create
description: 課題を作成する
---

```
backlog issue create [flags]
```

新しい課題を作成します。必須オプションが省略された場合は対話形式で入力を求めます。

対応する Backlog API については「[課題の追加](https://developer.nulab.com/ja/docs/backlog/api/2/add-issue/)」を参照してください。

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-t`, `--title <string>`
: 課題の件名

`-T`, `--type <string>`
: 課題種別名

`-P`, `--priority <string>`
: 優先度名

`-d`, `--description <string>`
: 課題の詳細（`-` で標準入力）

`-a`, `--assignee <string>`
: 担当者

`--start-date <string>`
: 開始日（`yyyy-MM-dd`）

`--due-date <string>`
: 期限日（`yyyy-MM-dd`）

`--web`
: 作成後ブラウザで開く

## 使用例

```bash
# 対話形式で作成
backlog issue create

# 最小限のオプションで作成（優先度は「中」がデフォルト）
backlog issue create --project PROJ --title "タスク名" --type タスク

# すべてのオプションを指定
backlog issue create \
  --project PROJ \
  --title "ログイン画面のバグ修正" \
  --type バグ \
  --priority 高 \
  --assignee yamada \
  --description "ログインボタンが反応しない"

# 作成後にブラウザで開く
backlog issue create --project PROJ --title "新機能" --type タスク --web

# 標準入力から説明を読み込む
cat description.md | backlog issue create --project PROJ --title "課題" --type タスク --description -
```

## 関連コマンド

- [issue list](/commands/issue/list/)
- [issue edit](/commands/issue/edit/)
