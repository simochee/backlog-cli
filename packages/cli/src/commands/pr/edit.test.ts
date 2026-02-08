import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn(() => "PROJ"),
	resolveUserId: vi.fn(() => Promise.resolve(999)),
}));

import { getClient } from "#utils/client.ts";
import { resolveUserId } from "#utils/resolve.ts";
import consola from "consola";

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
