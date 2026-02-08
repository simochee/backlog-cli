---
title: backlog repo view
description: リポジトリの詳細を表示する
---

```
backlog repo view <repo-name> [flags]
```

Git リポジトリの詳細情報を表示します。

## 引数

| 引数          | 型     | 必須 | 説明         |
| ------------- | ------ | ---- | ------------ |
| `<repo-name>` | string | Yes  | リポジトリ名 |

## オプション

| フラグ      | 短縮 | 型      | 説明                                       |
| ----------- | ---- | ------- | ------------------------------------------ |
| `--project` | `-p` | string  | プロジェクトキー（env: `BACKLOG_PROJECT`） |
| `--web`     |      | boolean | ブラウザで開く                             |

## 使用例

```bash
backlog repo view my-repo --project PROJ
backlog repo view my-repo --project PROJ --web
```
