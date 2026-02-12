import { spyOnProcessExit } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

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

const { loadConfig, removeSpace } = await import("@repo/config");
const { default: consola } = await import("consola");

describe("auth logout", () => {
	it("指定ホストをログアウトする", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [
				{
					host: "example.backlog.com",
					auth: { method: "api-key" as const, apiKey: "key" },
				},
			],
			defaultSpace: undefined,
			aliases: {},
		});
		(removeSpace as any).mockResolvedValue(undefined as never);

		const mod = await import("#commands/auth/logout.ts");
		await mod.default.run?.({
			args: { space: "example.backlog.com" },
		} as never);

		expect(removeSpace).toHaveBeenCalledWith("example.backlog.com");
		expect(consola.success).toHaveBeenCalledWith("Logged out of example.backlog.com.");
	});

	it("スペースが0件の場合メッセージを表示する", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [],
			defaultSpace: undefined,
			aliases: {},
		});

		const mod = await import("#commands/auth/logout.ts");
		await mod.default.run?.({
			args: {},
		} as never);

		expect(consola.info).toHaveBeenCalledWith("No spaces are currently authenticated.");
		expect(removeSpace).not.toHaveBeenCalled();
	});

	it("存在しないスペースでエラーを出す", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [],
			defaultSpace: undefined,
			aliases: {},
		});
		(removeSpace as any).mockRejectedValue(new Error("not found"));

		const exitSpy = spyOnProcessExit();

		const mod = await import("#commands/auth/logout.ts");
		await mod.default.run?.({
			args: { space: "nonexistent.backlog.com" },
		} as never);

		expect(consola.error).toHaveBeenCalledWith('Space "nonexistent.backlog.com" is not configured.');
		expect(exitSpy).toHaveBeenCalledWith(1);
		exitSpy.mockRestore();
	});

	it("--space 省略で1件の場合、自動選択してログアウトする", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [
				{
					host: "only.backlog.com",
					auth: { method: "api-key" as const, apiKey: "key" },
				},
			],
			defaultSpace: undefined,
			aliases: {},
		});
		(removeSpace as any).mockResolvedValue(undefined as never);

		const mod = await import("#commands/auth/logout.ts");
		await mod.default.run?.({
			args: {},
		} as never);

		expect(removeSpace).toHaveBeenCalledWith("only.backlog.com");
		expect(consola.success).toHaveBeenCalledWith("Logged out of only.backlog.com.");
	});
});
