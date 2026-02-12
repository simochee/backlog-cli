import { setupMockClient } from "@repo/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/url.ts", () => ({
	openUrl: vi.fn(),
	documentUrl: vi.fn(() => "https://example.backlog.com/projects/PROJ/document/abc-123"),
}));
vi.mock("#utils/format.ts", () => ({
	formatDate: vi.fn(() => "2024-01-01"),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import { documentUrl, openUrl } from "#utils/url.ts";
import consola from "consola";

describe("document view", () => {
	const mockDoc = {
		id: "abc-123",
		title: "Test Document",
		plain: "Hello World",
		emoji: "",
		created: "2024-01-01",
		updated: "2024-01-02",
		createdUser: { name: "User A" },
		updatedUser: { name: "User B" },
		tags: [],
		attachments: [],
	};

	it("ドキュメント詳細を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockDoc);

		const mod = await import("#commands/document/view.ts");
		await mod.default.run?.({ args: { "document-id": "abc-123", web: false } } as never);

		expect(mockClient).toHaveBeenCalledWith("/documents/abc-123");
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Test Document"));
	});

	it("--web でブラウザを開く", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockDoc);

		const mod = await import("#commands/document/view.ts");
		await mod.default.run?.({ args: { "document-id": "abc-123", web: true, project: "PROJ" } } as never);

		expect(documentUrl).toHaveBeenCalledWith("example.backlog.com", "PROJ", "abc-123");
		expect(openUrl).toHaveBeenCalledWith("https://example.backlog.com/projects/PROJ/document/abc-123");
	});

	it("タグがある場合表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ ...mockDoc, tags: [{ name: "tag1" }, { name: "tag2" }] });

		const mod = await import("#commands/document/view.ts");
		await mod.default.run?.({ args: { "document-id": "abc-123", web: false } } as never);

		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("tag1, tag2"));
	});

	describe("--json", () => {
		let writeSpy: ReturnType<typeof vi.spyOn>;

		beforeEach(() => {
			writeSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
		});

		afterEach(() => {
			writeSpy.mockRestore();
		});

		it("--json で JSON を出力する", async () => {
			const mockClient = setupMockClient(getClient);
			mockClient.mockResolvedValue(mockDoc);

			const mod = await import("#commands/document/view.ts");
			await mod.default.run?.({ args: { "document-id": "abc-123", web: false, json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output.title).toBe("Test Document");
		});
	});
});
