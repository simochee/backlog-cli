---
title: backlog project add-user
description: プロジェクトにメンバーを追加する
---

```
backlog project add-user <project-key> [flags]
```

プロジェクトにメンバーを追加します。

対応するBacklog APIについては「[プロジェクトユーザーの追加](https://developer.nulab.com/ja/docs/backlog/api/2/add-project-user/)」を参照してください。

## 引数

`<project-key> <string>`
: プロジェクトキー

## オプション

`--user-id <int>`
: ユーザー ID

## 使用例

```bash
backlog project add-user PROJ --user-id 12345
```
