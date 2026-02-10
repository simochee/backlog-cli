---
title: backlog project delete
description: プロジェクトを削除する
---

```
backlog project delete <project-key> [flags]
```

プロジェクトを削除します。この操作は元に戻せません。

対応する Backlog API については「[プロジェクトの削除](https://developer.nulab.com/ja/docs/backlog/api/2/delete-project/)」を参照してください。

## 引数

`<project-key> <string>`
: プロジェクトキー

## オプション

`-y`, `--yes`
: 確認プロンプトをスキップ

## 使用例

```bash
backlog project delete PROJ
backlog project delete PROJ --yes
```
