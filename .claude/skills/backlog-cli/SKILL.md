---
name: backlog-cli
description: |
  Backlog プロジェクト管理ツールの CLI。課題の一覧・作成・編集・ステータス変更、プルリクエスト管理、Wiki 操作、プロジェクト情報の取得などを行う。
  ユーザーが Backlog の課題やプルリクエストについて言及した場合、またはプロジェクト管理操作を求めた場合にこのスキルを使用する。
allowed-tools: Bash, Read
---

# backlog-cli

Backlog（Nulab 社のプロジェクト管理プラットフォーム）のCLIツール。`backlog` コマンドで課題・PR・Wiki 等を操作する。

## 前提条件

- `backlog auth login` で認証済みであること
- `backlog auth status` で接続状態を確認できる
- 複数スペースを使う場合は `--space <hostname>` または環境変数 `BACKLOG_SPACE` で切り替える

## 重要な原則

### 対話プロンプトの回避

CLIの一部コマンドは未指定の必須フィールドを対話的に問い合わせる。**エージェントは対話プロンプトに対応できないため、必須フラグはすべて明示的に指定すること。**

### 名前解決

CLIはユーザーフレンドリーな名前を自動でIDに変換する:
- ステータス名（例: `処理中`、`完了`）→ ステータスID
- 課題種別名（例: `バグ`、`タスク`）→ 種別ID
- 優先度名（例: `高`、`中`、`低`）→ 優先度ID
- ユーザー名 → ユーザーID（`@me` で自分自身を指定可能）

**プロジェクトごとにステータス名・種別名は異なる。** 不明な場合は事前に一覧を取得すること:
```
backlog issue-type list -p PROJECT_KEY
backlog status-type list -p PROJECT_KEY
```

### 課題キーの形式

Backlogの課題キーは `PROJECT_KEY-数字` の形式（例: `PROJ-123`）。課題キーにはプロジェクト情報が含まれるため、`issue view` や `issue edit` では `--project` フラグ不要。

### 出力形式

デフォルトはテーブル形式（人間向け）。構造化データが必要な場合は `--json` を使用する。
`backlog api` コマンドの出力は常にJSON。

## よく使うワークフロー

### 課題の確認と作業開始

```bash
# プロジェクトの課題種別・ステータスを確認（初回のみ）
backlog issue-type list -p PROJECT_KEY
backlog status-type list -p PROJECT_KEY

# 自分に割り当てられた未完了課題を一覧
backlog issue list -p PROJECT_KEY -a @me -S "未対応,処理中"

# 課題の詳細を確認（コメント付き）
backlog issue view PROJ-123 --comments

# 作業開始: ステータスを「処理中」に変更
backlog issue edit PROJ-123 -S "処理中" -c "対応開始します"
```

### 課題の作成

```bash
backlog issue create \
  -p PROJECT_KEY \
  -t "課題タイトル" \
  -T "タスク" \
  -P "中" \
  -a @me \
  -d "課題の詳細説明"
```

必須フィールド: `-p`（プロジェクト）、`-t`（タイトル）、`-T`（種別）、`-P`（優先度）

### 課題のクローズ

```bash
backlog issue close PROJ-123 -c "対応完了しました"
```

### 課題へのコメント

```bash
backlog issue comment PROJ-123 -b "進捗報告: 実装完了、テスト中です"
```

### プルリクエストの作成

```bash
backlog pr create \
  -p PROJECT_KEY \
  -R repository-name \
  -t "PRタイトル" \
  -b "PRの説明" \
  -B main \
  --branch feature/my-branch \
  --issue PROJ-123 \
  -a @me
```

必須フィールド: `-p`（プロジェクト）、`-R`（リポジトリ）、`-t`（タイトル）、`-B`（ベースブランチ）、`--branch`（ソースブランチ）

### プルリクエストの確認とマージ

```bash
# PR一覧
backlog pr list -p PROJECT_KEY -R repository-name

# PR詳細（コメント付き）
backlog pr view -p PROJECT_KEY -R repository-name 42 --comments

# PRにコメント
backlog pr comment -p PROJECT_KEY -R repository-name 42 -b "LGTM"

# PRマージ
backlog pr merge -p PROJECT_KEY -R repository-name 42
```

### Wiki操作

```bash
# Wiki一覧
backlog wiki list -p PROJECT_KEY

# Wiki閲覧
backlog wiki view <wiki-id>

# Wiki作成
backlog wiki create -p PROJECT_KEY -n "ページ名" -b "ページ内容"

# Wiki編集
backlog wiki edit <wiki-id> -n "新しいページ名" -b "更新された内容"
```

### プロジェクト情報の取得

```bash
# プロジェクト一覧
backlog project list

# プロジェクト詳細
backlog project view PROJECT_KEY

# プロジェクトメンバー一覧
backlog project users PROJECT_KEY

# カテゴリ一覧
backlog category list -p PROJECT_KEY

# マイルストーン一覧
backlog milestone list -p PROJECT_KEY
```

### 通知の確認

```bash
# 未読通知数
backlog notification count

# 通知一覧
backlog notification list

# 全通知を既読にする
backlog notification read-all
```

### 汎用APIアクセス

CLIコマンドでカバーされていない操作は `backlog api` で直接実行可能:

```bash
# GET リクエスト
backlog api /projects/PROJECT_KEY/statuses

# POST リクエスト（フィールド指定）
backlog api /issues -X POST -f "projectId=12345" -f "summary=新しい課題"

# 全件取得（ページネーション自動処理）
backlog api /issues --paginate -f "projectId[]=12345"
```

`/api/v2` プレフィックスは省略可能。

## コマンドリファレンス

詳細なコマンド引数やデータモデルのスキーマは [reference.md](./reference.md) を参照。
