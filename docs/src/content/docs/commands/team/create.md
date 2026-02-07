---
title: backlog team create
description: チームを作成する
---

```
backlog team create [flags]
```

## オプション

| フラグ | 短縮 | 型 | 必須 | 説明 |
|--------|------|------|------|------|
| `--name` | `-n` | string | Yes | チーム名 |
| `--members` | | string | No | メンバー ID（カンマ区切り） |

## 使用例

```bash
backlog team create --name "開発チーム"
backlog team create --name "開発チーム" --members 123,456,789
```
