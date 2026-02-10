---
title: backlog wiki delete
description: Wiki ページを削除する
---

```
backlog wiki delete <wiki-id> [flags]
```

対応するBacklog APIについては「[Wikiページの削除](https://developer.nulab.com/ja/docs/backlog/api/2/delete-wiki-page/)」を参照してください。

## 引数

`<wiki-id> <int>`
: ページID

## オプション

`-y`, `--yes`
: 確認プロンプトをスキップ

## 使用例

```bash
backlog wiki delete 12345
backlog wiki delete 12345 --yes
```
