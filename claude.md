# backlog-cli

Backlog API を操作する CLI ツール。gh CLI のインターフェースを参考に設計。

## プロジェクト構成

Turborepo ベースのモノレポ。ライブラリは unjs エコシステムを優先して選定。

- `packages/cli` — CLI 本体（citty ベース、コマンドは遅延読み込み）
- `packages/api` — Backlog API クライアント（ofetch + ufo）
- `packages/config` — 設定管理（rc9 + arktype）
- `packages/tsconfigs` — 共有 TypeScript 設定
- `docs` — ドキュメントサイト（Astro + Starlight）

## 技術スタック

- ランタイム: Bun
- 言語: TypeScript
- CLI フレームワーク: citty (unjs)
- HTTP クライアント: ofetch (unjs)
- URL ユーティリティ: ufo (unjs)
- 設定ファイル: rc9 (unjs)
- ロギング: consola (unjs)
- 型バリデーション: arktype
- テスト: Vitest
- コード品質: Biome
- タスク実行: Turbo
- Git フック: Lefthook

## CLI コマンド構造

コマンドは `packages/cli/src/commands/` 以下にドメインごとのディレクトリで管理する。
各コマンドグループは `index.ts` でサブコマンドを遅延読み込み（`() => import(...)`）で登録する。

```
src/commands/
  auth/           — 認証管理（login, logout, status, token）
  config/         — CLI 設定（get, set, list）
  issue/          — 課題管理（list, view, create, edit, close, reopen, comment, status）
  project/        — プロジェクト管理（list, view, activities）
  pr/             — プルリクエスト管理（list, view, create, edit, close, merge, reopen, comment, comments, status）
  repo/           — Git リポジトリ管理（list, view, clone）
  notification/   — 通知管理（list, count, read, read-all）
  status.ts       — ダッシュボード（自分の課題・通知・最近の更新サマリー）
  browse.ts       — ブラウザで開く
  api.ts          — 汎用 API リクエスト
```

新しいコマンドを追加する手順:
1. `commands/<group>/` にコマンドファイルを作成（`defineCommand` を使用）
2. グループの `index.ts` の `subCommands` に遅延 import を追加
3. 新しいグループの場合は `src/index.ts` にも追加

## API クライアント

`@repo/api` は `createClient()` で認証済み ofetch インスタンスを生成する。
API Key（クエリパラメータ）と OAuth 2.0（Bearer トークン）の両方に対応。

## 設定管理

`@repo/config` は `~/.backlogrc` ファイルでスペース情報と認証情報を管理する。
認証方式は `api-key` と `oauth` の判別型ユニオンで定義。

スペース解決の優先順位:
1. `--space` フラグ
2. `BACKLOG_SPACE` 環境変数
3. 設定ファイルの `defaultSpace`

## 開発ルール

- `bun install` で依存インストール
- `bun run dev` で開発モード
- `bun run build` でビルド
- `bun run type-check` で型チェック
- `bun run lint` でリント
- `bun run test` でテスト
- Conventional Commits 形式でコミットメッセージを書く
- JSDoc は `.github/instructions/jsdoc.instructions.md` に従う
- Bun の利用は `.github/instructions/bun.instructions.md` に従う

### テスト必須ルール

**コードを変更・追加する際は、必ず対応するテストも書くこと。テストのないコード変更は不完全とみなす。**

- 新しい関数・モジュールを追加したら、同ディレクトリに `{source}.test.ts` を作成する
- 既存の関数を変更したら、対応するテストも更新・追加する
- バグ修正の場合は、修正前に失敗し修正後に成功するテストケースを追加する
- テスト可能なロジック（ヘルパー関数、バリデーション、データ変換等）は `export` してテストを書く
- テスト実行（`bun run test`）が全て通ることを確認してからコミットする

## テスト

Vitest を使用した単体テスト。Turborepo の `test` タスクで全パッケージを一括実行する。

```sh
bun run test                            # 全パッケージ
bun run test --filter=@repo/config      # 特定パッケージ
```

### テスト対象と優先度

#### 1. `packages/config`（優先度: 高）

設定管理のコアロジック。副作用を `vi.mock` でモック化し、ビジネスロジックを検証する。

**`src/types.ts`** — arktype スキーマの入力バリデーション（モック不要）

| テスト観点 | 具体例 |
|---|---|
| `RcAuth` の有効な api-key 入力 | `{ method: "api-key", apiKey: "xxx" }` → 成功 |
| `RcAuth` の有効な oauth 入力 | `{ method: "oauth", accessToken: "...", refreshToken: "..." }` → 成功 |
| `RcAuth` の無効な method | `{ method: "unknown" }` → エラー |
| `RcAuth` の必須フィールド欠落 | `{ method: "api-key" }` (apiKey なし) → エラー |
| `RcSpace` のホスト名正規表現 | `example.backlog.com` → 成功、`invalid-host` → エラー |
| `Rc` の spaces デフォルト値 | `{}` → `{ spaces: [] }` に正規化 |

**`src/space.ts`** — `loadConfig` / `writeConfig` を `vi.mock` でモック化

| 関数 | テスト観点 |
|---|---|
| `addSpace` | 新規スペース追加、重複ホストでエラー |
| `removeSpace` | 既存スペース削除、存在しないホストでエラー、デフォルト解除 |
| `updateSpaceAuth` | 認証情報更新、存在しないホストでエラー |
| `resolveSpace` | 明示ホスト → 環境変数 → defaultSpace の優先順位 |

**`src/config.ts`** — rc9 の `readUser` / `writeUser` をモック化してバリデーション分岐を検証

#### 2. `packages/api`（優先度: 中）

**`src/client.ts`** — ofetch のモックで `createClient` の設定値を検証

| テスト観点 | 具体例 |
|---|---|
| API Key 認証 | `query.apiKey` にキーが設定される |
| OAuth 認証 | `Authorization: Bearer ...` ヘッダーが設定される |
| ベース URL 構築 | `https://{host}/api/v2` 形式になる |

#### 3. `packages/cli`（優先度: 中）

**`src/commands/config/get.ts`** — `getNestedValue` ヘルパー

| テスト観点 | 具体例 |
|---|---|
| 浅いキー | `getNestedValue({ a: 1 }, "a")` → `1` |
| ネストキー | `getNestedValue({ a: { b: 2 } }, "a.b")` → `2` |
| 存在しないキー | `getNestedValue({ a: 1 }, "x")` → `undefined` |
| null 中間値 | `getNestedValue({ a: null }, "a.b")` → `undefined` |

**`src/commands/config/set.ts`** — `resolveKey` の snake_case → camelCase エイリアス解決

### テストを書かない箇所

- `packages/openapi-client` — 自動生成コード
- `packages/backlog-api-typespec` — TypeSpec 定義（コンパイル時に検証済み）
- `packages/tsconfigs` — 設定ファイルのみ
- CLI のインタラクティブプロンプト（consola.prompt）— 統合テストの範囲
- 外部 API への実際のリクエスト — モックで代替

### テストファイルの配置

ソースファイルと同ディレクトリにコロケーション方式で配置: `{source}.test.ts`

```
packages/config/src/
  types.ts
  types.test.ts
  space.ts
  space.test.ts
  config.ts
  config.test.ts
```

### テストの書き方

```ts
import { describe, expect, it } from "vitest";

describe("関数名", () => {
  it("期待する振る舞いの説明", () => {
    const result = targetFunction(input);
    expect(result).toBe(expected);
  });
});
```

副作用を持つ依存は `vi.mock` でモック化する:

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("#config.ts", () => ({
  loadConfig: vi.fn(),
  writeConfig: vi.fn(),
}));

import { loadConfig, writeConfig } from "#config.ts";

describe("addSpace", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("新しいスペースを追加する", async () => {
    vi.mocked(loadConfig).mockResolvedValue({ spaces: [] });
    await addSpace({ host: "example.backlog.com", auth: { method: "api-key", apiKey: "key" } });
    expect(writeConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        spaces: [expect.objectContaining({ host: "example.backlog.com" })],
      }),
    );
  });
});
```

### テストの規約

- `describe` は関数名またはモジュール名
- `it` は日本語で期待する振る舞いを記述
- テストファイル名: `{source}.test.ts`
- 副作用（ファイル I/O、環境変数）は `vi.mock` でモック化

## PLAN.md の運用

**PLAN.md はこのプロジェクトの実装計画書であり、常に最新の状態を保つこと。**

- 機能を実装したら、該当コマンドの「状態」を `未着手` → `実装中` → `完了` に更新する
- 新しいコマンドや引数を追加・変更した場合は PLAN.md にも反映する
- Phase の進捗サマリーテーブルも合わせて更新する
- 設計方針の変更があった場合は「設計原則」セクションを更新する
- PLAN.md と実装が乖離しないよう、対応のたびに確認・更新を行う
