import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("dashboard", () => {
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

		const mod = await import("#commands/dashboard.ts");
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

		const mod = await import("#commands/dashboard.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(consola.log).toHaveBeenCalledWith("  No issues assigned to you.");
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

			mockClient.mockResolvedValueOnce({ id: 1, name: "Test User" });
			mockClient.mockResolvedValueOnce([{ issueKey: "PROJ-1", summary: "Issue 1", status: { name: "Open" } }]);
			mockClient.mockResolvedValueOnce({ count: 3 });
			mockClient.mockResolvedValueOnce([]);

			const mod = await import("#commands/dashboard.ts");
			await mod.default.run?.({ args: { json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output.user.name).toBe("Test User");
			expect(output.notificationCount.count).toBe(3);
		});
	});
});
