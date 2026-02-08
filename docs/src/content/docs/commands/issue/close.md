---
title: backlog issue close
description: 課題を完了にする
---

```
backlog issue close <issue-key> [flags]
```

課題のステータスを「完了」に変更します。

## 引数

`<issue-key> <string>`
: 課題キー（例: `PROJECT-123`）

## オプション

`-c`, `--comment <string>`
: 完了コメント

`-r`, `--resolution <string>`
: 完了理由名

## 使用例

```bash
# 課題を完了にする
backlog issue close PROJECT-123

# コメント付きで完了
backlog issue close PROJECT-123 --comment "修正をリリースしました"

# 完了理由を指定
backlog issue close PROJECT-123 --resolution 対応済み
```

## 関連コマンド

- [issue reopen](/backlog-cli/commands/issue/reopen/)
- [issue edit](/backlog-cli/commands/issue/edit/)
