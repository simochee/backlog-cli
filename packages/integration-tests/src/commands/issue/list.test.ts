import { describe, it } from "vitest";

import { expectJsonArray, expectSuccess } from "../../helpers/assertions.ts";
import { getEnv } from "../../helpers/env.ts";
import { runCliWithRetry } from "../../helpers/retry.ts";

describe("issue list", () => {
	const { project } = getEnv();

	it("課題一覧を表示する", async () => {
		const result = await runCliWithRetry(["issue", "list", "-p", project]);
		expectSuccess(result);
	});

	it("--json で課題一覧を JSON 配列で出力する", async () => {
		const result = await runCliWithRetry(["issue", "list", "-p", project, "--json"]);
		expectJsonArray(result);
	});
});
