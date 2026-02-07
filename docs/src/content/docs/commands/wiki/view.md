---
title: backlog wiki view
description: Wiki ページの詳細を表示する
---

```
backlog wiki view <wiki-id> [flags]
```

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<wiki-id>` | number | Yes | Wiki ページ ID |

## オプション

| フラグ | 型 | 説明 |
|--------|------|------|
| `--web` | boolean | ブラウザで開く |

## 使用例

```bash
backlog wiki view 12345
backlog wiki view 12345 --web
```
