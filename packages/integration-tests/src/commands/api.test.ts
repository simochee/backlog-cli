import { describe, expect, it } from "vitest";

import { expectSuccess } from "../helpers/assertions.ts";
import { runCliWithRetry } from "../helpers/retry.ts";

describe("api", () => {
	it("汎用 API リクエストを実行する", async () => {
		const result = await runCliWithRetry(["api", "/space"]);
		expectSuccess(result);

		const data = JSON.parse(result.stdout);
		expect(data).toHaveProperty("spaceKey");
	});
});
