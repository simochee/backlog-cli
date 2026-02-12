import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));
mock.module("#utils/format.ts", () => ({
	formatIssueLine: mock(() => "PROJ-1  Open  Bug  High  user  Summary"),
	padEnd: mock((s: string, n: number) => s.padEnd(n)),
}));
mock.module("#utils/resolve.ts", () => ({
	resolveProjectId: mock(),
	resolveUserId: mock(),
	resolvePriorityId: mock(),
}));

const { getClient } = await import("#utils/client.ts");
const { formatIssueLine } = await import("#utils/format.ts");
const { resolveProjectId, resolveUserId } = await import("#utils/resolve.ts");
const { default: consola } = await import("consola");

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
		(resolveProjectId as any).mockResolvedValue(12_345);
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
		(resolveUserId as any).mockResolvedValue(999);
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
			const data = [
				{ issueKey: "PROJ-1", summary: "Issue 1" },
				{ issueKey: "PROJ-2", summary: "Issue 2" },
			];
			mockClient.mockResolvedValue(data);

			const mod = await import("#commands/issue/list.ts");
			await mod.default.run?.({ args: { limit: "20", sort: "updated", order: "desc", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output).toEqual(data);
		});
	});
});
