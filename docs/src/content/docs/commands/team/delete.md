---
title: backlog team delete
description: チームを削除する
---

```
backlog team delete <team-id> [flags]
```

対応するBacklog APIについては「[チームの削除](https://developer.nulab.com/ja/docs/backlog/api/2/delete-team/)」を参照してください。

## 引数

`<team-id> <int>`
: チームID

## オプション

`-y`, `--yes`
: 確認プロンプトをスキップ

## 使用例

```bash
backlog team delete 12345
backlog team delete 12345 --yes
```
