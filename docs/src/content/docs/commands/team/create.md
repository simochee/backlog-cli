---
title: backlog team create
description: チームを作成する
---

```
backlog team create [flags]
```

対応する Backlog API については「[チームの追加](https://developer.nulab.com/ja/docs/backlog/api/2/add-team/)」を参照してください。

## オプション

`-n`, `--name <string>`
: チーム名

`--members <string>`
: メンバー ID（カンマ区切り）

## 使用例

```bash
backlog team create --name "開発チーム"
backlog team create --name "開発チーム" --members 123,456,789
```
