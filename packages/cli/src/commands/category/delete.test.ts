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

describe("category delete", () => {
	it("--yes でカテゴリを削除する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Delete Me" });

		const mod = await import("#commands/category/delete.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ", yes: true } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/categories/1",
			expect.objectContaining({ method: "DELETE" }),
		);
		expect(consola.prompt).not.toHaveBeenCalled();
		expect(consola.success).toHaveBeenCalledWith("Deleted category #1: Delete Me");
	});

	it("確認キャンセルで削除しない", async () => {
		setupMockClient(getClient);
		(consola.prompt as any).mockResolvedValue(false as never);

		const mod = await import("#commands/category/delete.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ" } } as never);

		expect(consola.prompt).toHaveBeenCalledOnce();
		expect(consola.info).toHaveBeenCalledWith("Cancelled.");
	});
});
