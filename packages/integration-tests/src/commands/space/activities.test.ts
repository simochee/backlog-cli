import { describe, it } from "bun:test";

import { expectJsonArray, expectSuccess } from "../../helpers/assertions.ts";
import { runCliWithRetry } from "../../helpers/retry.ts";

describe("space activities", () => {
	it("スペースの最近の活動を表示する", async () => {
		const result = await runCliWithRetry(["space", "activities"]);
		expectSuccess(result);
	});

	it("--json で活動一覧を JSON 配列で出力する", async () => {
		const result = await runCliWithRetry(["space", "activities", "--json"]);
		expectJsonArray(result);
	});
});
