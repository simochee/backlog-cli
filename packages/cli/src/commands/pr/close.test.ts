vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => ({
	default: { log: vi.fn(), info: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn(() => "PROJ"),
}));
vi.mock("@repo/api", () => ({ PR_STATUS: { Open: 1, Closed: 2, Merged: 3 } }));

import { getClient } from "#utils/client.ts";
import consola from "consola";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("pr close", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("PRをクローズする", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		mockClient.mockResolvedValue({ number: 1, summary: "Test PR" });

		const mod = await import("#commands/pr/close.ts");
		await mod.default.run?.({ args: { number: "1", project: "PROJ", repo: "repo" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/git/repositories/repo/pullRequests/1",
			expect.objectContaining({
				method: "PATCH",
				body: { statusId: 2 },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Closed PR #1: Test PR");
	});

	it("コメント付きでクローズする", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		mockClient.mockResolvedValue({ number: 1, summary: "Test PR" });

		const mod = await import("#commands/pr/close.ts");
		await mod.default.run?.({ args: { number: "1", project: "PROJ", repo: "repo", comment: "Closing" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/git/repositories/repo/pullRequests/1",
			expect.objectContaining({
				method: "PATCH",
				body: { statusId: 2, comment: "Closing" },
			}),
		);
	});
});
