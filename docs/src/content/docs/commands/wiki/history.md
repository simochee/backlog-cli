---
title: backlog wiki history
description: Wiki ページの編集履歴を表示する
---

```
backlog wiki history <wiki-id> [flags]
```

## 引数

| 引数        | 型     | 必須 | 説明      |
| ----------- | ------ | ---- | --------- |
| `<wiki-id>` | number | Yes  | ページ ID |

## オプション

| フラグ     | 短縮 | 型     | デフォルト | 説明       |
| ---------- | ---- | ------ | ---------- | ---------- |
| `--limit`  | `-L` | number | `20`       | 取得件数   |
| `--offset` |      | number | `0`        | オフセット |

## 使用例

```bash
backlog wiki history 12345
backlog wiki history 12345 --limit 50
```
