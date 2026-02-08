---
title: backlog status-type delete
description: ステータスを削除する
---

```
backlog status-type delete <id> [flags]
```

削除するステータスに紐づく課題の移行先として、代替のステータス ID を指定する必要があります。

## 引数

| 引数   | 型     | 必須 | 説明          |
| ------ | ------ | ---- | ------------- |
| `<id>` | number | Yes  | ステータス ID |

## オプション

| フラグ                   | 短縮 | 型      | 必須 | 説明                                       |
| ------------------------ | ---- | ------- | ---- | ------------------------------------------ |
| `--project`              | `-p` | string  | Yes  | プロジェクトキー（env: `BACKLOG_PROJECT`） |
| `--substitute-status-id` |      | number  | Yes  | 代替ステータス ID                          |
| `--confirm`              |      | boolean | No   | 確認プロンプトをスキップ                   |

## 使用例

```bash
backlog status-type delete 12345 --project PROJ --substitute-status-id 67890
```
