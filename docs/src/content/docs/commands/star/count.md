---
title: backlog star count
description: スター数を表示する
---

```
backlog star count [user-id] [flags]
```

対応する Backlog API については「[ユーザーの受け取ったスターの数の取得](https://developer.nulab.com/ja/docs/backlog/api/2/count-user-received-stars/)」を参照してください。

## 引数

`[user-id] <int>`
: ユーザー ID（省略時は自分）

## オプション

`--since <string>`
: 開始日（`yyyy-MM-dd`）

`--until <string>`
: 終了日（`yyyy-MM-dd`）

## 使用例

```bash
backlog star count
backlog star count --since 2025-01-01 --until 2025-12-31
```
