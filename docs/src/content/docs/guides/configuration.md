---
title: 設定
description: Backlog CLI の設定管理と環境変数
---

Backlog CLIの設定は `~/.backlogrc` ファイルで管理されます。`backlog config` コマンドで設定の確認と変更ができます。

環境変数 `XDG_CONFIG_HOME` が設定されている場合、設定ファイルの場所は `$XDG_CONFIG_HOME/.backlogrc` になります。

## 設定の確認

すべての設定を一覧表示します。

```bash
backlog config list
```

特定の設定値を取得するには `config get` を使います。

```bash
backlog config get default_space
```

## 設定の変更

```bash
backlog config set default_space your-space.backlog.com
```

## 設定キー

| キー            | 説明                                  |
| --------------- | ------------------------------------- |
| `default_space` | デフォルトの Backlog スペースホスト名 |

## スペース固有の設定

`--space` フラグを使うと、スペースごとに異なる設定を管理できます。

```bash
# スペース固有の設定を取得
backlog config get pager --space your-space.backlog.com

# スペース固有の設定を変更
backlog config set pager less --space your-space.backlog.com

# スペース固有の設定を一覧
backlog config list --space your-space.backlog.com
```

## 環境変数

環境変数を使うと、設定ファイルやコマンドフラグを省略できます。

| 環境変数          | 説明                                                     | 対応するフラグ |
| ----------------- | -------------------------------------------------------- | -------------- |
| `BACKLOG_SPACE`   | 使用するスペースのホスト名                               | `--space`      |
| `BACKLOG_PROJECT` | デフォルトのプロジェクトキー                             | `--project`    |
| `BACKLOG_API_KEY` | API キー（CI / AI ワークフロー向けのフォールバック認証） | —              |

### `BACKLOG_PROJECT` の活用

`BACKLOG_PROJECT` を設定すると、プロジェクトを必要とするコマンドで `--project` フラグを省略できます。特定のプロジェクトを集中的に操作する場面で便利です。

```bash
export BACKLOG_PROJECT=MY_PROJECT

# --project を省略可能
backlog issue list
backlog milestone list
backlog pr list --repo my-repo
```

`--project` フラグが明示的に指定された場合は、環境変数より優先されます。
