---
title: backlog wiki edit
description: Wiki ページを編集する
---

```
backlog wiki edit <wiki-id> [flags]
```

対応する Backlog API については「[Wikiページ情報の更新](https://developer.nulab.com/ja/docs/backlog/api/2/update-wiki-page/)」を参照してください。

## 引数

`<wiki-id> <int>`
: ページ ID

## オプション

`-n`, `--name <string>`
: ページ名

`-b`, `--body <string>`
: 本文

`--notify`
: メール通知

## 使用例

```bash
backlog wiki edit 12345 --name "新しいタイトル"
backlog wiki edit 12345 --body "更新された内容"
```
