---
title: backlog auth status
description: 認証状態を表示する
---

```
backlog auth status [flags]
```

認証済みスペースの認証状態を表示します。

## オプション

`-s`, `--space <string>` (default "全スペース")
: 対象スペースのホスト名

`--show-token`
: トークンを表示する

## 使用例

```bash
# 全スペースの認証状態を表示
backlog auth status

# 特定のスペースの認証状態を表示
backlog auth status --space your-space.backlog.com

# トークンを表示
backlog auth status --show-token
```

## 関連コマンド

- [auth login](/backlog-cli/commands/auth/login/)
- [auth token](/backlog-cli/commands/auth/token/)
