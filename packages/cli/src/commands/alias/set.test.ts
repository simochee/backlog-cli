import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@repo/config", () => ({
	loadConfig: vi.fn(),
	writeConfig: vi.fn(),
}));

vi.mock("consola", () => ({
	default: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

import { loadConfig, writeConfig } from "@repo/config";

describe("alias set", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("新しいエイリアスを設定する", async () => {
		vi.mocked(loadConfig).mockResolvedValue({
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
		vi.mocked(loadConfig).mockResolvedValue({
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
		vi.mocked(loadConfig).mockResolvedValue({
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
