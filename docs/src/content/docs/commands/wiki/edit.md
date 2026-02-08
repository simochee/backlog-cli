---
title: backlog wiki edit
description: Wiki ページを編集する
---

```
backlog wiki edit <wiki-id> [flags]
```

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
