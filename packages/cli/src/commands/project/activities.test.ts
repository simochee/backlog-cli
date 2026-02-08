import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));
vi.mock("#utils/format.ts", () => ({
	formatDate: vi.fn(() => "2024-01-01"),
	getActivityLabel: vi.fn(() => "Issue Created"),
}));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("project activities", () => {
	it("アクティビティを表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{
				type: 1,
				createdUser: { name: "User" },
				content: { summary: "Test issue" },
				project: { projectKey: "PROJ" },
				created: "2024-01-01T00:00:00Z",
			},
		]);

		const mod = await import("#commands/project/activities.ts");
		await mod.default.run?.({ args: { projectKey: "PROJ", limit: "20" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/activities",
			expect.objectContaining({ query: { count: 20 } }),
		);
		expect(consola.log).toHaveBeenCalled();
	});

	it("0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/project/activities.ts");
		await mod.default.run?.({ args: { projectKey: "PROJ", limit: "20" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No activities found.");
	});
});
