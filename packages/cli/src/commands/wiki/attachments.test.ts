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

describe("wiki attachments", () => {
	it("Wiki ページの添付ファイル一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{ id: 1, name: "file.txt", size: 1024, created: "2024-01-01", createdUser: { name: "User A" } },
			{ id: 2, name: "image.png", size: 2048, created: "2024-01-02", createdUser: { name: "User B" } },
		]);

		const mod = await import("#commands/wiki/attachments.ts");
		await mod.default.run?.({ args: { "wiki-id": "1" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/wikis/1/attachments");
		expect(consola.log).toHaveBeenCalledTimes(3);
	});

	it("0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/wiki/attachments.ts");
		await mod.default.run?.({ args: { "wiki-id": "1" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No attachments found.");
	});
});
