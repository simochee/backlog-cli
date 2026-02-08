---
title: backlog auth token
description: 認証トークンを標準出力に表示する
---

```
backlog auth token [flags]
```

認証トークンを標準出力に出力します。スクリプトや他のツールとの連携に使用します。

## オプション

`-h`, `--hostname <string>` (default "アクティブスペース")
: 対象スペースのホスト名

## 使用例

```bash
# トークンを表示
backlog auth token

# 特定のスペースのトークンを表示
backlog auth token --hostname your-space.backlog.com

# 他のコマンドにトークンを渡す
curl -H "X-Api-Key: $(backlog auth token)" https://your-space.backlog.com/api/v2/users/myself
```

## 関連コマンド

- [auth status](/backlog-cli/commands/auth/status/)
- [auth login](/backlog-cli/commands/auth/login/)
