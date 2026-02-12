import { setupMockClient, spyOnProcessExit } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/resolve.ts", () => ({
	resolveProjectArg: mock(() => "PROJ"),
	resolveUserId: mock(() => Promise.resolve(999)),
}));
mock.module("consola", () => ({ default: mockConsola }));
mock.module("#utils/format.ts", () => ({
	formatPullRequestLine: mock(() => "#1  Open  user  branch  Summary"),
	padEnd: mock((s: string, n: number) => s.padEnd(n)),
}));
mock.module("@repo/api", () => ({
	createClient: mock(),
	formatResetTime: mock(),
	exchangeAuthorizationCode: mock(),
	refreshAccessToken: mock(),
	DEFAULT_PRIORITY_ID: 3,
	PR_STATUS: { Open: 1, Closed: 2, Merged: 3 },
	PRIORITY: { High: 2, Normal: 3, Low: 4 },
	RESOLUTION: { Fixed: 0, WontFix: 1, Invalid: 2, Duplicate: 3, CannotReproduce: 4 },
}));

const { getClient } = await import("#utils/client.ts");
const { formatPullRequestLine } = await import("#utils/format.ts");
const { resolveUserId } = await import("#utils/resolve.ts");
const { default: consola } = await import("consola");

describe("pr list", () => {
	it("PR一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{ number: 1, summary: "PR 1", status: { name: "Open" } },
			{ number: 2, summary: "PR 2", status: { name: "Open" } },
		]);

		const mod = await import("#commands/pr/list.ts");
		await mod.default.run?.({ args: { project: "PROJ", repo: "repo", status: "open", limit: "20" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/git/repositories/repo/pullRequests",
			expect.objectContaining({ query: expect.any(Object) }),
		);
		// ヘッダー1行 + PR2行 = 3回
		expect(consola.log).toHaveBeenCalledTimes(3);
		expect(formatPullRequestLine).toHaveBeenCalledTimes(2);
	});

	it("0件の場合メッセージを表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/pr/list.ts");
		await mod.default.run?.({ args: { project: "PROJ", repo: "repo", status: "open", limit: "20" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No pull requests found.");
		expect(consola.log).not.toHaveBeenCalled();
	});

	it("--status でフィルタする", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([{ number: 1, summary: "PR 1", status: { name: "Open" } }]);

		const mod = await import("#commands/pr/list.ts");
		await mod.default.run?.({ args: { project: "PROJ", repo: "repo", status: "open", limit: "20" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/git/repositories/repo/pullRequests",
			expect.objectContaining({
				query: expect.objectContaining({ "statusId[]": [1] }),
			}),
		);
	});

	it("無効な --limit でエラーを表示する", async () => {
		setupMockClient(getClient);
		const exitSpy = spyOnProcessExit();

		const mod = await import("#commands/pr/list.ts");
		await mod.default.run?.({ args: { project: "PROJ", repo: "repo", status: "open", limit: "0" } } as never);

		expect(consola.error).toHaveBeenCalledWith("--limit must be a number between 1 and 100.");
		expect(exitSpy).toHaveBeenCalledWith(1);

		exitSpy.mockRestore();
	});

	it("--assignee で担当者フィルタを適用する", async () => {
		const mockClient = setupMockClient(getClient);
		(resolveUserId as any).mockResolvedValue(999);
		mockClient.mockResolvedValue([{ number: 1, summary: "PR 1", status: { name: "Open" } }]);

		const mod = await import("#commands/pr/list.ts");
		await mod.default.run?.({
			args: { project: "PROJ", repo: "repo", status: "open", limit: "20", assignee: "@me" },
		} as never);

		expect(resolveUserId).toHaveBeenCalledWith(mockClient, "@me");
		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/git/repositories/repo/pullRequests",
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
			const data = [{ number: 1, summary: "PR 1", status: { name: "Open" } }];
			mockClient.mockResolvedValue(data);

			const mod = await import("#commands/pr/list.ts");
			await mod.default.run?.({
				args: { project: "PROJ", repo: "repo", status: "open", limit: "20", json: "" },
			} as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output).toEqual(data);
		});
	});
});
