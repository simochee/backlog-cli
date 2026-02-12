import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/url.ts", () => ({
	openUrl: mock(),
	wikiUrl: mock(() => "https://example.backlog.com/alias/wiki/1"),
}));
mock.module("#utils/format.ts", () => ({
	formatDate: mock(() => "2024-01-01"),
}));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { openUrl, wikiUrl } = await import("#utils/url.ts");
const { default: consola } = await import("consola");

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

	describe("--json", () => {
		let writeSpy: ReturnType<typeof spyOn>;

		beforeEach(() => {
			writeSpy = spyOn(process.stdout, "write").mockImplementation(() => true);
		});

		afterEach(() => {
			writeSpy.mockRestore();
		});

		it("--json で JSON を出力する", async () => {
			const mockClient = setupMockClient(getClient);
			mockClient.mockResolvedValue(mockWiki);

			const mod = await import("#commands/wiki/view.ts");
			await mod.default.run?.({ args: { "wiki-id": "1", web: false, json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output.name).toBe("Test Wiki");
		});
	});
});
