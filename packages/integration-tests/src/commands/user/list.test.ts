import { describe, it } from "vitest";

import { expectJsonArray, expectSuccess } from "../../helpers/assertions.ts";
import { runCliWithRetry } from "../../helpers/retry.ts";

describe("user list", () => {
	it("ユーザー一覧を表示する", async () => {
		const result = await runCliWithRetry(["user", "list"]);
		expectSuccess(result);
	});

	it("--json でユーザー一覧を JSON 配列で出力する", async () => {
		const result = await runCliWithRetry(["user", "list", "--json"]);
		expectJsonArray(result);
	});
});
