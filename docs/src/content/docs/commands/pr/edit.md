---
title: backlog pr edit
description: プルリクエストを編集する
---

```
backlog pr edit <number> [flags]
```

プルリクエストの情報を編集します。

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<number>` | number | Yes | プルリクエスト番号 |

## オプション

| フラグ | 短縮 | 型 | 説明 |
|--------|------|------|------|
| `--project` | `-p` | string | プロジェクトキー |
| `--repo` | `-R` | string | リポジトリ名 |
| `--title` | `-t` | string | タイトル |
| `--body` | `-b` | string | 説明 |
| `--assignee` | `-a` | string | 担当者 |
| `--issue` | | string | 関連課題キー |

## 使用例

```bash
backlog pr edit 42 --project PROJ --repo my-repo --title "新しいタイトル"
```
