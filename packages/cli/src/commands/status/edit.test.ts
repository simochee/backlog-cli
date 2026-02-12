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

describe("status edit", () => {
	it("ステータスを更新する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Done" });

		const mod = await import("#commands/status/edit.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ", name: "Done" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/statuses/1",
			expect.objectContaining({
				method: "PATCH",
				body: expect.objectContaining({ name: "Done" }),
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Updated status #1: Done");
	});

	it("指定フィールドのみ PATCH ボディに含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Status" });

		const mod = await import("#commands/status/edit.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ", color: "#ffffff" } } as never);

		const callBody = mockClient.mock.calls[0]?.[1]?.body;
		expect(callBody).toHaveProperty("color", "#ffffff");
		expect(callBody).not.toHaveProperty("name");
	});
});
