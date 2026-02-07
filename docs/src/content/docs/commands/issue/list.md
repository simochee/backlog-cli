---
title: backlog issue list
description: 課題の一覧を表示する
---

```
backlog issue list [flags]
```

条件を指定して課題の一覧を取得します。

## オプション

| フラグ | 短縮 | 型 | デフォルト | 説明 |
|--------|------|------|------------|------|
| `--project` | `-p` | string | — | プロジェクトキー（カンマ区切りで複数可）（env: `BACKLOG_PROJECT`） |
| `--assignee` | `-a` | string | — | 担当者（ユーザー名 or `@me`） |
| `--status` | `-S` | string | — | ステータス名（カンマ区切りで複数可） |
| `--type` | `-T` | string | — | 課題種別名（カンマ区切りで複数可） |
| `--priority` | `-P` | string | — | 優先度名 |
| `--keyword` | `-k` | string | — | キーワード検索 |
| `--created-since` | | string | — | 作成日 FROM（`yyyy-MM-dd`） |
| `--created-until` | | string | — | 作成日 TO（`yyyy-MM-dd`） |
| `--updated-since` | | string | — | 更新日 FROM（`yyyy-MM-dd`） |
| `--updated-until` | | string | — | 更新日 TO（`yyyy-MM-dd`） |
| `--due-since` | | string | — | 期限日 FROM（`yyyy-MM-dd`） |
| `--due-until` | | string | — | 期限日 TO（`yyyy-MM-dd`） |
| `--sort` | | string | `updated` | ソートキー |
| `--order` | | string | `desc` | 並び順（`asc` / `desc`） |
| `--limit` | `-L` | number | `20` | 取得件数（1-100） |
| `--offset` | | number | `0` | オフセット |

## 使用例

```bash
# プロジェクトの課題一覧
backlog issue list --project PROJ

# 自分に割り当てられた課題
backlog issue list --assignee @me

# ステータスでフィルタ
backlog issue list --project PROJ --status 処理中,未対応

# キーワード検索
backlog issue list --project PROJ --keyword "ログイン"

# 最新20件を更新日順で取得
backlog issue list --project PROJ --sort updated --order desc --limit 20
```

## 関連コマンド

- [issue view](/backlog-cli/commands/issue/view/)
- [issue create](/backlog-cli/commands/issue/create/)
