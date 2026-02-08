---
title: backlog project edit
description: プロジェクトを編集する
---

```
backlog project edit <project-key> [flags]
```

プロジェクトの設定を編集します。

## 引数

`<project-key> <string>`
: プロジェクトキー

## オプション

`-n`, `--name <string>`
: プロジェクト名

`-k`, `--key <string>`
: 新しいプロジェクトキー

`--chart-enabled`
: チャート有効

`--archived`
: アーカイブ

## 使用例

```bash
backlog project edit PROJ --name "リネーム後"
backlog project edit PROJ --archived
```
