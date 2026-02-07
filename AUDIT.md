# コードベース監査レポート

## 概要

テスト不足、実装不足、型安全性の問題を洗い出した結果をまとめる。

---

## 1. テストが不足している箇所

### 全体カバレッジ: 約13%（132ソースファイル中17テストファイル）

### テストが全くないコマンド（112ファイル）

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
| `api.ts`, `browse.ts`, `status.ts` | 3 | 中 |

### 既存テストの問題

- **`packages/api/src/client.test.ts`**: `createClient` が関数を返すことしか検証していない。リクエスト送信、認証ヘッダ付与、エラーハンドリングのテストなし
- **`packages/cli/src/commands/config/get.test.ts`** / **`set.test.ts`**: ヘルパー関数のみテスト。`run()` メソッド未テスト
- **`packages/cli/src/commands/space/disk-usage.test.ts`**: `formatBytes()` のみテスト。コマンド本体未テスト
- **`packages/cli/src/commands/completion.test.ts`**: メタデータのみ検証。補完スクリプト生成ロジック未テスト

---

## 2. 型安全でない箇所

### `as unknown as T` ダブルキャスト（6箇所）

| ファイル | 行 | コード |
|---|---|---|
| `packages/cli/src/utils/resolve.ts` | 47 | `i[nameField] as unknown as string` |
| `packages/cli/src/utils/resolve.ts` | 51 | `i[nameField] as unknown as string` |
| `packages/cli/src/utils/client.test.ts` | 8 | `(() => {}) as unknown` |
| `packages/cli/src/utils/format.test.ts` | 211, 221 | `} as unknown as BacklogNotification` |
| `packages/cli/src/utils/resolve.test.ts` | 23 | `}) as unknown as BacklogClient` |

**改善案**: `resolveByName` のジェネリック制約を `T extends { id: number } & Record<K, string>` にする。

### `as typeof config` の不安全なキャスト（2箇所）

| ファイル | 行 |
|---|---|
| `packages/cli/src/commands/alias/delete.ts` | 31 |
| `packages/cli/src/commands/alias/set.ts` | 36 |

**原因**: `Rc` スキーマの型に `aliases` フィールドが含まれていない。

### `Record<string, unknown>` の多用（49箇所）

ほぼ全てのコマンドで API リクエストのボディを `Record<string, unknown>` として構築している。`@repo/openapi-client` の生成型を活用していない。

**主な該当ファイル**:
- `commands/issue/create.ts`, `edit.ts`, `close.ts`, `list.ts`, `reopen.ts`
- `commands/pr/create.ts`, `edit.ts`, `close.ts`, `merge.ts`, `list.ts`, `comments.ts`
- `commands/project/create.ts`, `edit.ts`, `list.ts`, `activities.ts`
- `commands/wiki/create.ts`, `edit.ts`, `list.ts`, `history.ts`
- `commands/api.ts`
- その他30以上のコマンドファイル

### `unknown[]` の型未定義（10箇所 `packages/api/src/types.ts`）

```
changeLog: unknown[]    — 行87, 176
stars: unknown[]        — 行91, 180, 212
notifications: unknown[] — 行92, 107, 181
sharedFiles: unknown[]  — 行211
```

### 型不安全な `config` アクセス（3箇所）

```typescript
// alias/delete.ts:20-21, alias/list.ts:16, alias/set.ts:30
(config as Record<string, unknown>).aliases as Record<string, string>
```

---

## 3. 実装が不足・不完全な箇所

### 未実装機能

- **`packages/cli/src/commands/auth/refresh.ts`**: OAuth トークンリフレッシュが未実装（行34-37）

### ハードコードされたステータスID

| ファイル | 行 | 値 | 問題 |
|---|---|---|---|
| `commands/pr/close.ts` | 41 | `statusId: 2` | Closed のIDがハードコード |
| `commands/pr/reopen.ts` | 40 | `statusId: 1` | Open のIDがハードコード |
| `commands/pr/merge.ts` | 41 | `statusId: 3` | Merged のIDがハードコード |

Issue系コマンドでは `resolveClosedStatusId()` / `resolveOpenStatusId()` で動的解決しているが、PR系はしていない。

### 入力バリデーション不足

| ファイル | 行 | 問題 |
|---|---|---|
| `commands/star/add.ts` | 34 | Issue キーを数値IDに変換せず文字列のまま送信 |
| `commands/project/add-user.ts` | 31 | `Number.parseInt` の NaN チェックなし |
| `commands/pr/list.ts` | 61, 65 | `Number.parseInt` の NaN チェック・範囲バリデーションなし |

### エラーハンドリングの問題

| ファイル | 行 | 問題 |
|---|---|---|
| `commands/auth/status.ts` | 55-57 | 空の `catch` ブロックでエラー握りつぶし |
| `packages/config/src/config.ts` | 18-19 | `console.error()` を直接使用（`consola` との不一致） |
| `commands/completion.ts` | 110 | `console.log()` を直接使用 |

### `Bun.spawn` のエラーハンドリング不足（8箇所）

以下のコマンドで `Bun.spawn(["open", url])` の終了コード未チェック:
- `browse.ts`, `issue/create.ts`, `issue/view.ts`, `pr/create.ts`, `pr/view.ts`, `project/view.ts`, `repo/view.ts`, `wiki/view.ts`

（対照的に `repo/clone.ts` は正しくハンドリング）

### `aliases` がスキーマ未定義

`packages/config/src/types.ts` の `Rc` スキーマに `aliases` フィールドがなく、alias コマンドで二重キャストが必要になっている。

---

## まとめ（優先度順）

| 優先度 | 問題 | 件数 |
|---|---|---|
| 高 | コマンドのテスト不足（93%がテストなし） | 112ファイル |
| 高 | `Record<string, unknown>` で型付きSDKを活用できていない | 49箇所 |
| 高 | API クライアントのテストが実質ゼロ | 1ファイル |
| 中 | `unknown[]` の不適切な型定義 | 10箇所 |
| 中 | `as unknown as T` のダブルキャスト | 6箇所 |
| 中 | PRコマンドのハードコードされたステータスID | 3箇所 |
| 中 | 入力バリデーション不足（NaN チェックなし） | 3箇所 |
| 中 | `auth/refresh` が未実装 | 1箇所 |
| 低 | `Bun.spawn` のエラーハンドリング不足 | 8箇所 |
| 低 | `console.error`/`console.log` の不一致 | 3箇所 |
