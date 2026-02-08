---
title: backlog pr create
description: プルリクエストを作成する
---

```
backlog pr create [flags]
```

新しいプルリクエストを作成します。

## オプション

| フラグ       | 短縮 | 型      | 必須  | 説明                                           |
| ------------ | ---- | ------- | ----- | ---------------------------------------------- |
| `--project`  | `-p` | string  | Yes   | プロジェクトキー（env: `BACKLOG_PROJECT`）     |
| `--repo`     | `-R` | string  | Yes   | リポジトリ名                                   |
| `--title`    | `-t` | string  | Yes\* | PR タイトル                                    |
| `--body`     | `-b` | string  | Yes\* | PR 説明                                        |
| `--base`     | `-B` | string  | Yes\* | マージ先ブランチ                               |
| `--branch`   |      | string  | No    | マージ元ブランチ（デフォルト: 現在のブランチ） |
| `--assignee` | `-a` | string  | No    | 担当者                                         |
| `--issue`    |      | string  | No    | 関連課題キー                                   |
| `--web`      |      | boolean | No    | 作成後ブラウザで開く                           |

> \*: インタラクティブモードでは省略可能

## 使用例

```bash
backlog pr create --project PROJ --repo my-repo \
  --title "機能追加" --body "詳細な説明" \
  --base main --branch feature/new-feature

backlog pr create --project PROJ --repo my-repo \
  --title "バグ修正" --base develop --issue PROJ-123 --web
```
