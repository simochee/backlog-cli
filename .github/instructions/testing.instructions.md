---
name: Testing
description: Unit testing strategy and conventions using Vitest.
applyTo: "*.test.ts, *.spec.ts, vitest.config.ts, vitest.workspace.ts"
---

## テストフレームワーク

Vitest を使用する。Turborepo の `test` タスクで全パッケージのテストを一括実行する。

```sh
bun run test          # 全パッケージのテスト実行（turbo test）
bun run test --filter=@repo/config  # 特定パッケージのみ
```

## テスト対象パッケージと優先度

### 1. `packages/config`（優先度: 高）

設定管理のコアロジック。副作用を vi.mock でモック化し、ビジネスロジックを検証する。

#### `src/types.ts` — バリデーションスキーマ

arktype スキーマの入力バリデーション。純粋な関数呼び出しのためモック不要。

| テスト観点 | 具体例 |
|---|---|
| `RcAuth` の有効な api-key 入力 | `{ method: "api-key", apiKey: "xxx" }` → 成功 |
| `RcAuth` の有効な oauth 入力 | `{ method: "oauth", accessToken: "...", refreshToken: "..." }` → 成功 |
| `RcAuth` の無効な method | `{ method: "unknown" }` → エラー |
| `RcAuth` の必須フィールド欠落 | `{ method: "api-key" }` (apiKey なし) → エラー |
| `RcSpace` のホスト名正規表現 | `example.backlog.com` → 成功、`invalid-host` → エラー |
| `Rc` の spaces デフォルト値 | `{}` → `{ spaces: [] }` に正規化 |

#### `src/space.ts` — スペース管理関数

`loadConfig` / `writeConfig` を `vi.mock` でモック化してテストする。

| 関数 | テスト観点 |
|---|---|
| `addSpace` | 新規スペース追加、重複ホストでエラー |
| `removeSpace` | 既存スペース削除、存在しないホストでエラー、デフォルト解除 |
| `updateSpaceAuth` | 認証情報更新、存在しないホストでエラー |
| `resolveSpace` | 明示ホスト → 環境変数 → defaultSpace の優先順位 |

#### `src/config.ts` — 設定ファイル I/O

rc9 の `readUser` / `writeUser` をモック化して、バリデーション結果の分岐を検証する。

### 2. `packages/api`（優先度: 中）

#### `src/client.ts` — API クライアント生成

ofetch のモックで `createClient` の設定値を検証する。

| テスト観点 | 具体例 |
|---|---|
| API Key 認証 | `query.apiKey` にキーが設定される |
| OAuth 認証 | `Authorization: Bearer ...` ヘッダーが設定される |
| ベース URL 構築 | `https://{host}/api/v2` 形式になる |

### 3. `packages/cli`（優先度: 中）

#### `src/commands/config/get.ts` — `getNestedValue` ヘルパー

ドットで区切られたキーでオブジェクトの値を取得する純粋関数。

| テスト観点 | 具体例 |
|---|---|
| 浅いキー | `getNestedValue({ a: 1 }, "a")` → `1` |
| ネストキー | `getNestedValue({ a: { b: 2 } }, "a.b")` → `2` |
| 存在しないキー | `getNestedValue({ a: 1 }, "x")` → `undefined` |
| null 中間値 | `getNestedValue({ a: null }, "a.b")` → `undefined` |

#### `src/commands/config/set.ts` — `resolveKey` ヘルパー

snake_case → camelCase のキーエイリアス解決。

## テストファイルの配置

ソースファイルと同じディレクトリに `.test.ts` サフィックスで配置する（コロケーション方式）。

```
packages/config/src/
  types.ts
  types.test.ts       ← ここ
  space.ts
  space.test.ts        ← ここ
  config.ts
  config.test.ts       ← ここ
```

## テストの書き方

### 基本構造

```ts
import { describe, expect, it } from "vitest";

describe("関数名", () => {
  it("期待する振る舞いの説明", () => {
    const result = targetFunction(input);
    expect(result).toBe(expected);
  });
});
```

### モックの使い方

ファイル I/O やプロセス環境変数など副作用を持つ依存をモック化する。

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";

// モジュール全体をモック
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
    vi.mocked(loadConfig).mockResolvedValue({
      spaces: [],
    });

    await addSpace({ host: "example.backlog.com", auth: { method: "api-key", apiKey: "key" } });

    expect(writeConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        spaces: [expect.objectContaining({ host: "example.backlog.com" })],
      }),
    );
  });
});
```

### 命名規則

- `describe` ブロック: 関数名またはモジュール名
- `it` ブロック: 日本語で期待する振る舞いを記述（例: `"新しいスペースを追加する"`）
- テストファイル名: `{source}.test.ts`

## テストを書かない箇所

- `packages/openapi-client` — 自動生成コード
- `packages/backlog-api-typespec` — TypeSpec 定義（コンパイル時に検証済み）
- `packages/tsconfigs` — 設定ファイルのみ
- CLI のインタラクティブプロンプト（consola.prompt）— 統合テストの範囲
- 外部 API への実際のリクエスト — モックで代替
