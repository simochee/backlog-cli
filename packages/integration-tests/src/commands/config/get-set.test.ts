import { describe, expect, it } from "vitest";

import { expectSuccess } from "../../helpers/assertions.ts";
import { runCli } from "../../helpers/cli.ts";

describe("config get/set", () => {
	it("設定値を取得する", async () => {
		const result = await runCli(["config", "get", "default_space"]);
		// This may or may not have a value, but should not error
		expectSuccess(result);
	});

	it("未認証のスペースを default_space に設定するとエラーになる", async () => {
		const result = await runCli(["config", "set", "default_space", "test-space.backlog.com"]);
		expect(result.exitCode).toBe(1);
		expect(result.stderr).toContain("not authenticated");
	});

	it("不明な設定キーを設定するとエラーになる", async () => {
		const result = await runCli(["config", "set", "unknown_key", "value"]);
		expect(result.exitCode).toBe(1);
		expect(result.stderr).toContain("Unknown or read-only config key");
	});
});
