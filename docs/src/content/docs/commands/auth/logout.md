---
title: backlog auth logout
description: 認証情報を削除する
---

```
backlog auth logout [flags]
```

指定したスペースの認証情報を設定ファイルから削除します。

## オプション

| フラグ | 短縮 | 型 | デフォルト | 説明 |
|--------|------|------|------------|------|
| `--hostname` | `-h` | string | アクティブスペース | 対象スペースのホスト名 |

## 使用例

```bash
# デフォルトスペースからログアウト
backlog auth logout

# 特定のスペースからログアウト
backlog auth logout --hostname your-space.backlog.com
```

## 関連コマンド

- [auth login](/backlog-cli/commands/auth/login/)
- [auth status](/backlog-cli/commands/auth/status/)
