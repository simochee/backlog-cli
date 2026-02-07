---
title: backlog milestone create
description: マイルストーンを作成する
---

```
backlog milestone create [flags]
```

## オプション

| フラグ               | 短縮 | 型     | 必須 | 説明                                       |
| -------------------- | ---- | ------ | ---- | ------------------------------------------ |
| `--project`          | `-p` | string | Yes  | プロジェクトキー（env: `BACKLOG_PROJECT`） |
| `--name`             | `-n` | string | Yes  | マイルストーン名                           |
| `--description`      | `-d` | string | No   | 説明                                       |
| `--start-date`       |      | string | No   | 開始日（`yyyy-MM-dd`）                     |
| `--release-due-date` |      | string | No   | リリース予定日（`yyyy-MM-dd`）             |

## 使用例

```bash
backlog milestone create --project PROJ --name "v1.0.0"
backlog milestone create --project PROJ --name "Sprint 1" \
  --start-date 2025-01-01 --release-due-date 2025-01-14
```
