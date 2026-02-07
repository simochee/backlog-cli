---
title: backlog wiki delete
description: Wiki ページを削除する
---

```
backlog wiki delete <wiki-id> [flags]
```

## 引数

| 引数        | 型     | 必須 | 説明      |
| ----------- | ------ | ---- | --------- |
| `<wiki-id>` | number | Yes  | ページ ID |

## オプション

| フラグ      | 型      | 説明                     |
| ----------- | ------- | ------------------------ |
| `--confirm` | boolean | 確認プロンプトをスキップ |

## 使用例

```bash
backlog wiki delete 12345
backlog wiki delete 12345 --confirm
```
