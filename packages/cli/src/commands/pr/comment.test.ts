import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({ resolveProjectArg: vi.fn(() => "PROJ") }));
vi.mock("#utils/prompt.ts", () => ({ promptRequired: vi.fn(() => "prompted comment") }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import { promptRequired } from "#utils/prompt.ts";
import consola from "consola";

describe("pr comment", () => {
	const mockComment = {
		id: 1,
		content: "Great work!",
		createdUser: { name: "User" },
		created: "2024-01-01T00:00:00Z",
	};

	it("PRにコメントを追加する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockComment);

		const mod = await import("#commands/pr/comment.ts");
		await mod.default.run?.({ args: { number: "1", project: "PROJ", repo: "repo", body: "Great work!" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/projects/PROJ/git/repositories/repo/pullRequests/1/comments", {
			method: "POST",
			body: { content: "Great work!" },
		});
		expect(consola.success).toHaveBeenCalledWith("Added comment to PR #1 by User");
	});

	it("body 引数で直接指定する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockComment);

		const mod = await import("#commands/pr/comment.ts");
		await mod.default.run?.({ args: { number: "1", project: "PROJ", repo: "repo", body: "Direct" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/projects/PROJ/git/repositories/repo/pullRequests/1/comments", {
			method: "POST",
			body: { content: "Direct" },
		});
		expect(promptRequired).not.toHaveBeenCalled();
	});
});
