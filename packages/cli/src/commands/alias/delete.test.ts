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

describe("alias delete", () => {
	it("既存のエイリアスを削除する", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [],
			defaultSpace: undefined,
			aliases: { il: "issue list", pv: "pr view" },
		} as never);

		const mod = await import("#commands/alias/delete.ts");
		await mod.default.run?.({
			args: { name: "il" },
		} as never);

		expect(writeConfig).toHaveBeenCalledWith(
			expect.objectContaining({
				aliases: { pv: "pr view" },
			}),
		);
	});

	it("存在しないエイリアスの場合 process.exit(1) を呼ぶ", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [],
			defaultSpace: undefined,
		} as never);

		const exitSpy = spyOnProcessExit();

		const mod = await import("#commands/alias/delete.ts");
		await mod.default.run?.({
			args: { name: "missing" },
		} as never);

		expect(exitSpy).toHaveBeenCalledWith(1);
		exitSpy.mockRestore();
	});
});
