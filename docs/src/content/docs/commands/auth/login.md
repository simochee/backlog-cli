---
title: backlog auth login
description: Backlog スペースに認証する
---

```
backlog auth login [flags]
```

Backlog スペースに対して認証を行います。API キーまたは OAuth 2.0 による認証をサポートしています。

## オプション

| フラグ | 短縮 | 型 | デフォルト | 説明 |
|--------|------|------|------------|------|
| `--hostname` | `-h` | string | — | スペースホスト名（例: `xxx.backlog.com`） |
| `--method` | `-m` | string | `api-key` | 認証方式（`api-key` / `oauth`） |
| `--with-token` | | boolean | `false` | 標準入力からトークンを読み込む |

## 使用例

### 対話形式で認証

```bash
backlog auth login
```

### API キーで認証

```bash
backlog auth login --hostname your-space.backlog.com --method api-key
```

### 標準入力からトークンを渡す

```bash
echo "YOUR_API_KEY" | backlog auth login --hostname your-space.backlog.com --with-token
```

### OAuth 2.0 で認証

```bash
backlog auth login --hostname your-space.backlog.com --method oauth
```

## 関連コマンド

- [auth logout](/backlog-cli/commands/auth/logout/)
- [auth status](/backlog-cli/commands/auth/status/)
