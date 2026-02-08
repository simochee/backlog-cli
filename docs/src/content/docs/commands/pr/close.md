---
title: backlog pr close
description: プルリクエストをクローズする
---

```
backlog pr close <number> [flags]
```

プルリクエストをクローズします。

## 引数

| 引数       | 型     | 必須 | 説明               |
| ---------- | ------ | ---- | ------------------ |
| `<number>` | number | Yes  | プルリクエスト番号 |

## オプション

| フラグ      | 短縮 | 型     | 説明                                       |
| ----------- | ---- | ------ | ------------------------------------------ |
| `--project` | `-p` | string | プロジェクトキー（env: `BACKLOG_PROJECT`） |
| `--repo`    | `-R` | string | リポジトリ名                               |
| `--comment` | `-c` | string | クローズコメント                           |

## 使用例

```bash
backlog pr close 42 --project PROJ --repo my-repo
backlog pr close 42 --project PROJ --repo my-repo --comment "別の PR に統合しました"
```
