---
title: backlog pr merge
description: プルリクエストをマージする
---

```
backlog pr merge <number> [flags]
```

プルリクエストをマージします。

## 引数

| 引数       | 型     | 必須 | 説明               |
| ---------- | ------ | ---- | ------------------ |
| `<number>` | number | Yes  | プルリクエスト番号 |

## オプション

| フラグ      | 短縮 | 型     | 説明                                       |
| ----------- | ---- | ------ | ------------------------------------------ |
| `--project` | `-p` | string | プロジェクトキー（env: `BACKLOG_PROJECT`） |
| `--repo`    | `-R` | string | リポジトリ名                               |
| `--comment` | `-c` | string | マージコメント                             |

## 使用例

```bash
backlog pr merge 42 --project PROJ --repo my-repo
backlog pr merge 42 --project PROJ --repo my-repo --comment "LGTM"
```
