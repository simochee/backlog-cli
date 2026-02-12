import { describe, it } from "bun:test";

import { expectJsonArray, expectSuccess } from "../../helpers/assertions.ts";
import { getEnv } from "../../helpers/env.ts";
import { runCliWithRetry } from "../../helpers/retry.ts";

describe("project users", () => {
	const { project } = getEnv();

	it("プロジェクトメンバーを表示する", async () => {
		const result = await runCliWithRetry(["project", "users", "-p", project]);
		expectSuccess(result);
	});

	it("--json でプロジェクトメンバーを JSON 配列で出力する", async () => {
		const result = await runCliWithRetry(["project", "users", "-p", project, "--json"]);
		expectJsonArray(result);
	});
});
