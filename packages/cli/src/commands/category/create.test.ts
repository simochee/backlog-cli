import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { beforeEach, describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/resolve.ts", () => ({
	resolveProjectArg: mock((v: string) => v),
}));
mock.module("#utils/prompt.ts", () => {
	const fn = mock();
	return { default: fn, promptRequired: fn };
});
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: promptRequired } = await import("#utils/prompt.ts");
const { default: consola } = await import("consola");

describe("category create", () => {
	beforeEach(() => {
		(promptRequired as any).mockImplementation((_label: string, value?: string) => Promise.resolve(value as string));
	});

	it("カテゴリを作成する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "New Category" });

		const mod = await import("#commands/category/create.ts");
		await mod.default.run?.({ args: { project: "PROJ", name: "New Category" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/categories",
			expect.objectContaining({
				method: "POST",
				body: { name: "New Category" },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Created category #1: New Category");
	});
});
