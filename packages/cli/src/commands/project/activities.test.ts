vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => ({
	default: { log: vi.fn(), info: vi.fn(), success: vi.fn(), error: vi.fn() },
}));
vi.mock("#utils/format.ts", () => ({
	formatDate: vi.fn(() => "2024-01-01"),
	getActivityLabel: vi.fn(() => "Issue Created"),
}));

import { getClient } from "#utils/client.ts";
import consola from "consola";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("project activities", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("アクティビティを表示する", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
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
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/project/activities.ts");
		await mod.default.run?.({ args: { projectKey: "PROJ", limit: "20" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No activities found.");
	});
});
