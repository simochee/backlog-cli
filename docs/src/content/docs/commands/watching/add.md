---
title: backlog watching add
description: ウォッチを追加する
---

```
backlog watching add [flags]
```

対応する Backlog API については「[ウォッチの追加](https://developer.nulab.com/ja/docs/backlog/api/2/add-watching/)」を参照してください。

## オプション

`--issue <string>`
: 課題キー

`--note <string>`
: メモ

## 使用例

```bash
backlog watching add --issue PROJECT-123
backlog watching add --issue PROJECT-123 --note "進捗を確認する"
```
