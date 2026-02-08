---
title: 設定
description: Backlog CLI の設定管理
---

Backlog CLI の設定は `~/.backlogrc` ファイルで管理されます。

## 設定の表示

すべての設定を表示するには、次のコマンドを実行します。

```bash
backlog config list
```

特定の値を取得するには、次のコマンドを実行します。

```bash
backlog config get default_space
```

## 設定の変更

```bash
backlog config set default_space your-space.backlog.com
```

## 設定キー

| キー | 説明 |
|------|------|
| `default_space` | デフォルトの Backlog スペースホスト名 |

## スペース固有の設定

`--hostname` フラグで特定のスペースに対する設定を管理できます。

```bash
# スペース固有の設定を取得
backlog config get pager --hostname your-space.backlog.com

# スペース固有の設定を変更
backlog config set pager less --hostname your-space.backlog.com

# スペース固有の設定を一覧
backlog config list --hostname your-space.backlog.com
```

## 環境変数

| 環境変数 | 説明 |
|----------|------|
| `BACKLOG_SPACE` | 使用するスペースのホスト名（`--space` フラグと同等） |
| `BACKLOG_PROJECT` | デフォルトのプロジェクトキー（`--project` フラグと同等） |

### `BACKLOG_PROJECT`

`BACKLOG_PROJECT` 環境変数を設定すると、`--project` フラグを省略できます。

```bash
export BACKLOG_PROJECT=MY_PROJECT

# --project を省略可能
backlog issue list
backlog milestone list
backlog pr list --repo my-repo
```

`--project` フラグが明示的に指定された場合は、環境変数より優先されます。
