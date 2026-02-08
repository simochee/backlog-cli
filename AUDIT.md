# コードベース監査レポート

## 概要

テスト不足、実装不足、型安全性の問題を洗い出した結果をまとめる。

---

## 1. テストが不足している箇所

### 全体カバレッジ: 約14%（132ソースファイル中18テストファイル）

### テストが全くないコマンド（107ファイル）

| カテゴリ | ファイル数 | 優先度 |
|---|---|---|
| `issue/*` (list, view, create, edit, close, reopen, comment, status) | 8 | 高 |
| `pr/*` (list, view, create, edit, close, reopen, merge, comment, comments, status) | 10 | 高 |
| `project/*` (list, view, create, edit, delete, users, add-user, remove-user, activities) | 9 | 高 |
| `auth/login`, `auth/logout`, `auth/status`, `auth/token` | 4 | 高 |
| `wiki/*` | 10 | 中 |
| `webhook/*` | 6 | 中 |
| `team/*` | 6 | 中 |
| `notification/*` | 5 | 中 |
| `user/*` | 5 | 中 |
| `repo/*` | 4 | 中 |
| `category/*`, `milestone/*`, `issue-type/*`, `status-type/*` | 20 | 中 |
| `star/*`, `watching/*` | 10 | 低 |
| `browse.ts`, `status.ts` | 2 | 中 |

### 既存テストの問題

- ~~**`packages/api/src/client.test.ts`**: `createClient` が関数を返すことしか検証していない。リクエスト送信、認証ヘッダ付与、エラーハンドリングのテストなし~~ **→ 解決済み（PR #26）**: テスト数 3→10 に拡充。base URL構築、API Key クエリパラメータ、OAuth Bearer ヘッダ、認証なしの設定を検証
- **`packages/cli/src/commands/config/get.test.ts`** / **`set.test.ts`**: ヘルパー関数のみテスト。`run()` メソッド未テスト
- **`packages/cli/src/commands/space/disk-usage.test.ts`**: `formatBytes()` のみテスト。コマンド本体未テスト
- **`packages/cli/src/commands/completion.test.ts`**: メタデータのみ検証。補完スクリプト生成ロジック未テスト

---

## 2. 型安全でない箇所

### ~~`as unknown as T` ダブルキャスト（6箇所）~~ → 解決済み（PR #25）

`resolveByName` のジェネリック制約を改善し、ダブルキャストを解消。

### ~~`as typeof config` の不安全なキャスト（2箇所）~~ → 解決済み（PR #25）

`Rc` スキーマに `aliases` フィールドを追加し、型安全なアクセスを実現。

### ~~`Record<string, unknown>` の多用（49箇所）~~ → 解決済み（PR #26）

`@repo/openapi-client` の生成型（`IssuesCreateData`, `PullRequestsUpdateData` 等）を活用するよう39ファイルを修正。

**残存する `Record<string, unknown>`（意図的な使用）:**
- `api.ts`: 汎用APIコマンドのため型を限定できない
- `config/get.ts`: 動的なキーアクセスのため
- 一部コマンドの `& Record<string, unknown>` 交差型: Backlog API の `"key[]"` 配列記法に対応するため

### ~~`unknown[]` の型未定義（10箇所 `packages/api/src/types.ts`）~~ → 解決済み（PR #25）

`BacklogChangeLog[]`, `BacklogStar[]`, `BacklogCommentNotification[]`, `BacklogSharedFile[]` 等の適切な型に置換。

### ~~型不安全な `config` アクセス（3箇所）~~ → 解決済み（PR #25）

`Rc` スキーマへの `aliases` フィールド追加により解消。

---

## 3. 実装が不足・不完全な箇所

### 未実装機能

- **`packages/cli/src/commands/auth/refresh.ts`**: OAuth トークンリフレッシュが未実装（行34-37）

### ~~ハードコードされたステータスID~~ → 解決済み（PR #25）

`PR_STATUS` 定数（`PR_STATUS.Open`, `PR_STATUS.Closed`, `PR_STATUS.Merged`）を使用するよう修正。

### ~~入力バリデーション不足~~ → 解決済み（PR #25）

`star/add.ts`, `project/add-user.ts`, `pr/list.ts` に `Number.isNaN()` チェックと範囲バリデーションを追加。

### ~~エラーハンドリングの問題~~ → 解決済み（PR #25）

- `auth/status.ts`: 空の catch ブロックに `consola.debug` によるログ出力を追加
- `config.ts`: `consola` への統一
- `completion.ts`: `process.stdout.write()` に変更

### ~~`Bun.spawn` のエラーハンドリング不足（8箇所）~~ → 解決済み（PR #25）

共通ユーティリティ `openUrl()` を作成し、全コマンドで使用するよう統一。

### ~~`aliases` がスキーマ未定義~~ → 解決済み（PR #25）

`Rc` スキーマに `aliases: type("Record<string, string>").default(() => ({}))` を追加。

---

## まとめ（優先度順）

| 優先度 | 問題 | 件数 | 状態 |
|---|---|---|---|
| 高 | コマンドのテスト不足（93%がテストなし） | 107ファイル | **未対応** |
| ~~高~~ | ~~`Record<string, unknown>` で型付きSDKを活用できていない~~ | ~~49箇所~~ | **解決済み（PR #26）** |
| ~~高~~ | ~~API クライアントのテストが実質ゼロ~~ | ~~1ファイル~~ | **解決済み（PR #26: 3→10テスト）** |
| ~~中~~ | ~~`unknown[]` の不適切な型定義~~ | ~~10箇所~~ | **解決済み（PR #25）** |
| ~~中~~ | ~~`as unknown as T` のダブルキャスト~~ | ~~6箇所~~ | **解決済み（PR #25）** |
| ~~中~~ | ~~PRコマンドのハードコードされたステータスID~~ | ~~3箇所~~ | **解決済み（PR #25）** |
| ~~中~~ | ~~入力バリデーション不足（NaN チェックなし）~~ | ~~3箇所~~ | **解決済み（PR #25）** |
| 中 | `auth/refresh` が未実装 | 1箇所 | **未対応** |
| ~~低~~ | ~~`Bun.spawn` のエラーハンドリング不足~~ | ~~8箇所~~ | **解決済み（PR #25）** |
| ~~低~~ | ~~`console.error`/`console.log` の不一致~~ | ~~3箇所~~ | **解決済み（PR #25）** |

### 対応履歴

| PR | 内容 |
|---|---|
| #25 | 型安全性、エラーハンドリング、バリデーションの改善（中〜低優先度項目） |
| #26 | `Record<string, unknown>` → 型付きSDK型への移行（39ファイル）、APIクライアントテスト拡充（3→10）、parseFieldテスト追加（11） |
