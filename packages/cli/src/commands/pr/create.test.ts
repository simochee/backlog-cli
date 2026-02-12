import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/resolve.ts", () => ({
	resolveProjectArg: mock(() => "PROJ"),
	resolveUserId: mock(() => Promise.resolve(999)),
}));
mock.module("consola", () => ({ default: mockConsola }));
mock.module("#utils/prompt.ts", () => {
	const fn = mock((_label: string, value: string) => Promise.resolve(value));
	return { default: fn, promptRequired: fn };
});
mock.module("#utils/url.ts", () => ({
	openUrl: mock(),
	pullRequestUrl: mock(() => "https://example.backlog.com/git/PROJ/repo/pullRequests/1"),
}));

const { getClient } = await import("#utils/client.ts");
const { resolveUserId } = await import("#utils/resolve.ts");
const { default: consola } = await import("consola");

const mockCreatedPr = {
	number: 1,
	summary: "New PR",
};

describe("pr create", () => {
	it("PRを作成する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockCreatedPr);

		const mod = await import("#commands/pr/create.ts");
		await mod.default.run?.({
			args: { project: "PROJ", repo: "repo", title: "New PR", base: "main", branch: "feature/test" },
		} as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/git/repositories/repo/pullRequests",
			expect.objectContaining({
				method: "POST",
				body: expect.objectContaining({
					summary: "New PR",
					base: "main",
					branch: "feature/test",
				}),
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Created PR #1: New PR");
	});

	it("assigneeを指定する", async () => {
		const mockClient = setupMockClient(getClient);
		(resolveUserId as any).mockResolvedValue(999);
		mockClient.mockResolvedValue(mockCreatedPr);

		const mod = await import("#commands/pr/create.ts");
		await mod.default.run?.({
			args: {
				project: "PROJ",
				repo: "repo",
				title: "New PR",
				base: "main",
				branch: "feature/test",
				assignee: "user",
			},
		} as never);

		expect(resolveUserId).toHaveBeenCalledWith(mockClient, "user");
		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/git/repositories/repo/pullRequests",
			expect.objectContaining({
				method: "POST",
				body: expect.objectContaining({
					assigneeId: 999,
				}),
			}),
		);
	});

	it("issueを関連付ける", async () => {
		const mockClient = setupMockClient(getClient);
		// /issues/PROJ-1 の返却
		mockClient
			.mockResolvedValueOnce({ id: 42 })
			// PR作成の返却
			.mockResolvedValueOnce(mockCreatedPr);

		const mod = await import("#commands/pr/create.ts");
		await mod.default.run?.({
			args: {
				project: "PROJ",
				repo: "repo",
				title: "New PR",
				base: "main",
				branch: "feature/test",
				issue: "PROJ-1",
			},
		} as never);

		expect(mockClient).toHaveBeenCalledWith("/issues/PROJ-1");
		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/git/repositories/repo/pullRequests",
			expect.objectContaining({
				method: "POST",
				body: expect.objectContaining({
					issueId: 42,
				}),
			}),
		);
	});
});
