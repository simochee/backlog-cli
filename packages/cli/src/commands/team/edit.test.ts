import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("team edit", () => {
	it("チームを更新する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Updated Team" });

		const mod = await import("#commands/team/edit.ts");
		await mod.default.run?.({ args: { "team-id": "1", name: "Updated Team" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/teams/1",
			expect.objectContaining({
				method: "PATCH",
				body: expect.objectContaining({ name: "Updated Team" }),
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Updated team #1: Updated Team");
	});

	it("--members でメンバーを更新する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Team" });

		const mod = await import("#commands/team/edit.ts");
		await mod.default.run?.({ args: { "team-id": "1", members: "4,5" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/teams/1",
			expect.objectContaining({
				method: "PATCH",
				body: expect.objectContaining({ "members[]": [4, 5] }),
			}),
		);
	});
});
