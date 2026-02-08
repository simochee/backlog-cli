---
title: backlog pr status
description: 自分のプルリクエストの状態を表示する
---

```
backlog pr status [flags]
```

自分に割り当てられたプルリクエストの状態を表示します。

## オプション

`-p`, `--project <string>`
: プロジェクトキー（env: `BACKLOG_PROJECT`）

`-R`, `--repo <string>`
: リポジトリ名

## 使用例

```bash
backlog pr status --project PROJ --repo my-repo
```

## 関連コマンド

- [pr list](/backlog-cli/commands/pr/list/)
- [status](/backlog-cli/commands/status/)
