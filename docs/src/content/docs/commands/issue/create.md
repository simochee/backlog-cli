---
title: backlog issue create
description: 課題を作成する
---

```
backlog issue create [flags]
```

新しい課題を作成します。必須オプションが省略された場合は対話形式で入力を求めます。

## オプション

| フラグ          | 短縮 | 型      | 必須  | デフォルト | 説明                                       |
| --------------- | ---- | ------- | ----- | ---------- | ------------------------------------------ |
| `--project`     | `-p` | string  | Yes\* | —          | プロジェクトキー（env: `BACKLOG_PROJECT`） |
| `--title`       | `-t` | string  | Yes\* | —          | 課題の件名                                 |
| `--type`        | `-T` | string  | Yes\* | —          | 課題種別名                                 |
| `--priority`    | `-P` | string  | No    | `中`       | 優先度名                                   |
| `--description` | `-d` | string  | No    | —          | 課題の詳細（`-` で標準入力）               |
| `--assignee`    | `-a` | string  | No    | —          | 担当者                                     |
| `--start-date`  |      | string  | No    | —          | 開始日（`yyyy-MM-dd`）                     |
| `--due-date`    |      | string  | No    | —          | 期限日（`yyyy-MM-dd`）                     |
| `--web`         |      | boolean | No    | `false`    | 作成後ブラウザで開く                       |

> \*: インタラクティブモードでは省略可能

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

- [issue list](/backlog-cli/commands/issue/list/)
- [issue edit](/backlog-cli/commands/issue/edit/)
