import { describe, expect, it } from "bun:test";

import { expectSuccess } from "../../helpers/assertions.ts";
import { runCliJsonWithRetry, runCliWithRetry } from "../../helpers/retry.ts";

describe("space info", () => {
	it("スペース情報を表示する", async () => {
		const result = await runCliWithRetry(["space", "info"]);
		expectSuccess(result);
	});

	it("--json でスペース情報を JSON 出力する", async () => {
		const result = await runCliJsonWithRetry(["space", "info"]);
		expect(result.data).toHaveProperty("spaceKey");
	});

	it("--json フィールドフィルタが動作する", async () => {
		const result = await runCliWithRetry(["space", "info", "--json", "spaceKey,name"]);
		expectSuccess(result);

		const data = JSON.parse(result.stdout);
		const keys = Object.keys(data);
		expect(keys).toHaveLength(2);
		expect(keys).toContain("spaceKey");
		expect(keys).toContain("name");
	});
});
