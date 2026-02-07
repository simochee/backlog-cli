---
title: backlog status-type edit
description: ステータスを編集する
---

```
backlog status-type edit <id> [flags]
```

## 引数

| 引数   | 型     | 必須 | 説明          |
| ------ | ------ | ---- | ------------- |
| `<id>` | number | Yes  | ステータス ID |

## オプション

| フラグ      | 短縮 | 型     | 説明                                       |
| ----------- | ---- | ------ | ------------------------------------------ |
| `--project` | `-p` | string | プロジェクトキー（env: `BACKLOG_PROJECT`） |
| `--name`    | `-n` | string | ステータス名                               |
| `--color`   |      | string | 表示色（`#hex` 形式）                      |

## 使用例

```bash
backlog status-type edit 12345 --project PROJ --name "確認待ち"
```
