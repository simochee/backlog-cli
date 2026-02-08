---
name: backlog-cli
description: |
  Backlog プロジェクト管理の CLI ツール。以下の操作を行うときに使用する:
  (1) 課題の一覧取得・作成・編集・ステータス変更・コメント追加
  (2) プルリクエストの作成・一覧・マージ・コメント
  (3) Wiki ページの閲覧・作成・編集
  (4) プロジェクト設定の参照（課題種別・ステータス・カテゴリ・マイルストーン・メンバー）
  (5) 通知の確認、スター、ウォッチ等の補助操作
  (6) backlog api コマンドによる汎用 API リクエスト
---

# backlog-cli

`backlog` コマンドで Backlog（Nulab）のプロジェクト管理操作を行う CLI。

## 認証

事前に `backlog auth login` で認証が必要。`backlog auth status` で確認できる。
複数スペースは `--space <hostname>` または環境変数 `BACKLOG_SPACE` で切り替える。

## 重要な概念

### 対話プロンプトの回避

一部コマンドは未指定の必須フィールドを対話的に問い合わせる。エージェント利用時は**必須フラグをすべて明示的に指定**すること。

### 名前解決

CLI はユーザーフレンドリーな名前を自動で ID に変換する:

- ステータス名（`処理中`、`完了`）→ ID
- 課題種別名（`バグ`、`タスク`）→ ID
- 優先度名（`高`、`中`、`低`）→ ID
- ユーザー名 → ID（`@me` で自分自身）

**ステータス名・種別名はプロジェクトごとに異なる。** 不明な場合は先に確認する:

```bash
backlog issue-type list -p PROJECT_KEY
backlog status-type list -p PROJECT_KEY
```

### 課題キー

`PROJECT_KEY-数字` の形式（例: `PROJ-123`）。課題キーにプロジェクト情報を含むため、`issue view` / `issue edit` では `--project` 不要。

### プロジェクトキーの指定

`--project`（`-p`）フラグまたは環境変数 `BACKLOG_PROJECT` で指定する。

## 主要ワークフロー

### 課題操作

```bash
# 一覧（自分の未完了課題）
backlog issue list -p PROJ -a @me -S "未対応,処理中"

# 詳細確認（コメント付き）
backlog issue view PROJ-123 --comments

# 作成（必須: -p, -t, -T, -P）
backlog issue create -p PROJ -t "タイトル" -T "タスク" -P "中" -a @me -d "説明"

# ステータス変更＋コメント
backlog issue edit PROJ-123 -S "処理中" -c "対応開始"

# クローズ
backlog issue close PROJ-123 -c "完了"

# コメント追加
backlog issue comment PROJ-123 -b "進捗報告"
```

### プルリクエスト操作

```bash
# 作成（必須: -p, -R, -t, -B, --branch）
backlog pr create -p PROJ -R repo -t "PRタイトル" -B main --branch feat/xxx --issue PROJ-123

# 一覧
backlog pr list -p PROJ -R repo

# 詳細
backlog pr view -p PROJ -R repo 42 --comments

# マージ
backlog pr merge -p PROJ -R repo 42
```

### プロジェクト情報

```bash
backlog project list                  # プロジェクト一覧
backlog project users PROJECT_KEY     # メンバー一覧
backlog category list -p PROJ         # カテゴリ一覧
backlog milestone list -p PROJ        # マイルストーン一覧
```

### Wiki

```bash
backlog wiki list -p PROJ
backlog wiki view <wiki-id>
backlog wiki create -p PROJ -n "ページ名" -b "内容"
backlog wiki edit <wiki-id> -b "更新内容"
```

### 汎用 API

CLI コマンドでカバーされない操作に使用。`/api/v2` プレフィックスは省略可。

```bash
backlog api /issues -X POST -f "projectId=123" -f "summary=新規課題"
backlog api /issues --paginate -f "projectId[]=123"
```

## リファレンス

- **全コマンド引数の詳細**: [references/commands.md](./references/commands.md)
- **データモデル（スキーマ型）**: [references/schema.md](./references/schema.md)
