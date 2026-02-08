import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/url.ts", () => ({
	openUrl: vi.fn(),
	wikiUrl: vi.fn(() => "https://example.backlog.com/alias/wiki/1"),
}));
vi.mock("#utils/format.ts", () => ({
	formatDate: vi.fn(() => "2024-01-01"),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import { openUrl, wikiUrl } from "#utils/url.ts";
import consola from "consola";

describe("wiki view", () => {
	const mockWiki = {
		id: 1,
		name: "Test Wiki",
		content: "Hello World",
		created: "2024-01-01",
		updated: "2024-01-02",
		createdUser: { name: "User A" },
		updatedUser: { name: "User B" },
		tags: [],
		attachments: [],
	};

	it("Wiki ページ詳細を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockWiki);

		const mod = await import("#commands/wiki/view.ts");
		await mod.default.run?.({ args: { "wiki-id": "1", web: false } } as never);

		expect(mockClient).toHaveBeenCalledWith("/wikis/1");
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Test Wiki"));
	});

	it("--web でブラウザを開く", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockWiki);

		const mod = await import("#commands/wiki/view.ts");
		await mod.default.run?.({ args: { "wiki-id": "1", web: true } } as never);

		expect(wikiUrl).toHaveBeenCalledWith("example.backlog.com", 1);
		expect(openUrl).toHaveBeenCalledWith("https://example.backlog.com/alias/wiki/1");
	});

	it("タグがある場合表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ ...mockWiki, tags: [{ name: "tag1" }, { name: "tag2" }] });

		const mod = await import("#commands/wiki/view.ts");
		await mod.default.run?.({ args: { "wiki-id": "1", web: false } } as never);

		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("tag1, tag2"));
	});
});
