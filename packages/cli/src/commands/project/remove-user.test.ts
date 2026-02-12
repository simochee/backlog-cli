import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("project remove-user", () => {
	it("ユーザーを削除する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 12_345, name: "Test User" });

		const mod = await import("#commands/project/remove-user.ts");
		await mod.default.run?.({ args: { "project-key": "PROJ", "user-id": "12345" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/users",
			expect.objectContaining({
				method: "DELETE",
				body: { userId: 12_345 },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Removed user Test User from project PROJ.");
	});
});
