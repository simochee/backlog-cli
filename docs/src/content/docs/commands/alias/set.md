---
title: backlog alias set
description: エイリアスを設定する
---

```
backlog alias set <name> <expansion> [flags]
```

コマンドのエイリアスを設定します。

## 引数

`<name> <string>`
: エイリアス名

`<expansion> <string>`
: 展開されるコマンド

## オプション

`--shell`
: シェルコマンドとして登録

## 使用例

```bash
# 課題一覧のエイリアス
backlog alias set my-issues "issue list --assignee @me"

# シェルコマンドとして登録
backlog alias set --shell open-proj "open https://your-space.backlog.com/projects/PROJ"
```
