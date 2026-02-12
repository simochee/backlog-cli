import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/resolve.ts", () => ({ resolveProjectArg: mock(() => "PROJ") }));
mock.module("consola", () => ({ default: mockConsola }));
mock.module("@repo/api", () => ({
	createClient: mock(),
	formatResetTime: mock(),
	exchangeAuthorizationCode: mock(),
	refreshAccessToken: mock(),
	DEFAULT_PRIORITY_ID: 3,
	PR_STATUS: { Open: 1, Closed: 2, Merged: 3 },
	PRIORITY: { High: 2, Normal: 3, Low: 4 },
	RESOLUTION: { Fixed: 0, WontFix: 1, Invalid: 2, Duplicate: 3, CannotReproduce: 4 },
}));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

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
