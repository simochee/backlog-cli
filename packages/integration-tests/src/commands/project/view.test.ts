import { describe, expect, it } from "bun:test";

import { expectSuccess } from "../../helpers/assertions.ts";
import { getEnv } from "../../helpers/env.ts";
import { runCliJsonWithRetry, runCliWithRetry } from "../../helpers/retry.ts";

describe("project view", () => {
	const { project } = getEnv();

	it("プロジェクト詳細を表示する", async () => {
		const result = await runCliWithRetry(["project", "view", project]);
		expectSuccess(result);
	});

	it("--json でプロジェクト詳細を JSON 出力する", async () => {
		const result = await runCliJsonWithRetry(["project", "view", project]);
		expect(result.data).toHaveProperty("projectKey");
	});
});
