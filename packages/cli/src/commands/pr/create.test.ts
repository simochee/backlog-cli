import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn(() => "PROJ"),
	resolveUserId: vi.fn(() => Promise.resolve(999)),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));
vi.mock("#utils/prompt.ts", () => {
	const fn = vi.fn((_label: string, value: string) => Promise.resolve(value));
	return { default: fn, promptRequired: fn };
});
vi.mock("#utils/url.ts", () => ({
	openUrl: vi.fn(),
	pullRequestUrl: vi.fn(() => "https://example.backlog.com/git/PROJ/repo/pullRequests/1"),
}));

import { getClient } from "#utils/client.ts";
import { resolveUserId } from "#utils/resolve.ts";
import consola from "consola";

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
		vi.mocked(resolveUserId).mockResolvedValue(999);
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
