vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => ({
	default: { log: vi.fn(), info: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));
vi.mock("#utils/resolve.ts", () => ({
	extractProjectKey: vi.fn(() => "PROJ"),
	resolveClosedStatusId: vi.fn(() => Promise.resolve(4)),
	resolveResolutionId: vi.fn(() => Promise.resolve(0)),
}));

import { getClient } from "#utils/client.ts";
import { resolveClosedStatusId, resolveResolutionId } from "#utils/resolve.ts";
import consola from "consola";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("issue close", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("課題をクローズする", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		mockClient.mockResolvedValue({ issueKey: "PROJ-1", summary: "Issue Title" });

		const mod = await import("#commands/issue/close.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-1", resolution: "完了" } } as never);

		expect(resolveClosedStatusId).toHaveBeenCalledWith(mockClient, "PROJ");
		expect(resolveResolutionId).toHaveBeenCalledWith(mockClient, "完了");
		expect(mockClient).toHaveBeenCalledWith(
			"/issues/PROJ-1",
			expect.objectContaining({
				method: "PATCH",
				body: { statusId: 4, resolutionId: 0 },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Closed PROJ-1: Issue Title");
	});

	it("コメント付きでクローズする", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		mockClient.mockResolvedValue({ issueKey: "PROJ-1", summary: "Issue Title" });

		const mod = await import("#commands/issue/close.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-1", comment: "Done!", resolution: "完了" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/issues/PROJ-1",
			expect.objectContaining({
				method: "PATCH",
				body: { statusId: 4, resolutionId: 0, comment: "Done!" },
			}),
		);
	});
});
