import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn((v: string) => v),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("category edit", () => {
	it("カテゴリを更新する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Updated" });

		const mod = await import("#commands/category/edit.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ", name: "Updated" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/categories/1",
			expect.objectContaining({
				method: "PATCH",
				body: { name: "Updated" },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Updated category #1: Updated");
	});
});
