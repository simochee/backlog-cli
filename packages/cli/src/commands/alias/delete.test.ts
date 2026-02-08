import { spyOnProcessExit } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("@repo/config", () => ({
	loadConfig: vi.fn(),
	writeConfig: vi.fn(),
}));

vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { loadConfig, writeConfig } from "@repo/config";

describe("alias delete", () => {
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

		const exitSpy = spyOnProcessExit();

		const mod = await import("#commands/alias/delete.ts");
		await mod.default.run?.({
			args: { name: "missing" },
		} as never);

		expect(exitSpy).toHaveBeenCalledWith(1);
		exitSpy.mockRestore();
	});
});
