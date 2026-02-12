import { describe, expect, it } from "bun:test";

import { expectSuccess } from "../../helpers/assertions.ts";
import { runCli } from "../../helpers/cli.ts";

// config get/set operates on global settings (not space-specific).
// BACKLOG_SPACE must be unset to avoid space-specific config lookup/rejection.
const envWithoutSpace = { BACKLOG_SPACE: "" };

describe("config get/set", () => {
	it("設定値を取得する", async () => {
		const result = await runCli(["config", "get", "default_space"], { env: envWithoutSpace });
		// This may or may not have a value, but should not error
		expectSuccess(result);
	});

	it("設定値を設定して取得できる", async () => {
		// Set a test value
		const result = await runCli(["config", "set", "default_space", "test-space.backlog.com"], {
			env: envWithoutSpace,
		});
		expectSuccess(result);

		// Read it back
		const getResult = await runCli(["config", "get", "default_space"], { env: envWithoutSpace });
		expectSuccess(getResult);
		expect(getResult.stdout).toContain("test-space.backlog.com");

		// Reset - set to empty to clean up
		await runCli(["config", "set", "default_space", ""], { env: envWithoutSpace });
	});
});
