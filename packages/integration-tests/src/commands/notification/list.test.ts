import { describe, it } from "vitest";

import { expectJsonArray, expectSuccess } from "../../helpers/assertions.ts";
import { runCliWithRetry } from "../../helpers/retry.ts";

describe("notification list", () => {
	it("通知一覧を表示する", async () => {
		const result = await runCliWithRetry(["notification", "list"]);
		expectSuccess(result);
	});

	it("--json で通知一覧を JSON 配列で出力する", async () => {
		const result = await runCliWithRetry(["notification", "list", "--json"]);
		expectJsonArray(result);
	});
});
