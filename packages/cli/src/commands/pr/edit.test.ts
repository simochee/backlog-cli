import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));
mock.module("#utils/resolve.ts", () => ({
	resolveProjectArg: mock(() => "PROJ"),
	resolveUserId: mock(() => Promise.resolve(999)),
}));

const { getClient } = await import("#utils/client.ts");
const { resolveUserId } = await import("#utils/resolve.ts");
const { default: consola } = await import("consola");

describe("pr edit", () => {
	it("PRを更新する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ number: 1, summary: "Updated" });

		const mod = await import("#commands/pr/edit.ts");
		await mod.default.run?.({ args: { number: "1", project: "PROJ", repo: "repo", title: "Updated" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/git/repositories/repo/pullRequests/1",
			expect.objectContaining({
				method: "PATCH",
				body: { summary: "Updated" },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Updated PR #1: Updated");
	});

	it("assignee を変更する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ number: 1, summary: "Test PR" });

		const mod = await import("#commands/pr/edit.ts");
		await mod.default.run?.({ args: { number: "1", project: "PROJ", repo: "repo", assignee: "user" } } as never);

		expect(resolveUserId).toHaveBeenCalledWith(mockClient, "user");
		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/git/repositories/repo/pullRequests/1",
			expect.objectContaining({
				method: "PATCH",
				body: { assigneeId: 999 },
			}),
		);
	});
});
