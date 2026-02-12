import { describe, expect, it } from "vitest";

import { expectSuccess } from "../../helpers/assertions.ts";
import { getEnv } from "../../helpers/env.ts";
import { runCliJsonWithRetry, runCliWithRetry } from "../../helpers/retry.ts";

describe.skipIf(!getEnv().repo)("repo view", () => {
	const env = getEnv();
	const { repo } = env;
	if (!repo) return;

	it("リポジトリ詳細を表示する", async () => {
		const result = await runCliWithRetry(["repo", "view", repo, "-p", env.project]);
		expectSuccess(result);
	});

	it("--json でリポジトリ詳細を JSON 出力する", async () => {
		const result = await runCliJsonWithRetry(["repo", "view", repo, "-p", env.project]);
		expect(result.data).toHaveProperty("id");
	});
});
