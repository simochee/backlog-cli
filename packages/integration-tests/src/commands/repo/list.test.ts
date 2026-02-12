import { describe, it } from "bun:test";

import { expectJsonArray, expectSuccess } from "../../helpers/assertions.ts";
import { getEnv } from "../../helpers/env.ts";
import { runCliWithRetry } from "../../helpers/retry.ts";

describe("repo list", () => {
	const { project } = getEnv();

	it("リポジトリ一覧を表示する", async () => {
		const result = await runCliWithRetry(["repo", "list", "-p", project]);
		expectSuccess(result);
	});

	it("--json でリポジトリ一覧を JSON 配列で出力する", async () => {
		const result = await runCliWithRetry(["repo", "list", "-p", project, "--json"]);
		expectJsonArray(result);
	});
});
