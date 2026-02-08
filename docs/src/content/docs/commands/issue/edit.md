---
title: backlog issue edit
description: 課題を編集する
---

```
backlog issue edit <issue-key> [flags]
```

既存の課題を編集します。指定したフィールドのみ更新されます。

## 引数

`<issue-key> <string>`
: 課題キー（例: `PROJECT-123`）

## オプション

`-t`, `--title <string>`
: 件名

`-d`, `--description <string>`
: 詳細

`-S`, `--status <string>`
: ステータス名

`-T`, `--type <string>`
: 課題種別名

`-P`, `--priority <string>`
: 優先度名

`-a`, `--assignee <string>`
: 担当者

`-c`, `--comment <string>`
: 更新コメント

## 使用例

```bash
# ステータスを変更
backlog issue edit PROJECT-123 --status 処理中

# 担当者と優先度を変更
backlog issue edit PROJECT-123 --assignee yamada --priority 高

# コメント付きで更新
backlog issue edit PROJECT-123 --status 処理済み --comment "対応完了しました"
```

## 関連コマンド

- [issue view](/backlog-cli/commands/issue/view/)
- [issue close](/backlog-cli/commands/issue/close/)
