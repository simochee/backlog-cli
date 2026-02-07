---
title: backlog auth refresh
description: OAuth トークンをリフレッシュする
---

```
backlog auth refresh [flags]
```

OAuth 2.0 のアクセストークンをリフレッシュトークンを使って更新します。

## オプション

| フラグ | 短縮 | 型 | デフォルト | 説明 |
|--------|------|------|------------|------|
| `--hostname` | `-h` | string | アクティブスペース | 対象スペースのホスト名 |

## 使用例

```bash
# デフォルトスペースのトークンをリフレッシュ
backlog auth refresh

# 特定のスペースのトークンをリフレッシュ
backlog auth refresh --hostname your-space.backlog.com
```

## 関連コマンド

- [auth login](/backlog-cli/commands/auth/login/)
- [auth status](/backlog-cli/commands/auth/status/)
