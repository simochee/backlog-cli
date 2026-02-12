import { spyOnProcessExit } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { beforeEach, describe, expect, it, mock } from "bun:test";

mock.module("@repo/config", () => ({
	loadConfig: mock(),
	writeConfig: mock(),
	addSpace: mock(),
	findSpace: mock(),
	removeSpace: mock(),
	resolveSpace: mock(),
	updateSpaceAuth: mock(),
}));

mock.module("consola", () => ({ default: mockConsola }));

const { loadConfig } = await import("@repo/config");
const { default: consola } = await import("consola");

describe("config list", () => {
	beforeEach(() => {});

	it("--space 指定で特定スペースの情報を表示する", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [{ host: "example.backlog.com", auth: { method: "api-key", apiKey: "key123" } }],
			defaultSpace: "example.backlog.com",
		} as never);

		const mod = await import("#commands/config/list.ts");
		await mod.default.run?.({
			args: { space: "example.backlog.com" },
		} as never);

		expect(consola.log).toHaveBeenCalledWith("host=example.backlog.com");
		expect(consola.log).toHaveBeenCalledWith("auth.method=api-key");
	});

	it("--space 指定で存在しないスペースの場合 process.exit(1) を呼ぶ", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [],
			defaultSpace: undefined,
		} as never);

		const exitSpy = spyOnProcessExit();

		const mod = await import("#commands/config/list.ts");
		await mod.default.run?.({
			args: { space: "nonexistent.backlog.com" },
		} as never);

		expect(consola.error).toHaveBeenCalledWith('Space "nonexistent.backlog.com" not found in configuration.');
		expect(exitSpy).toHaveBeenCalledWith(1);
		exitSpy.mockRestore();
	});

	it("デフォルトスペースと認証済みスペース一覧を表示する", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [
				{ host: "example.backlog.com", auth: { method: "api-key", apiKey: "key123" } },
				{ host: "other.backlog.com", auth: { method: "oauth", accessToken: "token", refreshToken: "refresh" } },
			],
			defaultSpace: "example.backlog.com",
		} as never);

		const mod = await import("#commands/config/list.ts");
		await mod.default.run?.({
			args: {},
		} as never);

		expect(consola.log).toHaveBeenCalledWith("default_space=example.backlog.com");
		expect(consola.log).toHaveBeenCalledWith("Authenticated spaces:");
		expect(consola.log).toHaveBeenCalledWith("  example.backlog.com (default) [api-key]");
		expect(consola.log).toHaveBeenCalledWith("  other.backlog.com [oauth]");
	});

	it("スペースが空の場合はデフォルトスペースもスペース一覧も表示しない", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [],
			defaultSpace: undefined,
		} as never);

		const mod = await import("#commands/config/list.ts");
		await mod.default.run?.({
			args: {},
		} as never);

		expect(consola.log).not.toHaveBeenCalledWith(expect.stringContaining("default_space="));
		expect(consola.log).not.toHaveBeenCalledWith("Authenticated spaces:");
	});
});
