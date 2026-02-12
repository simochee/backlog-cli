import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));
mock.module("#utils/resolve.ts", () => ({
	extractProjectKey: mock(() => "PROJ"),
	resolveClosedStatusId: mock(() => Promise.resolve(4)),
	resolveResolutionId: mock(() => Promise.resolve(1)),
}));

const { getClient } = await import("#utils/client.ts");
const { resolveClosedStatusId, resolveResolutionId } = await import("#utils/resolve.ts");
const { default: consola } = await import("consola");

describe("issue close", () => {
	it("課題をクローズする（resolution 省略時は resolutionId を送らない）", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ issueKey: "PROJ-1", summary: "Issue Title" });

		const mod = await import("#commands/issue/close.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-1" } } as never);

		expect(resolveClosedStatusId).toHaveBeenCalledWith(mockClient, "PROJ");
		expect(resolveResolutionId).not.toHaveBeenCalled();
		expect(mockClient).toHaveBeenCalledWith(
			"/issues/PROJ-1",
			expect.objectContaining({
				method: "PATCH",
				body: { statusId: 4 },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Closed PROJ-1: Issue Title");
	});

	it("--resolution 指定時は名前解決して resolutionId を送る", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ issueKey: "PROJ-1", summary: "Issue Title" });

		const mod = await import("#commands/issue/close.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-1", resolution: "対応しない" } } as never);

		expect(resolveResolutionId).toHaveBeenCalledWith(mockClient, "対応しない");
		expect(mockClient).toHaveBeenCalledWith(
			"/issues/PROJ-1",
			expect.objectContaining({
				method: "PATCH",
				body: { statusId: 4, resolutionId: 1 },
			}),
		);
	});

	it("コメント付きでクローズする", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ issueKey: "PROJ-1", summary: "Issue Title" });

		const mod = await import("#commands/issue/close.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-1", comment: "Done!" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/issues/PROJ-1",
			expect.objectContaining({
				method: "PATCH",
				body: { statusId: 4, comment: "Done!" },
			}),
		);
	});
});
