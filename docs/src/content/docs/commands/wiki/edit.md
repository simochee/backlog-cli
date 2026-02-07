---
title: backlog wiki edit
description: Wiki ページを編集する
---

```
backlog wiki edit <wiki-id> [flags]
```

## 引数

| 引数        | 型     | 必須 | 説明      |
| ----------- | ------ | ---- | --------- |
| `<wiki-id>` | number | Yes  | ページ ID |

## オプション

| フラグ     | 短縮 | 型      | 説明       |
| ---------- | ---- | ------- | ---------- |
| `--name`   | `-n` | string  | ページ名   |
| `--body`   | `-b` | string  | 本文       |
| `--notify` |      | boolean | メール通知 |

## 使用例

```bash
backlog wiki edit 12345 --name "新しいタイトル"
backlog wiki edit 12345 --body "更新された内容"
```
