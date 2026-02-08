---
title: backlog wiki history
description: Wiki ページの編集履歴を表示する
---

```
backlog wiki history <wiki-id> [flags]
```

## 引数

`<wiki-id> <int>`
: ページ ID

## オプション

`-L`, `--limit <int>` (default 20)
: 取得件数

`--offset <int>` (default 0)
: オフセット

## 使用例

```bash
backlog wiki history 12345
backlog wiki history 12345 --limit 50
```
