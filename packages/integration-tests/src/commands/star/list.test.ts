import { describe, it } from "bun:test";

import { expectSuccess } from "../../helpers/assertions.ts";
import { runCliWithRetry } from "../../helpers/retry.ts";

describe("star list", () => {
	it("スター一覧を表示する", async () => {
		const result = await runCliWithRetry(["star", "list"]);
		expectSuccess(result);
	});
});
