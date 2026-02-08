---
title: backlog milestone delete
description: マイルストーンを削除する
---

```
backlog milestone delete <id> [flags]
```

## 引数

| 引数   | 型     | 必須 | 説明              |
| ------ | ------ | ---- | ----------------- |
| `<id>` | number | Yes  | マイルストーン ID |

## オプション

| フラグ      | 短縮 | 型      | 説明                                       |
| ----------- | ---- | ------- | ------------------------------------------ |
| `--project` | `-p` | string  | プロジェクトキー（env: `BACKLOG_PROJECT`） |
| `--confirm` |      | boolean | 確認プロンプトをスキップ                   |

## 使用例

```bash
backlog milestone delete 12345 --project PROJ
backlog milestone delete 12345 --project PROJ --confirm
```
