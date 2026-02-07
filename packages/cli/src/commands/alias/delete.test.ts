import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock<typeof import("@repo/config")>("@repo/config", () => ({
	loadConfig: vi.fn(),
	writeConfig: vi.fn(),
}));

vi.mock<typeof import("consola")>("consola", () => ({
	default: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

import { loadConfig, writeConfig } from "@repo/config";

describe("alias delete", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("既存のエイリアスを削除する", async () => {
		vi.mocked(loadConfig).mockResolvedValue({
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
		vi.mocked(loadConfig).mockResolvedValue({
			spaces: [],
			defaultSpace: undefined,
		} as never);

		const exitSpy = vi
			.spyOn(process, "exit")
			.mockImplementation(() => undefined as never);

		const mod = await import("#commands/alias/delete.ts");
		await mod.default.run?.({
			args: { name: "missing" },
		} as never);

		expect(exitSpy).toHaveBeenCalledWith(1);
		exitSpy.mockRestore();
	});
});
