import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/resolve.ts", () => ({ resolveProjectArg: mock(() => "PROJ") }));
mock.module("#utils/prompt.ts", () => ({ default: mock(() => "prompted comment") }));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: promptRequired } = await import("#utils/prompt.ts");
const { default: consola } = await import("consola");

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
