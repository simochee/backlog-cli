vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => ({
	default: { log: vi.fn(), info: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));
vi.mock("#utils/resolve.ts", () => ({
	extractProjectKey: vi.fn(() => "PROJ"),
	resolveOpenStatusId: vi.fn(() => Promise.resolve(1)),
}));

import { getClient } from "#utils/client.ts";
import { resolveOpenStatusId } from "#utils/resolve.ts";
import consola from "consola";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("issue reopen", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("課題を再オープンする", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		mockClient.mockResolvedValue({ issueKey: "PROJ-1", summary: "Issue Title" });

		const mod = await import("#commands/issue/reopen.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-1" } } as never);

		expect(resolveOpenStatusId).toHaveBeenCalledWith(mockClient, "PROJ");
		expect(mockClient).toHaveBeenCalledWith(
			"/issues/PROJ-1",
			expect.objectContaining({
				method: "PATCH",
				body: { statusId: 1 },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Reopened PROJ-1: Issue Title");
	});

	it("コメント付きで再オープンする", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		mockClient.mockResolvedValue({ issueKey: "PROJ-1", summary: "Issue Title" });

		const mod = await import("#commands/issue/reopen.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-1", comment: "Reopening" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/issues/PROJ-1",
			expect.objectContaining({
				method: "PATCH",
				body: { statusId: 1, comment: "Reopening" },
			}),
		);
	});
});
