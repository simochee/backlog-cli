import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn((v: string) => v),
}));
vi.mock("#utils/format.ts", () => ({
	formatDate: vi.fn(() => "2024-01-01"),
	padEnd: vi.fn((s: string, n: number) => s.padEnd(n)),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("wiki list", () => {
	it("Wiki ページ一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{ id: 1, name: "Page 1", updated: "2024-01-01", createdUser: { name: "User A" } },
			{ id: 2, name: "Page 2", updated: "2024-01-02", createdUser: { name: "User B" } },
		]);

		const mod = await import("#commands/wiki/list.ts");
		await mod.default.run?.({ args: { project: "PROJ", limit: "20", sort: "updated", order: "desc" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/wikis",
			expect.objectContaining({ query: expect.objectContaining({ projectIdOrKey: "PROJ" }) }),
		);
		expect(consola.log).toHaveBeenCalledTimes(3);
	});

	it("0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/wiki/list.ts");
		await mod.default.run?.({ args: { project: "PROJ", limit: "20", sort: "updated", order: "desc" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No wiki pages found.");
	});

	it("keyword クエリを含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/wiki/list.ts");
		await mod.default.run?.({
			args: { project: "PROJ", limit: "20", sort: "updated", order: "desc", keyword: "test" },
		} as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/wikis",
			expect.objectContaining({ query: expect.objectContaining({ keyword: "test" }) }),
		);
	});
});
