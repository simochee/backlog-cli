---
title: backlog star add
description: スターを追加する
---

```
backlog star add [flags]
```

課題、コメント、Wikiページ、PRコメントにスターを追加します。いずれか1つを指定してください。

対応するBacklog APIについては「[スターの追加](https://developer.nulab.com/ja/docs/backlog/api/2/add-star/)」を参照してください。

## オプション

`--issue <string>`
: 課題キー

`--comment <int>`
: コメントID

`--wiki <int>`
: Wiki ID

`--pr-comment <int>`
: PRコメントID

## 使用例

```bash
backlog star add --issue PROJECT-123
backlog star add --wiki 12345
```
