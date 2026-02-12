import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));
mock.module("#utils/resolve.ts", () => ({
	extractProjectKey: mock(() => "PROJ"),
	resolveOpenStatusId: mock(() => Promise.resolve(1)),
}));

const { getClient } = await import("#utils/client.ts");
const { resolveOpenStatusId } = await import("#utils/resolve.ts");
const { default: consola } = await import("consola");

describe("issue reopen", () => {
	it("課題を再オープンする", async () => {
		const mockClient = setupMockClient(getClient);
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
		const mockClient = setupMockClient(getClient);
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
