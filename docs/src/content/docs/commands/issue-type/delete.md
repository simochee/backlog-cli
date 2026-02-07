---
title: backlog issue-type delete
description: 課題種別を削除する
---

```
backlog issue-type delete <id> [flags]
```

削除する種別に紐づく課題の移行先として、代替の種別 ID を指定する必要があります。

## 引数

| 引数   | 型     | 必須 | 説明    |
| ------ | ------ | ---- | ------- |
| `<id>` | number | Yes  | 種別 ID |

## オプション

| フラグ                       | 短縮 | 型      | 必須 | 説明                                       |
| ---------------------------- | ---- | ------- | ---- | ------------------------------------------ |
| `--project`                  | `-p` | string  | Yes  | プロジェクトキー（env: `BACKLOG_PROJECT`） |
| `--substitute-issue-type-id` |      | number  | Yes  | 代替種別 ID                                |
| `--confirm`                  |      | boolean | No   | 確認プロンプトをスキップ                   |

## 使用例

```bash
backlog issue-type delete 12345 --project PROJ --substitute-issue-type-id 67890
```
