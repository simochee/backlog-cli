---
title: backlog alias set
description: エイリアスを設定する
---

```
backlog alias set <name> <expansion> [flags]
```

コマンドのエイリアスを設定します。

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<name>` | string | Yes | エイリアス名 |
| `<expansion>` | string | Yes | 展開されるコマンド |

## オプション

| フラグ | 型 | 説明 |
|--------|------|------|
| `--shell` | boolean | シェルコマンドとして登録 |

## 使用例

```bash
# 課題一覧のエイリアス
backlog alias set my-issues "issue list --assignee @me"

# シェルコマンドとして登録
backlog alias set --shell open-proj "open https://your-space.backlog.com/projects/PROJ"
```
