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

describe("alias set", () => {
	it("新しいエイリアスを設定する", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [],
			defaultSpace: undefined,
		} as never);

		const mod = await import("#commands/alias/set.ts");
		await mod.default.run?.({
			args: { name: "il", expansion: "issue list", shell: false },
		} as never);

		expect(writeConfig).toHaveBeenCalledWith(
			expect.objectContaining({
				aliases: { il: "issue list" },
			}),
		);
	});

	it("シェルコマンドとしてエイリアスを設定する", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [],
			defaultSpace: undefined,
		} as never);

		const mod = await import("#commands/alias/set.ts");
		await mod.default.run?.({
			args: { name: "custom", expansion: "echo hello", shell: true },
		} as never);

		expect(writeConfig).toHaveBeenCalledWith(
			expect.objectContaining({
				aliases: { custom: "!echo hello" },
			}),
		);
	});

	it("既存のエイリアスを上書きする", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [],
			defaultSpace: undefined,
			aliases: { il: "issue list" },
		} as never);

		const mod = await import("#commands/alias/set.ts");
		await mod.default.run?.({
			args: { name: "il", expansion: "issue list --limit 50", shell: false },
		} as never);

		expect(writeConfig).toHaveBeenCalledWith(
			expect.objectContaining({
				aliases: { il: "issue list --limit 50" },
			}),
		);
	});
});
