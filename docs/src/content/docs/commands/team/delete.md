---
title: backlog team delete
description: チームを削除する
---

```
backlog team delete <team-id> [flags]
```

## 引数

| 引数        | 型     | 必須 | 説明      |
| ----------- | ------ | ---- | --------- |
| `<team-id>` | number | Yes  | チーム ID |

## オプション

| フラグ      | 型      | 説明                     |
| ----------- | ------- | ------------------------ |
| `--confirm` | boolean | 確認プロンプトをスキップ |

## 使用例

```bash
backlog team delete 12345
backlog team delete 12345 --confirm
```
