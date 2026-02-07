---
title: backlog milestone edit
description: マイルストーンを編集する
---

```
backlog milestone edit <id> [flags]
```

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<id>` | number | Yes | マイルストーン ID |

## オプション

| フラグ | 短縮 | 型 | 説明 |
|--------|------|------|------|
| `--project` | `-p` | string | プロジェクトキー |
| `--name` | `-n` | string | マイルストーン名 |
| `--description` | `-d` | string | 説明 |
| `--start-date` | | string | 開始日（`yyyy-MM-dd`） |
| `--release-due-date` | | string | リリース予定日（`yyyy-MM-dd`） |
| `--archived` | | boolean | アーカイブ |

## 使用例

```bash
backlog milestone edit 12345 --project PROJ --name "v1.1.0"
backlog milestone edit 12345 --project PROJ --archived
```
