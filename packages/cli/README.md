# @simochee/backlog-cli

[Backlog](https://backlog.com/) をコマンドラインから操作するための CLI ツールです。[GitHub CLI (gh)](https://cli.github.com/) のインターフェースを参考に設計されています。

## インストール

```bash
npm install -g @simochee/backlog-cli
```

## クイックスタート

### 認証

まず Backlog スペースに認証します。

```bash
backlog auth login
```

対話形式でホスト名と認証方式を選択できます。API キーを使う場合は以下のように指定します。

```bash
backlog auth login --hostname your-space.backlog.com --method api-key
```

### 基本操作

```bash
# 課題の一覧
backlog issue list --project YOUR_PROJECT

# 課題の作成
backlog issue create --project YOUR_PROJECT --title "新しい課題" --type バグ --priority 高

# 課題の詳細
backlog issue view PROJECT-123

# プロジェクトの一覧
backlog project list

# 通知の確認
backlog notification list

# ダッシュボード
backlog status
```

## コマンド一覧

| コマンド               | 説明                       |
| ---------------------- | -------------------------- |
| `backlog auth`         | 認証の管理                 |
| `backlog config`       | CLI の設定管理             |
| `backlog issue`        | 課題の操作                 |
| `backlog pr`           | プルリクエストの操作       |
| `backlog project`      | プロジェクトの操作         |
| `backlog repo`         | Git リポジトリの操作       |
| `backlog notification` | 通知の操作                 |
| `backlog wiki`         | Wiki の操作                |
| `backlog user`         | ユーザーの操作             |
| `backlog team`         | チームの操作               |
| `backlog category`     | カテゴリーの操作           |
| `backlog milestone`    | マイルストーンの操作       |
| `backlog issue-type`   | 種別の操作                 |
| `backlog status-type`  | 状態の操作                 |
| `backlog space`        | スペースの操作             |
| `backlog webhook`      | Webhook の操作             |
| `backlog star`         | スターの操作               |
| `backlog watching`     | ウォッチの操作             |
| `backlog alias`        | エイリアスの操作           |
| `backlog status`       | ダッシュボードの表示       |
| `backlog browse`       | ブラウザで開く             |
| `backlog api`          | Backlog API の直接呼び出し |
| `backlog completion`   | シェル補完スクリプトの生成 |

## 環境変数

| 環境変数          | 説明                                                     |
| ----------------- | -------------------------------------------------------- |
| `BACKLOG_SPACE`   | 使用するスペースのホスト名（`--space` フラグと同等）     |
| `BACKLOG_PROJECT` | デフォルトのプロジェクトキー（`--project` フラグと同等） |

```bash
export BACKLOG_PROJECT=YOUR_PROJECT

# --project を省略可能
backlog issue list
backlog milestone list
```

## 出力形式

デフォルトではテーブル形式で出力されます。JSON 形式で取得する場合は `--json` フラグを使用します。

```bash
backlog issue list --project YOUR_PROJECT --json
```

## ドキュメント

詳細なドキュメントは https://simochee.github.io/backlog-cli を参照してください。

## ライセンス

[MIT](../../LICENSE)
