## テスト必須ルール

コードを変更・追加する際は、必ず対応するテストも書くこと。テストのないコード変更は不完全とみなす。

- テストフレームワーク: Vitest
- テスト実行: `bun run test`
- テストファイル配置: ソースファイルと同ディレクトリに `{source}.test.ts`
- `describe` は関数名またはモジュール名
- `it` は日本語で期待する振る舞いを記述
- 副作用（ファイル I/O、外部 API、環境変数）は `vi.mock` でモック化
- 新しい関数・モジュールを追加したら、対応するテストファイルを作成する
- 既存の関数を変更したら、対応するテストも更新・追加する
- バグ修正の場合は、修正前に失敗し修正後に成功するテストケースを追加する
- テスト可能なロジック（ヘルパー関数、バリデーション、データ変換等）は `export` してテスト対象にする

### テストを書かない箇所

- `packages/openapi-client` — 自動生成コード
- `packages/api-spec` — TypeSpec 定義
- `packages/tsconfigs` — 設定ファイルのみ
- CLI のインタラクティブプロンプト（consola.prompt）
- 外部 API への実際のリクエスト（モックで代替）

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

副作用のモック:

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
