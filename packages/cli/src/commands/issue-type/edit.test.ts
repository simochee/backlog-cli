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

describe("issue-type edit", () => {
	it("課題種別を更新する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Feature" });

		const mod = await import("#commands/issue-type/edit.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ", name: "Feature" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/issueTypes/1",
			expect.objectContaining({
				method: "PATCH",
				body: expect.objectContaining({ name: "Feature" }),
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Updated issue type #1: Feature");
	});

	it("指定フィールドのみ PATCH ボディに含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Type" });

		const mod = await import("#commands/issue-type/edit.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ", color: "#000000" } } as never);

		const callBody = mockClient.mock.calls[0]?.[1]?.body;
		expect(callBody).toHaveProperty("color", "#000000");
		expect(callBody).not.toHaveProperty("name");
	});
});
