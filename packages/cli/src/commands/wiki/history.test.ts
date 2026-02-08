import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/format.ts", () => ({
	formatDate: vi.fn(() => "2024-01-01"),
	padEnd: vi.fn((s: string, n: number) => s.padEnd(n)),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("wiki history", () => {
	it("Wiki ページ履歴を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{ version: 3, name: "Page v3", created: "2024-01-03", createdUser: { name: "User A" } },
			{ version: 2, name: "Page v2", created: "2024-01-02", createdUser: { name: "User B" } },
		]);

		const mod = await import("#commands/wiki/history.ts");
		await mod.default.run?.({ args: { "wiki-id": "1", limit: "20" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/wikis/1/history", expect.objectContaining({ query: { count: 20 } }));
		expect(consola.log).toHaveBeenCalledTimes(3);
	});

	it("0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/wiki/history.ts");
		await mod.default.run?.({ args: { "wiki-id": "1", limit: "20" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No history found.");
	});
});
