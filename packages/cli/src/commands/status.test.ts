import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("status", () => {
	it("ダッシュボードサマリーを表示する", async () => {
		const mockClient = setupMockClient(getClient);

		// /users/myself
		mockClient.mockResolvedValueOnce({ id: 1, name: "Test User" });
		// Promise.all: issues, notificationCount, recentIssues
		mockClient.mockResolvedValueOnce([
			{ issueKey: "PROJ-1", summary: "Issue 1", status: { name: "Open" } },
			{ issueKey: "PROJ-2", summary: "Issue 2", status: { name: "Open" } },
		]);
		mockClient.mockResolvedValueOnce({ count: 3 });
		mockClient.mockResolvedValueOnce([{ issue: { issueKey: "PROJ-3", summary: "Recent" } }]);

		const mod = await import("#commands/status.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(mockClient).toHaveBeenCalledWith("/users/myself");
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Test User"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("3"));
	});

	it("課題がない場合メッセージを表示する", async () => {
		const mockClient = setupMockClient(getClient);

		mockClient.mockResolvedValueOnce({ id: 1, name: "Test User" });
		mockClient.mockResolvedValueOnce([]);
		mockClient.mockResolvedValueOnce({ count: 0 });
		mockClient.mockResolvedValueOnce([]);

		const mod = await import("#commands/status.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(consola.log).toHaveBeenCalledWith("  No issues assigned to you.");
	});
});
