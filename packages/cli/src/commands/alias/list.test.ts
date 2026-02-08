import { describe, expect, it, vi } from "vitest";

vi.mock("@repo/config", () => ({
	loadConfig: vi.fn(),
}));

vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { loadConfig } from "@repo/config";
import consola from "consola";

describe("alias list", () => {
	it("エイリアスが存在する場合はテーブル形式で表示する", async () => {
		vi.mocked(loadConfig).mockResolvedValue({
			spaces: [],
			defaultSpace: undefined,
			aliases: { il: "issue list", pv: "pr view" },
		} as never);

		const mod = await import("#commands/alias/list.ts");
		await mod.default.run?.({} as never);

		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("ALIAS"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("EXPANSION"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("il"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("issue list"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("pv"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("pr view"));
	});

	it("エイリアスが空の場合は 'No aliases configured.' を表示する", async () => {
		vi.mocked(loadConfig).mockResolvedValue({
			spaces: [],
			defaultSpace: undefined,
			aliases: {},
		} as never);

		const mod = await import("#commands/alias/list.ts");
		await mod.default.run?.({} as never);

		expect(consola.info).toHaveBeenCalledWith("No aliases configured.");
	});
});
