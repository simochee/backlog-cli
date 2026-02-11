import { describe, it } from "vitest";

import { expectJsonArray, expectSuccess } from "../../helpers/assertions.ts";
import { getEnv } from "../../helpers/env.ts";
import { runCliWithRetry } from "../../helpers/retry.ts";

describe("project activities", () => {
	const { project } = getEnv();

	it("プロジェクトの活動を表示する", async () => {
		const result = await runCliWithRetry(["project", "activities", "-p", project]);
		expectSuccess(result);
	});

	it("--json でプロジェクト活動を JSON 配列で出力する", async () => {
		const result = await runCliWithRetry(["project", "activities", "-p", project, "--json"]);
		expectJsonArray(result);
	});
});
