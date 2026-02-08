import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/format.ts", () => ({
	formatDate: vi.fn(() => "2024-01-01"),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("team view", () => {
	it("チーム詳細を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({
			id: 1,
			name: "Team A",
			createdUser: { name: "Creator" },
			created: "2024-01-01",
			updated: "2024-01-02",
			members: [{ name: "User A", userId: "userA" }],
		});

		const mod = await import("#commands/team/view.ts");
		await mod.default.run?.({ args: { "team-id": "1" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/teams/1");
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Team A"));
	});

	it("メンバー一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({
			id: 1,
			name: "Team A",
			createdUser: { name: "Creator" },
			created: "2024-01-01",
			updated: "2024-01-02",
			members: [
				{ name: "User A", userId: "userA" },
				{ name: "User B", userId: "userB" },
			],
		});

		const mod = await import("#commands/team/view.ts");
		await mod.default.run?.({ args: { "team-id": "1" } } as never);

		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("User A (userA)"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("User B (userB)"));
	});
});
