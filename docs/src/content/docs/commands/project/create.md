---
title: backlog project create
description: プロジェクトを作成する
---

```
backlog project create [flags]
```

新しいプロジェクトを作成します。

対応するBacklog APIについては「[プロジェクトの追加](https://developer.nulab.com/ja/docs/backlog/api/2/add-project/)」を参照してください。

## オプション

`-n`, `--name <string>`
: プロジェクト名

`-k`, `--key <string>`
: プロジェクトキー（英大文字）

`--chart-enabled`
: チャート有効

`--subtasking-enabled`
: サブタスク有効

`--project-leader-can-edit-project-leader`
: PL変更権限

`--text-formatting-rule <string>`
: 書式ルール: {markdown|backlog}

## 使用例

```bash
backlog project create --name "新プロジェクト" --key NEWPROJ
backlog project create --name "開発プロジェクト" --key DEV --text-formatting-rule markdown
```
