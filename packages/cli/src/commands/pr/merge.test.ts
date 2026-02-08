import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({ resolveProjectArg: vi.fn(() => "PROJ") }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));
vi.mock("@repo/api", () => ({ PR_STATUS: { Open: 1, Closed: 2, Merged: 3 } }));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("pr merge", () => {
	it("PRをマージする", async () => {
		const mockClient = setupMockClient(getClient);
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
		const mockClient = setupMockClient(getClient);
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
