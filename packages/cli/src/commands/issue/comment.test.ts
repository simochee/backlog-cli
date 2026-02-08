vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/prompt.ts", () => ({ promptRequired: vi.fn(() => "prompted comment") }));
vi.mock("consola", () => ({
	default: { log: vi.fn(), info: vi.fn(), success: vi.fn() },
}));

import { getClient } from "#utils/client.ts";
import { promptRequired } from "#utils/prompt.ts";
import consola from "consola";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("issue comment", () => {
	const mockComment = {
		id: 1,
		content: "Hello",
		createdUser: { name: "User" },
		created: "2024-01-01T00:00:00Z",
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("課題にコメントを追加する", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
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
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
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
