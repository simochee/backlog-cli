---
title: backlog issue reopen
description: 課題を再オープンする
---

```
backlog issue reopen <issue-key> [flags]
```

完了した課題を「未対応」ステータスに戻します。

## 引数

| 引数          | 型     | 必須 | 説明                          |
| ------------- | ------ | ---- | ----------------------------- |
| `<issue-key>` | string | Yes  | 課題キー（例: `PROJECT-123`） |

## オプション

| フラグ      | 短縮 | 型     | 説明               |
| ----------- | ---- | ------ | ------------------ |
| `--comment` | `-c` | string | 再オープンコメント |

## 使用例

```bash
# 課題を再オープン
backlog issue reopen PROJECT-123

# コメント付きで再オープン
backlog issue reopen PROJECT-123 --comment "再現しました"
```

## 関連コマンド

- [issue close](/backlog-cli/commands/issue/close/)
- [issue edit](/backlog-cli/commands/issue/edit/)
