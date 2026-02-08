# backlog-cli Agent Skills 計画

## 概要

backlog-cli を coding agent（Claude Code 等）が効果的に利用するためのスキル群を整備する。
スキルは `.claude/skills/` ディレクトリに配置し、エージェントがBacklogの課題管理・PR管理・プロジェクト情報取得を自律的に行えるようにする。

---

## 前提: コーディングエージェントのワークフロー

エージェントがbacklog-cliを使う典型的なシナリオ:

1. **課題を確認** → 何を実装すべきか理解する
2. **コード実装** → 課題の要件に基づいて開発
3. **進捗報告** → 課題にコメント、ステータス更新
4. **PR作成** → 実装完了後にプルリクエストを作成
5. **課題クローズ** → 完了した課題を閉じる

---

## スキル一覧

### Tier 1: 必須スキル（コーディングエージェントの基本ワークフロー）

#### 1. `backlog-issue` — 課題管理

**目的**: 課題の一覧取得・詳細表示・作成・編集・ステータス変更・コメント追加

**user-invocable**: true（`/backlog-issue` で呼び出し可能）

**スキルが教えること**:

- `backlog issue list` のフィルタリングオプション（プロジェクト、担当者、ステータス、種別、優先度、キーワード、日付範囲）
- `backlog issue view <KEY> --comments` で詳細とコメント取得
- `backlog issue create` の必須フィールド（プロジェクト、タイトル、種別、優先度）とオプションフィールド
- `backlog issue edit <KEY>` でステータス・担当者・優先度などを変更
- `backlog issue close <KEY>` / `backlog issue reopen <KEY>` でステータス遷移
- `backlog issue comment <KEY>` でコメント追加
- 名前解決の仕組み（ステータス名・種別名・優先度名・ユーザー名をそのまま渡せる、`@me` の利用）
- `--json` フラグでJSON出力を得る方法

**ユースケース例**:

```
# 自分に割り当てられた未完了課題を確認
backlog issue list -p PROJECT -a @me -S "未対応,処理中"

# 課題の詳細とコメントを確認
backlog issue view PROJECT-123 --comments

# 課題を作成
backlog issue create -p PROJECT -t "バグ修正: ログイン画面のエラー" -T "バグ" -P "高" -a @me

# ステータスを「処理中」に変更してコメント追加
backlog issue edit PROJECT-123 -S "処理中" -c "対応開始します"

# 課題を閉じる
backlog issue close PROJECT-123
```

---

#### 2. `backlog-pr` — プルリクエスト管理

**目的**: PRの一覧・詳細表示・作成・編集・マージ・コメント

**user-invocable**: true（`/backlog-pr` で呼び出し可能）

**スキルが教えること**:

- `backlog pr create` の必須フィールド（プロジェクト、リポジトリ、タイトル、ベースブランチ、ソースブランチ）
- `--issue` フラグで課題との紐付け
- `backlog pr list` でのフィルタリング
- `backlog pr view` での詳細確認
- `backlog pr merge` でのマージ操作
- `backlog pr comment` でレビューコメント追加

**ユースケース例**:

```
# PR作成（課題紐付けあり）
backlog pr create -p PROJECT -R repo-name -t "feat: ログイン画面のバグ修正" -B main --branch fix/login-error --issue PROJECT-123

# PRの一覧
backlog pr list -p PROJECT -R repo-name -S open

# PRの詳細確認
backlog pr view -p PROJECT -R repo-name 42

# PRをマージ
backlog pr merge -p PROJECT -R repo-name 42
```

---

#### 3. `backlog-project-context` — プロジェクト情報の取得

**目的**: エージェントがプロジェクト固有の設定値（課題種別、ステータス、カテゴリ、マイルストーン等）を把握するための情報取得

**user-invocable**: false（エージェントが自動的に参照。ただし `/backlog-project-context` としても使えると便利）

**スキルが教えること**:

- `backlog issue-type list -p PROJECT` で利用可能な課題種別を確認
- `backlog status-type list -p PROJECT` で利用可能なステータスを確認
- `backlog category list -p PROJECT` でカテゴリ一覧
- `backlog milestone list -p PROJECT` でマイルストーン一覧
- `backlog user list` / `backlog project users -p PROJECT` でメンバー一覧
- `backlog project view PROJECT` でプロジェクト詳細
- これらの情報を事前に取得し、課題作成・編集時に正しい値を使うべきであること

**重要性**: Backlogではステータス名・課題種別名がプロジェクトごとにカスタマイズされている。エージェントが正しい名前を使うためには、事前にこれらを確認する必要がある。

---

### Tier 2: 生産性向上スキル

#### 4. `backlog-wiki` — Wiki管理

**目的**: プロジェクトのWikiページの閲覧・作成・編集

**user-invocable**: true（`/backlog-wiki`）

**スキルが教えること**:

- `backlog wiki list -p PROJECT` でWikiページ一覧
- `backlog wiki view <ID>` で内容取得
- `backlog wiki create` で新規作成
- `backlog wiki edit <ID>` で編集
- 設計ドキュメントやADRの参照・更新に利用

---

#### 5. `backlog-notification` — 通知管理

**目的**: 未読通知の確認と処理

**user-invocable**: true（`/backlog-notification`）

**スキルが教えること**:

- `backlog notification count` で未読数確認
- `backlog notification list` で通知一覧
- `backlog notification read <ID>` で既読化

---

#### 6. `backlog-status` — ダッシュボード

**目的**: プロジェクト横断でのステータス確認

**user-invocable**: true（`/backlog-status`）

**スキルが教えること**:

- `backlog status` で自分に関連する課題・PRのサマリ表示
- 作業の優先順位付けに利用

---

### Tier 3: 高度なスキル

#### 7. `backlog-api` — 汎用APIアクセス

**目的**: CLIコマンドでカバーされていない操作を直接APIで実行

**user-invocable**: true（`/backlog-api`）

**スキルが教えること**:

- `backlog api <endpoint>` の使い方
- `-X` でHTTPメソッド指定
- `-f key=value` でリクエストフィールド指定
- `--paginate` で全件取得
- エンドポイントのパス形式（`/api/v2` プレフィックスは省略可能）
- **参照ファイル**: 主要なAPIエンドポイント一覧と各パラメータ（後述のスキーマ参照と連携）

---

## 追加機能の提案

### 提案1: `--output json` のデフォルト化オプション（優先度: 高）

**背景**: 現在のデフォルト出力はテーブル形式で人間向け。エージェントがCLI出力をパースして次のアクションを決定するには、JSON出力が適している。

**提案内容**:

- 設定値 `config set output json` で全コマンドのデフォルト出力をJSONに変更できるようにする
- または環境変数 `BACKLOG_OUTPUT=json` で切り替え
- エージェントスキル内で `--json` フラグの利用を推奨するガイダンスを含める

**実装の優先度**: 高。エージェントがCLI出力を確実にパースするための基盤。

---

### 提案2: スキーマ型参照ファイル（優先度: 中）

**背景**: ユーザーの提案通り、エージェントがBacklog APIのデータ構造を把握していると、適切なフィールド指定やレスポンスの解釈が正確になる。

**判断: 必要（ただし限定的な形で）**

**理由**:

- CLIの `--help` で各コマンドのフラグは分かるが、**レスポンスのデータ構造**（特に `--json` 出力時）は分からない
- `backlog api` コマンドでは、エンドポイントごとのリクエスト/レスポンススキーマの知識が不可欠
- 課題のカスタムフィールドやネストされたオブジェクト構造の理解に役立つ

**提案内容**:

- `backlog-api` スキル内に `reference.md` として主要なデータモデルのサマリを配置
- 全スキーマを網羅するのではなく、エージェントが頻繁に扱う主要エンティティに絞る:
  - `Issue` — フィールド一覧（summary, description, status, issueType, priority, assignee, category[], milestone[], customFields[], startDate, dueDate, estimatedHours, actualHours）
  - `PullRequest` — フィールド一覧
  - `Project` — フィールド一覧
  - `Comment` — フィールド一覧
  - `User` — フィールド一覧
- 自動生成された `packages/openapi-client/src/generated/types.gen.ts` から抽出可能

**代替案**: スキーマ参照の代わりに、新しいCLIコマンド `backlog schema <entity>` を追加し、エージェントが動的にスキーマを取得できるようにする。ただし、静的な参照ファイルの方がレイテンシが低くトークン効率が良い。

---

### 提案3: 課題テンプレート機能（優先度: 中）

**背景**: エージェントが課題を作成する際、毎回すべてのフィールドを指定するのは冗長。

**提案内容**:

- `.backlog/templates/` に課題テンプレートをYAMLで定義
- `backlog issue create --template bug` のようにテンプレート名を指定
- テンプレートにデフォルト値（種別、優先度、説明テンプレート等）を定義可能

```yaml
# .backlog/templates/bug.yaml
type: バグ
priority: 高
description: |
  ## 概要

  ## 再現手順
  1.
  2.
  3.

  ## 期待される動作

  ## 実際の動作
```

---

### 提案4: 課題-PR自動紐付け（優先度: 中）

**背景**: ブランチ名やコミットメッセージから課題キーを自動検出し、PR作成時に自動で紐付ける。

**提案内容**:

- `backlog pr create --auto-link` フラグ
- 現在のブランチ名から課題キーを抽出（例: `fix/PROJECT-123-login-bug` → `PROJECT-123`）
- コミットメッセージからも課題キーを検出

---

### 提案5: バッチ操作コマンド（優先度: 低）

**背景**: エージェントが複数の課題を一括操作するケースがある（例: スプリント完了時に複数課題を一括クローズ）。

**提案内容**:

- `backlog issue close PROJECT-{1,2,3}` のようなバッチ指定
- または `backlog issue list -p PROJECT -S "完了" --json | backlog issue close --stdin` のようなパイプ連携

---

### 提案6: ワークフローコマンド（優先度: 低）

**背景**: 課題の確認 → ステータス更新 → 実装 → PR作成 → 課題クローズ という一連のフローを1コマンドで開始/完了する。

**提案内容**:

- `backlog workflow start PROJECT-123` — 課題のステータスを「処理中」に変更し、ブランチを作成
- `backlog workflow finish PROJECT-123` — PR作成し、課題ステータスを更新

---

## ディレクトリ構成

```
.claude/
└── skills/
    ├── backlog-issue/
    │   └── SKILL.md
    ├── backlog-pr/
    │   └── SKILL.md
    ├── backlog-project-context/
    │   └── SKILL.md
    ├── backlog-wiki/
    │   └── SKILL.md
    ├── backlog-notification/
    │   └── SKILL.md
    ├── backlog-status/
    │   └── SKILL.md
    └── backlog-api/
        ├── SKILL.md
        └── reference.md          # スキーマ型参照
```

---

## 実装の優先順位

| 順序 | スキル / 機能                | 種別    | 理由                                 |
| ---- | ---------------------------- | ------- | ------------------------------------ |
| 1    | `backlog-issue`              | スキル  | エージェントの最も基本的な操作       |
| 2    | `backlog-pr`                 | スキル  | 開発ワークフローの必須要素           |
| 3    | `backlog-project-context`    | スキル  | 正しい値を使うための前提知識         |
| 4    | `--output json` デフォルト化 | CLI機能 | エージェントの出力パースの信頼性向上 |
| 5    | `backlog-api` + スキーマ参照 | スキル  | 高度な操作のための拡張               |
| 6    | `backlog-status`             | スキル  | 作業優先度の判断に有用               |
| 7    | `backlog-wiki`               | スキル  | ドキュメント参照・更新               |
| 8    | `backlog-notification`       | スキル  | 通知管理                             |
| 9    | 課題-PR自動紐付け            | CLI機能 | ワークフロー効率化                   |
| 10   | 課題テンプレート             | CLI機能 | 課題作成の効率化                     |
| 11   | バッチ操作                   | CLI機能 | 大量操作の効率化                     |
| 12   | ワークフローコマンド         | CLI機能 | 上級ワークフロー自動化               |

---

## 備考

- 各スキルの `SKILL.md` には、コマンドの使い方だけでなく「どういう判断でどのコマンドを使うべきか」のガイダンスを含める
- エージェントが対話的プロンプト（`promptRequired`）に対応できないため、スキル内で全フラグを明示的に指定するよう指示する
- `--space` フラグや `BACKLOG_SPACE` 環境変数による接続先の切り替え方法もスキルに含める
