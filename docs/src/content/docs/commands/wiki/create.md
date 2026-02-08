---
title: backlog wiki create
description: Wiki ページを作成する
---

```
backlog wiki create [flags]
```

## オプション

| フラグ      | 短縮 | 型      | 必須  | 説明                                       |
| ----------- | ---- | ------- | ----- | ------------------------------------------ |
| `--project` | `-p` | string  | Yes   | プロジェクトキー（env: `BACKLOG_PROJECT`） |
| `--name`    | `-n` | string  | Yes\* | ページ名                                   |
| `--body`    | `-b` | string  | Yes\* | 本文                                       |
| `--notify`  |      | boolean | No    | メール通知                                 |

## 使用例

```bash
backlog wiki create --project PROJ --name "設計ドキュメント" --body "# 概要"
```
