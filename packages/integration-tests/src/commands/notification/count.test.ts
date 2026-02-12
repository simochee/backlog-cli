import { describe, expect, it } from "bun:test";

import { expectSuccess } from "../../helpers/assertions.ts";
import { runCliJsonWithRetry, runCliWithRetry } from "../../helpers/retry.ts";

describe("notification count", () => {
	it("通知数を表示する", async () => {
		const result = await runCliWithRetry(["notification", "count"]);
		expectSuccess(result);
	});

	it("--json で通知数を JSON 出力する", async () => {
		const result = await runCliJsonWithRetry<{ count: number }>(["notification", "count"]);
		expect(result.data).toHaveProperty("count");
		expect(typeof result.data.count).toBe("number");
	});
});
