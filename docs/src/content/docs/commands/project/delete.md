---
title: backlog project delete
description: プロジェクトを削除する
---

```
backlog project delete <project-key> [flags]
```

プロジェクトを削除します。この操作は元に戻せません。

## 引数

`<project-key> <string>`
: プロジェクトキー

## オプション

`--confirm`
: 確認プロンプトをスキップ

## 使用例

```bash
backlog project delete PROJ
backlog project delete PROJ --confirm
```
