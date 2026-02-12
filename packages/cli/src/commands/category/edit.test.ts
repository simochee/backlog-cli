import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/resolve.ts", () => ({
	resolveProjectArg: mock((v: string) => v),
}));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

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
