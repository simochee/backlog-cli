---
title: backlog issue comment
description: 課題にコメントを追加する
---

```
backlog issue comment <issue-key> [flags]
```

課題にコメントを追加します。`--body` を省略するとエディタが起動します。

## 引数

| 引数 | 型 | 必須 | 説明 |
|------|------|------|------|
| `<issue-key>` | string | Yes | 課題キー（例: `PROJECT-123`） |

## オプション

| フラグ | 短縮 | 型 | 説明 |
|--------|------|------|------|
| `--body` | `-b` | string | コメント本文（`-` で標準入力） |

## 使用例

```bash
# コメントを追加
backlog issue comment PROJECT-123 --body "確認しました"

# 標準入力から本文を読み込む
echo "対応中です" | backlog issue comment PROJECT-123 --body -
```

## 関連コマンド

- [issue view](/backlog-cli/commands/issue/view/)
- [issue edit](/backlog-cli/commands/issue/edit/)
