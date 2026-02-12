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

describe("milestone edit", () => {
	it("マイルストーンを更新する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "v1.1" });

		const mod = await import("#commands/milestone/edit.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ", name: "v1.1" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/versions/1",
			expect.objectContaining({
				method: "PATCH",
				body: expect.objectContaining({ name: "v1.1" }),
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Updated milestone #1: v1.1");
	});

	it("指定フィールドのみ PATCH ボディに含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Milestone" });

		const mod = await import("#commands/milestone/edit.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ", archived: true } } as never);

		const callBody = mockClient.mock.calls[0]?.[1]?.body;
		expect(callBody).toHaveProperty("archived", true);
		expect(callBody).not.toHaveProperty("name");
	});
});
