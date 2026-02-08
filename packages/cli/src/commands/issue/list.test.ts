import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));
vi.mock("#utils/format.ts", () => ({
	formatIssueLine: vi.fn(() => "PROJ-1  Open  Bug  High  user  Summary"),
	padEnd: vi.fn((s: string, n: number) => s.padEnd(n)),
}));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectId: vi.fn(),
	resolveUserId: vi.fn(),
	resolvePriorityId: vi.fn(),
}));

import { getClient } from "#utils/client.ts";
import { formatIssueLine } from "#utils/format.ts";
import { resolveProjectId, resolveUserId } from "#utils/resolve.ts";
import consola from "consola";

describe("issue list", () => {
	it("課題一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{ issueKey: "PROJ-1", summary: "Issue 1" },
			{ issueKey: "PROJ-2", summary: "Issue 2" },
		]);

		const mod = await import("#commands/issue/list.ts");
		await mod.default.run?.({ args: { limit: "20", sort: "updated", order: "desc" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/issues", expect.objectContaining({ query: expect.any(Object) }));
		// ヘッダー1行 + 課題2行 = 3回
		expect(consola.log).toHaveBeenCalledTimes(3);
		expect(formatIssueLine).toHaveBeenCalledTimes(2);
	});

	it("0件の場合メッセージを表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/issue/list.ts");
		await mod.default.run?.({ args: { limit: "20", sort: "updated", order: "desc" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No issues found.");
		expect(consola.log).not.toHaveBeenCalled();
	});

	it("--project でプロジェクトを指定する", async () => {
		const mockClient = setupMockClient(getClient);
		vi.mocked(resolveProjectId).mockResolvedValue(12_345);
		mockClient.mockResolvedValue([{ issueKey: "PROJ-1", summary: "Issue 1" }]);

		const mod = await import("#commands/issue/list.ts");
		await mod.default.run?.({ args: { project: "PROJ", limit: "20", sort: "updated", order: "desc" } } as never);

		expect(resolveProjectId).toHaveBeenCalledWith(mockClient, "PROJ");
		expect(mockClient).toHaveBeenCalledWith(
			"/issues",
			expect.objectContaining({
				query: expect.objectContaining({ "projectId[]": [12_345] }),
			}),
		);
	});

	it("--assignee で担当者フィルタを適用する", async () => {
		const mockClient = setupMockClient(getClient);
		vi.mocked(resolveUserId).mockResolvedValue(999);
		mockClient.mockResolvedValue([{ issueKey: "PROJ-1", summary: "Issue 1" }]);

		const mod = await import("#commands/issue/list.ts");
		await mod.default.run?.({ args: { assignee: "@me", limit: "20", sort: "updated", order: "desc" } } as never);

		expect(resolveUserId).toHaveBeenCalledWith(mockClient, "@me");
		expect(mockClient).toHaveBeenCalledWith(
			"/issues",
			expect.objectContaining({
				query: expect.objectContaining({ "assigneeId[]": [999] }),
			}),
		);
	});
});
