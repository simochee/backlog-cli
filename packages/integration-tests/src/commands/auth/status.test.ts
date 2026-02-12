import { describe, it } from "bun:test";

import { expectSuccess } from "../../helpers/assertions.ts";
import { runCliWithRetry } from "../../helpers/retry.ts";

describe("auth status", () => {
	it("認証ステータスを表示する", async () => {
		const result = await runCliWithRetry(["auth", "status"]);
		expectSuccess(result);
	});
});
