import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

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
