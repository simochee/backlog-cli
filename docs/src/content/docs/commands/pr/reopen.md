---
title: backlog pr reopen
description: プルリクエストを再オープンする
---

```
backlog pr reopen <number> [flags]
```

クローズしたプルリクエストを再オープンします。

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<number>` | number | Yes | プルリクエスト番号 |

## オプション

| フラグ | 短縮 | 型 | 説明 |
|--------|------|------|------|
| `--project` | `-p` | string | プロジェクトキー（env: `BACKLOG_PROJECT`） |
| `--repo` | `-R` | string | リポジトリ名 |

## 使用例

```bash
backlog pr reopen 42 --project PROJ --repo my-repo
```
