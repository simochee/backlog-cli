import { describe, it } from "vitest";

import { expectJsonArray, expectSuccess } from "../../helpers/assertions.ts";
import { runCliWithRetry } from "../../helpers/retry.ts";

describe("project list", () => {
	it("プロジェクト一覧を表示する", async () => {
		const result = await runCliWithRetry(["project", "list"]);
		expectSuccess(result);
	});

	it("--json でプロジェクト一覧を JSON 配列で出力する", async () => {
		const result = await runCliWithRetry(["project", "list", "--json"]);
		expectJsonArray(result);
	});
});
