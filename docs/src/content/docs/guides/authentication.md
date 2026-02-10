---
title: 認証
description: Backlog CLI の認証設定と複数スペースの管理
---

Backlog CLI を使うには、まず Backlog スペースへの認証が必要です。API キーと OAuth 2.0 の 2 つの認証方式に対応しています。

## 認証方式

### API キー

最もシンプルな認証方式です。Backlog の「個人設定 > API」ページから API キーを発行して使用します。

```bash
backlog auth login --method api-key
```

対話形式でホスト名と API キーの入力を求められます。パイプで API キーを渡すことも可能です。

```bash
echo "YOUR_API_KEY" | backlog auth login --with-token
```

### OAuth 2.0

ブラウザベースの認証フローで、API キーの手動管理が不要な認証方式です。

```bash
backlog auth login --method oauth
```

ブラウザが自動で開き、認証が完了するとトークンが保存されます。トークンの有効期限が切れた場合はリフレッシュできます。

```bash
backlog auth refresh
```

## 認証状態の確認

現在の認証状態を確認するには、次のコマンドを実行します。

```bash
backlog auth status
```

特定のスペースの認証状態を確認したい場合は `--space` フラグを指定します。

```bash
backlog auth status --space your-space.backlog.com
```

トークンの値を確認する場合は `--show-token` フラグを付けます。

```bash
backlog auth status --show-token
```

## 複数スペースの管理

複数の Backlog スペースに認証し、切り替えながら使うことができます。

```bash
# スペース A に認証
backlog auth login --space space-a.backlog.com

# スペース B に認証
backlog auth login --space space-b.backlog.com
```

### デフォルトスペースの切り替え

普段使うスペースを切り替えるには `auth switch` を使います。

```bash
backlog auth switch --space space-b.backlog.com
```

### コマンド実行時のスペース指定

`--space` グローバルフラグを使うと、デフォルトスペースを変更せずに一時的に別のスペースを対象にできます。

```bash
backlog issue list --project PROJ --space space-b.backlog.com
```

### スペース解決の優先順位

Backlog CLI は次の優先順位でスペースを決定します。

1. `--space` フラグ / `BACKLOG_SPACE` 環境変数 / 設定ファイルの `defaultSpace` + 設定ファイルの認証情報
2. `BACKLOG_API_KEY` + `BACKLOG_SPACE` 環境変数（フォールバック）

## 環境変数による認証（CI / AI エージェント向け）

`backlog auth login` を実行できない非インタラクティブ環境（CI パイプライン、AI エージェント等）では、環境変数だけで認証できます。

```bash
export BACKLOG_SPACE=your-space.backlog.com
export BACKLOG_API_KEY=your-api-key

# backlog auth login なしで利用可能
backlog issue list --project YOUR_PROJECT
```

:::note
`BACKLOG_API_KEY` による認証は、設定ファイル（`~/.backlogrc`）の認証情報より優先度が低く設計されています。設定ファイルにスペースが登録されている場合はそちらが使われます。
:::

CI 環境でのセットアップの詳細は [CI での利用ガイド](/guides/ci/) を参照してください。

## 認証情報の保存場所

認証情報は `~/.backlogrc` ファイルに保存されます。環境変数 `XDG_CONFIG_HOME` が設定されている場合は `$XDG_CONFIG_HOME/.backlogrc` に保存されます。

設定ファイルの管理には [rc9](https://github.com/unjs/rc9) を使用しています。

## ログアウト

スペースの認証情報を削除するには `auth logout` を使います。

```bash
# デフォルトスペースからログアウト
backlog auth logout

# 特定のスペースからログアウト
backlog auth logout --space your-space.backlog.com
```
