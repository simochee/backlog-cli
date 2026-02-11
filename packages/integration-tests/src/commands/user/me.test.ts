import { describe, expect, it } from "vitest";

import { expectSuccess } from "../../helpers/assertions.ts";
import { runCliJsonWithRetry, runCliWithRetry } from "../../helpers/retry.ts";

describe("user me", () => {
	it("自分のユーザー情報を表示する", async () => {
		const result = await runCliWithRetry(["user", "me"]);
		expectSuccess(result);
	});

	it("--json でユーザー情報を JSON 出力する", async () => {
		const result = await runCliJsonWithRetry(["user", "me"]);
		expect(result.data).toHaveProperty("id");
		expect(result.data).toHaveProperty("userId");
	});
});
