---
title: backlog star add
description: スターを追加する
---

```
backlog star add [flags]
```

課題、コメント、Wiki ページ、PR コメントにスターを追加します。いずれか1つを指定してください。

## オプション

| フラグ         | 型     | 説明           |
| -------------- | ------ | -------------- |
| `--issue`      | string | 課題キー       |
| `--comment`    | number | コメント ID    |
| `--wiki`       | number | Wiki ID        |
| `--pr-comment` | number | PR コメント ID |

## 使用例

```bash
backlog star add --issue PROJECT-123
backlog star add --wiki 12345
```
