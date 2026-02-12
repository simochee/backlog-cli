import { describe, it } from "bun:test";

import { expectSuccess } from "../helpers/assertions.ts";
import { runCliWithRetry } from "../helpers/retry.ts";

describe("dashboard", () => {
	it("ダッシュボードを表示する", async () => {
		const result = await runCliWithRetry(["dashboard"]);
		expectSuccess(result);
	});
});
