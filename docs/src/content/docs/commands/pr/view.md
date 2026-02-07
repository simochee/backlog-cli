---
title: backlog pr view
description: プルリクエストの詳細を表示する
---

```
backlog pr view <number> [flags]
```

プルリクエストの詳細情報を表示します。

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<number>` | number | Yes | プルリクエスト番号 |

## オプション

| フラグ | 短縮 | 型 | 説明 |
|--------|------|------|------|
| `--project` | `-p` | string | プロジェクトキー |
| `--repo` | `-R` | string | リポジトリ名 |
| `--comments` | | boolean | コメントも表示する |
| `--web` | | boolean | ブラウザで開く |

## 使用例

```bash
backlog pr view 42 --project PROJ --repo my-repo
backlog pr view 42 --project PROJ --repo my-repo --comments
backlog pr view 42 --project PROJ --repo my-repo --web
```
