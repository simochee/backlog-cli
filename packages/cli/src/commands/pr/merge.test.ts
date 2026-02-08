vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({ resolveProjectArg: vi.fn(() => "PROJ") }));
vi.mock("consola", () => ({
	default: { log: vi.fn(), info: vi.fn(), success: vi.fn() },
}));
vi.mock("@repo/api", () => ({ PR_STATUS: { Open: 1, Closed: 2, Merged: 3 } }));

import { getClient } from "#utils/client.ts";
import consola from "consola";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("pr merge", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("PRをマージする", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		mockClient.mockResolvedValue({ number: 1, summary: "Feature PR" });

		const mod = await import("#commands/pr/merge.ts");
		await mod.default.run?.({ args: { number: "1", project: "PROJ", repo: "repo" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/git/repositories/repo/pullRequests/1",
			expect.objectContaining({
				method: "PATCH",
				body: { statusId: 3 },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Merged PR #1: Feature PR");
	});

	it("コメント付きでマージする", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		mockClient.mockResolvedValue({ number: 1, summary: "Feature PR" });

		const mod = await import("#commands/pr/merge.ts");
		await mod.default.run?.({ args: { number: "1", project: "PROJ", repo: "repo", comment: "LGTM" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/git/repositories/repo/pullRequests/1",
			expect.objectContaining({
				method: "PATCH",
				body: { statusId: 3, comment: "LGTM" },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Merged PR #1: Feature PR");
	});
});
