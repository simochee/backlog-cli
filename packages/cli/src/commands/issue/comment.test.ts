import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/prompt.ts", () => ({ default: mock(() => "prompted comment") }));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: promptRequired } = await import("#utils/prompt.ts");
const { default: consola } = await import("consola");

describe("issue comment", () => {
	const mockComment = {
		id: 1,
		content: "Hello",
		createdUser: { name: "User" },
		created: "2024-01-01T00:00:00Z",
	};

	it("課題にコメントを追加する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockComment);

		const mod = await import("#commands/issue/comment.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-1", body: "Hello" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/issues/PROJ-1/comments", {
			method: "POST",
			body: { content: "Hello" },
		});
		expect(consola.success).toHaveBeenCalledWith("Added comment to PROJ-1 by User");
	});

	it("body 引数で直接指定する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockComment);

		const mod = await import("#commands/issue/comment.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-1", body: "Direct comment" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/issues/PROJ-1/comments", {
			method: "POST",
			body: { content: "Direct comment" },
		});
		expect(promptRequired).not.toHaveBeenCalled();
	});
});
