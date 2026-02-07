---
title: backlog repo clone
description: リポジトリをクローンする
---

```
backlog repo clone <repo-name> [flags]
```

Backlog Git リポジトリをローカルにクローンします。

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<repo-name>` | string | Yes | リポジトリ名 |

## オプション

| フラグ | 短縮 | 型 | 説明 |
|--------|------|------|------|
| `--project` | `-p` | string | プロジェクトキー |
| `--directory` | `-d` | string | クローン先ディレクトリ |

## 使用例

```bash
backlog repo clone my-repo --project PROJ
backlog repo clone my-repo --project PROJ --directory ./my-local-repo
```
