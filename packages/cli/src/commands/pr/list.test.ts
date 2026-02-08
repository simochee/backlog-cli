import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn(() => "PROJ"),
	resolveUserId: vi.fn(() => Promise.resolve(999)),
}));
vi.mock("consola", () => ({
	default: { log: vi.fn(), info: vi.fn(), success: vi.fn(), error: vi.fn(), start: vi.fn() },
}));
vi.mock("#utils/format.ts", () => ({
	formatPullRequestLine: vi.fn(() => "#1  Open  user  branch  Summary"),
	padEnd: vi.fn((s: string, n: number) => s.padEnd(n)),
}));
vi.mock("@repo/api", () => ({
	PR_STATUS: { Open: 1, Closed: 2, Merged: 3 },
}));

import { getClient } from "#utils/client.ts";
import { formatPullRequestLine } from "#utils/format.ts";
import { resolveUserId } from "#utils/resolve.ts";
import consola from "consola";

describe("pr list", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("PR一覧を表示する", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
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
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/pr/list.ts");
		await mod.default.run?.({ args: { project: "PROJ", repo: "repo", status: "open", limit: "20" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No pull requests found.");
		expect(consola.log).not.toHaveBeenCalled();
	});

	it("--status でフィルタする", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
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
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);

		const mod = await import("#commands/pr/list.ts");
		await mod.default.run?.({ args: { project: "PROJ", repo: "repo", status: "open", limit: "0" } } as never);

		expect(consola.error).toHaveBeenCalledWith("--limit must be a number between 1 and 100.");
		expect(exitSpy).toHaveBeenCalledWith(1);

		exitSpy.mockRestore();
	});

	it("--assignee で担当者フィルタを適用する", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		vi.mocked(resolveUserId).mockResolvedValue(999);
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
});
