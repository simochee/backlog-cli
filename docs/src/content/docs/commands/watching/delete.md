---
title: backlog watching delete
description: ウォッチを削除する
---

```
backlog watching delete <watching-id> [flags]
```

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<watching-id>` | number | Yes | ウォッチ ID |

## オプション

| フラグ | 型 | 説明 |
|--------|------|------|
| `--confirm` | boolean | 確認プロンプトをスキップ |

## 使用例

```bash
backlog watching delete 12345
backlog watching delete 12345 --confirm
```
