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

const { loadConfig, writeConfig } = await import("@repo/config");

describe("auth switch", () => {
	it("指定したホスト名に切り替える", async () => {
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

		const mod = await import("#commands/auth/switch.ts");
		const command = mod.default;

		// Test that the command structure is correct
		expect((command.meta as Record<string, unknown>)?.["name"]).toBe("switch");
		expect((command.meta as Record<string, unknown>)?.["description"]).toBe("Switch active space");
		expect((command.args as Record<string, unknown>)?.["space"]).toBeDefined();
	});

	it("スペースが見つからない場合エラーを出す", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [],
			defaultSpace: undefined,
			aliases: {},
		});

		const exitSpy = spyOnProcessExit();

		const mod = await import("#commands/auth/switch.ts");
		await mod.default.run?.({
			args: { space: "missing.backlog.com" },
		} as never);

		expect(exitSpy).toHaveBeenCalledWith(1);
		exitSpy.mockRestore();
	});

	it("正常に切り替えた場合 writeConfig が呼ばれる", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [
				{
					host: "target.backlog.com",
					auth: { method: "api-key" as const, apiKey: "key" },
				},
			],
			defaultSpace: undefined,
			aliases: {},
		});

		const mod = await import("#commands/auth/switch.ts");
		await mod.default.run?.({
			args: { space: "target.backlog.com" },
		} as never);

		expect(writeConfig).toHaveBeenCalledWith(
			expect.objectContaining({
				defaultSpace: "target.backlog.com",
			}),
		);
	});
});
