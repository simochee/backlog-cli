---
title: backlog browse
description: Backlog をブラウザで開く
---

```
backlog browse [target] [flags]
```

Backlog のページをデフォルトブラウザで開きます。

## 引数

| 引数       | 型     | 必須 | 説明               |
| ---------- | ------ | ---- | ------------------ |
| `[target]` | string | No   | 課題キーまたはパス |

## オプション

| フラグ       | 短縮 | 型      | 説明                                       |
| ------------ | ---- | ------- | ------------------------------------------ |
| `--project`  | `-p` | string  | プロジェクトキー（env: `BACKLOG_PROJECT`） |
| `--issues`   |      | boolean | 課題一覧を開く                             |
| `--wiki`     |      | boolean | Wiki を開く                                |
| `--git`      |      | boolean | Git リポジトリページを開く                 |
| `--settings` |      | boolean | プロジェクト設定を開く                     |

## 使用例

```bash
# プロジェクトのトップを開く
backlog browse --project PROJ

# 課題を開く
backlog browse PROJECT-123

# 課題一覧を開く
backlog browse --project PROJ --issues

# Wiki を開く
backlog browse --project PROJ --wiki

# Git リポジトリページを開く
backlog browse --project PROJ --git
```
