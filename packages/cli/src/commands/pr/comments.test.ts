import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn(() => "PROJ"),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));
vi.mock("#utils/format.ts", () => ({
	formatDate: vi.fn(() => "2024-01-01"),
}));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("pr comments", () => {
	it("PRコメント一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{ id: 1, content: "First comment", createdUser: { name: "User1" }, created: "2024-01-01T00:00:00Z" },
			{ id: 2, content: "Second comment", createdUser: { name: "User2" }, created: "2024-01-02T00:00:00Z" },
		]);

		const mod = await import("#commands/pr/comments.ts");
		await mod.default.run?.({ args: { number: "1", project: "PROJ", repo: "repo", limit: "20" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/git/repositories/repo/pullRequests/1/comments",
			expect.objectContaining({ query: { count: 20 } }),
		);
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("First comment"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Second comment"));
	});

	it("0件の場合メッセージを表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/pr/comments.ts");
		await mod.default.run?.({ args: { number: "1", project: "PROJ", repo: "repo", limit: "20" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No comments found.");
	});
});
