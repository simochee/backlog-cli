---
title: backlog watching delete
description: ウォッチを削除する
---

```
backlog watching delete <watching-id> [flags]
```

対応するBacklog APIについては「[ウォッチの削除](https://developer.nulab.com/ja/docs/backlog/api/2/delete-watching/)」を参照してください。

## 引数

`<watching-id> <int>`
: ウォッチID

## オプション

`-y`, `--yes`
: 確認プロンプトをスキップ

## 使用例

```bash
backlog watching delete 12345
backlog watching delete 12345 --yes
```
