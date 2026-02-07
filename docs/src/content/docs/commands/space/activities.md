---
title: backlog space activities
description: スペースのアクティビティを表示する
---

```
backlog space activities [flags]
```

スペース全体の最近のアクティビティを表示します。

## オプション

| フラグ            | 短縮 | 型     | デフォルト | 説明                                    |
| ----------------- | ---- | ------ | ---------- | --------------------------------------- |
| `--limit`         | `-L` | number | `20`       | 取得件数                                |
| `--activity-type` |      | string | —          | アクティビティタイプ ID（カンマ区切り） |

## 使用例

```bash
backlog space activities
backlog space activities --limit 50
```
