---
title: backlog auth login
description: Backlog スペースに認証する
---

```
backlog auth login [flags]
```

Backlog スペースに対して認証します。API キーまたは OAuth 2.0 による認証をサポートしています。

## オプション

`-s`, `--space <string>`
: スペースホスト名（例: `xxx.backlog.com`）

`-m`, `--method <string>` (default "api-key")
: 認証方式: {api-key|oauth}

`--with-token`
: 標準入力からトークンを読み込む

## 使用例

### 対話形式で認証

```bash
backlog auth login
```

### API キーで認証

```bash
backlog auth login --space your-space.backlog.com --method api-key
```

### 標準入力からトークンを渡す

```bash
echo "YOUR_API_KEY" | backlog auth login --space your-space.backlog.com --with-token
```

### OAuth 2.0 で認証

```bash
backlog auth login --space your-space.backlog.com --method oauth
```

## 関連コマンド

- [auth logout](/backlog-cli/commands/auth/logout/)
- [auth status](/backlog-cli/commands/auth/status/)
