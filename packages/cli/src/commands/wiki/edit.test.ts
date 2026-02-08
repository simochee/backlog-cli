import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("wiki edit", () => {
	it("Wiki ページを更新する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Updated Page" });

		const mod = await import("#commands/wiki/edit.ts");
		await mod.default.run?.({ args: { "wiki-id": "1", name: "Updated Page", body: "New content" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/wikis/1",
			expect.objectContaining({
				method: "PATCH",
				body: expect.objectContaining({ name: "Updated Page", content: "New content" }),
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Updated wiki page #1: Updated Page");
	});

	it("指定フィールドのみ PATCH ボディに含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Page" });

		const mod = await import("#commands/wiki/edit.ts");
		await mod.default.run?.({ args: { "wiki-id": "1", name: "Page" } } as never);

		const callBody = mockClient.mock.calls[0][1].body;
		expect(callBody).toHaveProperty("name");
		expect(callBody).not.toHaveProperty("content");
	});
});
