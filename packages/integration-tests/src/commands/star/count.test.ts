import { describe, it } from "vitest";

import { expectSuccess } from "../../helpers/assertions.ts";
import { runCliWithRetry } from "../../helpers/retry.ts";

describe("star count", () => {
	it("スター数を表示する", async () => {
		const result = await runCliWithRetry(["star", "count"]);
		expectSuccess(result);
	});
});
