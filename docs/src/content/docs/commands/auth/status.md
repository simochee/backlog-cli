---
title: backlog auth status
description: 認証状態を表示する
---

```
backlog auth status [flags]
```

認証済みスペースの認証状態を表示します。

## オプション

`-h`, `--hostname <string>` (default "全スペース")
: 対象スペースのホスト名

`--show-token`
: トークンを表示する

## 使用例

```bash
# 全スペースの認証状態を表示
backlog auth status

# 特定のスペースの認証状態を表示
backlog auth status --hostname your-space.backlog.com

# トークンを表示
backlog auth status --show-token
```

## 関連コマンド

- [auth login](/commands/auth/login/)
- [auth token](/commands/auth/token/)
