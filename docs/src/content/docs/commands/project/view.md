---
title: backlog project view
description: プロジェクトの詳細を表示する
---

```
backlog project view <project-key> [flags]
```

プロジェクトの詳細情報を表示します。

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<project-key>` | string | Yes | プロジェクトキー |

## オプション

| フラグ | 型 | 説明 |
|--------|------|------|
| `--web` | boolean | ブラウザで開く |

## 使用例

```bash
backlog project view PROJ
backlog project view PROJ --web
```
