import { describe, expect, it } from "bun:test";

import { expectSuccess } from "../../helpers/assertions.ts";
import { runCliJsonWithRetry, runCliWithRetry } from "../../helpers/retry.ts";

describe("space disk-usage", () => {
	it("ディスク使用量を表示する", async () => {
		const result = await runCliWithRetry(["space", "disk-usage"]);
		expectSuccess(result);
	});

	it("--json でディスク使用量を JSON 出力する", async () => {
		const result = await runCliJsonWithRetry(["space", "disk-usage"]);
		expect(result.data).toHaveProperty("capacity");
	});
});
