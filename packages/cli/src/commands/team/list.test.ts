import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/format.ts", () => ({
	padEnd: vi.fn((s: string, n: number) => s.padEnd(n)),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("team list", () => {
	it("チーム一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{ id: 1, name: "Team A", members: [{ id: 1 }, { id: 2 }] },
			{ id: 2, name: "Team B", members: [{ id: 3 }] },
		]);

		const mod = await import("#commands/team/list.ts");
		await mod.default.run?.({ args: { order: "desc", limit: "20" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/teams",
			expect.objectContaining({ query: expect.objectContaining({ count: 20 }) }),
		);
		expect(consola.log).toHaveBeenCalledTimes(3);
	});

	it("0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/team/list.ts");
		await mod.default.run?.({ args: { order: "desc", limit: "20" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No teams found.");
	});
});
