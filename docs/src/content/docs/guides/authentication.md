---
title: 認証
description: Backlog CLI の認証設定と複数スペースの管理
---

Backlog CLI は API キーと OAuth 2.0 の2つの認証方式をサポートしています。

## 認証方式

### API キー

最もシンプルな認証方式です。Backlog の個人設定から API キーを発行して使用します。

```bash
backlog auth login --method api-key
```

パイプで API キーを渡すこともできます。

```bash
echo "YOUR_API_KEY" | backlog auth login --with-token
```

### OAuth 2.0

OAuth 2.0 による認証も利用可能です。

```bash
backlog auth login --method oauth
```

OAuth トークンの有効期限が切れた場合はリフレッシュできます。

```bash
backlog auth refresh
```

## 認証状態の確認

```bash
backlog auth status
```

特定のスペースの認証状態を確認する場合:

```bash
backlog auth status --hostname your-space.backlog.com
```

トークンを表示する場合:

```bash
backlog auth status --show-token
```

## 複数スペースの管理

複数の Backlog スペースに認証することができます。

```bash
# スペース A に認証
backlog auth login --hostname space-a.backlog.com

# スペース B に認証
backlog auth login --hostname space-b.backlog.com
```

### デフォルトスペースの切り替え

```bash
backlog auth switch --hostname space-b.backlog.com
```

### コマンド実行時のスペース指定

`--space` グローバルフラグで一時的にスペースを切り替えられます。

```bash
backlog issue list --project PROJ --space space-b.backlog.com
```

### スペース解決の優先順位

1. `--space` フラグ
2. `BACKLOG_SPACE` 環境変数
3. 設定ファイルの `defaultSpace`

## 認証情報の保存場所

認証情報は `~/.backlogrc` ファイルに保存されます。

## ログアウト

```bash
# デフォルトスペースからログアウト
backlog auth logout

# 特定のスペースからログアウト
backlog auth logout --hostname your-space.backlog.com
```
