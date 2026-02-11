import { describe, it } from "vitest";

import { expectJsonArray, expectSuccess } from "../../helpers/assertions.ts";
import { getEnv } from "../../helpers/env.ts";
import { runCliWithRetry } from "../../helpers/retry.ts";

describe.skipIf(!getEnv().repo)("pr list", () => {
	const env = getEnv();

	it("PR一覧を表示する", async () => {
		const result = await runCliWithRetry(["pr", "list", "-p", env.project, "--repo", env.repo!]);
		expectSuccess(result);
	});

	it("--json でPR一覧を JSON 配列で出力する", async () => {
		const result = await runCliWithRetry(["pr", "list", "-p", env.project, "--repo", env.repo!, "--json"]);
		expectJsonArray(result);
	});
});
