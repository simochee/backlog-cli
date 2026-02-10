---
title: backlog auth refresh
description: OAuth トークンをリフレッシュする
---

```
backlog auth refresh [flags]
```

OAuth 2.0 のアクセストークンをリフレッシュトークンを使って更新します。

## オプション

`-h`, `--hostname <string>` (default "アクティブスペース")
: 対象スペースのホスト名

## 使用例

```bash
# デフォルトスペースのトークンをリフレッシュ
backlog auth refresh

# 特定のスペースのトークンをリフレッシュ
backlog auth refresh --hostname your-space.backlog.com
```

## 関連コマンド

- [auth login](/commands/auth/login/)
- [auth status](/commands/auth/status/)
