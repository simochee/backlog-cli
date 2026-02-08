---
title: backlog project remove-user
description: プロジェクトからメンバーを削除する
---

```
backlog project remove-user <project-key> [flags]
```

プロジェクトからメンバーを削除します。

## 引数

`<project-key> <string>`
: プロジェクトキー

## オプション

`--user-id <int>`
: ユーザー ID

## 使用例

```bash
backlog project remove-user PROJ --user-id 12345
```
