import { describe, it } from "vitest";

import { expectJsonArray, expectSuccess } from "../../helpers/assertions.ts";
import { getEnv } from "../../helpers/env.ts";
import { runCliWithRetry } from "../../helpers/retry.ts";

describe.skipIf(!getEnv().repo)("pr list", () => {
	const env = getEnv();
	const { repo } = env;
	if (!repo) return;

	it("PR一覧を表示する", async () => {
		const result = await runCliWithRetry(["pr", "list", "-p", env.project, "--repo", repo]);
		expectSuccess(result);
	});

	it("--json でPR一覧を JSON 配列で出力する", async () => {
		const result = await runCliWithRetry(["pr", "list", "-p", env.project, "--repo", repo, "--json"]);
		expectJsonArray(result);
	});
});
