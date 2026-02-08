import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/format.ts", () => ({
	formatDate: vi.fn(() => "2024-01-01"),
	getActivityLabel: vi.fn(() => "Issue Created"),
	padEnd: vi.fn((s: string, n: number) => s.padEnd(n)),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("user activities", () => {
	it("ユーザーのアクティビティ一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{ id: 1, type: 1, created: "2024-01-01", project: { projectKey: "PROJ" } },
			{ id: 2, type: 2, created: "2024-01-02", project: { projectKey: "PROJ" } },
		]);

		const mod = await import("#commands/user/activities.ts");
		await mod.default.run?.({ args: { "user-id": "1", limit: "20" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/users/1/activities", expect.objectContaining({ query: { count: 20 } }));
		expect(consola.log).toHaveBeenCalledTimes(3);
	});

	it("0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/user/activities.ts");
		await mod.default.run?.({ args: { "user-id": "1", limit: "20" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No activities found.");
	});

	it("--activity-type クエリを含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/user/activities.ts");
		await mod.default.run?.({ args: { "user-id": "1", limit: "20", "activity-type": "1,2" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/users/1/activities",
			expect.objectContaining({ query: expect.objectContaining({ "activityTypeId[]": [1, 2] }) }),
		);
	});
});
