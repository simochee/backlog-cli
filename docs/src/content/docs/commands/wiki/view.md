---
title: backlog wiki view
description: Wiki ページの詳細を表示する
---

```
backlog wiki view <wiki-id> [flags]
```

対応する Backlog API については「[Wikiページ情報の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-wiki-page/)」を参照してください。

## 引数

`<wiki-id> <int>`
: Wiki ページ ID

## オプション

`--web`
: ブラウザで開く

## 使用例

```bash
backlog wiki view 12345
backlog wiki view 12345 --web
```
