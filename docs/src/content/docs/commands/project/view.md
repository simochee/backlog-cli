---
title: backlog project view
description: プロジェクトの詳細を表示する
---

```
backlog project view <project-key> [flags]
```

プロジェクトの詳細情報を表示します。

対応するBacklog APIについては「[プロジェクト情報の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-project/)」を参照してください。

## 引数

`<project-key> <string>`
: プロジェクトキー

## オプション

`--web`
: ブラウザで開く

## 使用例

```bash
backlog project view PROJ
backlog project view PROJ --web
```
