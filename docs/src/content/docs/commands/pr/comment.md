---
title: backlog pr comment
description: プルリクエストにコメントを追加する
---

```
backlog pr comment <number> [flags]
```

プルリクエストにコメントを追加します。

## 引数

| 引数       | 型     | 必須 | 説明               |
| ---------- | ------ | ---- | ------------------ |
| `<number>` | number | Yes  | プルリクエスト番号 |

## オプション

| フラグ      | 短縮 | 型     | 説明                                       |
| ----------- | ---- | ------ | ------------------------------------------ |
| `--project` | `-p` | string | プロジェクトキー（env: `BACKLOG_PROJECT`） |
| `--repo`    | `-R` | string | リポジトリ名                               |
| `--body`    | `-b` | string | コメント本文（`-` で標準入力）             |

## 使用例

```bash
backlog pr comment 42 --project PROJ --repo my-repo --body "確認しました"
```
