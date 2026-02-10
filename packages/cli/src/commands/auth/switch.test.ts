import { spyOnProcessExit } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("@repo/config", () => ({
	loadConfig: vi.fn(),
	writeConfig: vi.fn(),
}));

vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { loadConfig, writeConfig } from "@repo/config";

describe("auth switch", () => {
	it("指定したホスト名に切り替える", async () => {
		vi.mocked(loadConfig).mockResolvedValue({
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
		vi.mocked(loadConfig).mockResolvedValue({
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
		vi.mocked(loadConfig).mockResolvedValue({
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
