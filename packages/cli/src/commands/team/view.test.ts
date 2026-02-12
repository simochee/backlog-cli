import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/format.ts", () => ({
	formatDate: mock(() => "2024-01-01"),
}));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

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

	describe("--json", () => {
		let writeSpy: ReturnType<typeof spyOn>;

		beforeEach(() => {
			writeSpy = spyOn(process.stdout, "write").mockImplementation(() => true);
		});

		afterEach(() => {
			writeSpy.mockRestore();
		});

		it("--json で JSON を出力する", async () => {
			const mockClient = setupMockClient(getClient);
			const data = {
				id: 1,
				name: "Team A",
				createdUser: { name: "Creator" },
				created: "2024-01-01",
				updated: "2024-01-02",
				members: [{ name: "User A", userId: "userA" }],
			};
			mockClient.mockResolvedValue(data);

			const mod = await import("#commands/team/view.ts");
			await mod.default.run?.({ args: { "team-id": "1", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output.name).toBe("Team A");
		});
	});
});
