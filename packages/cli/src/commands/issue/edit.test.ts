import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));
mock.module("#utils/resolve.ts", () => ({
	extractProjectKey: mock(() => "PROJ"),
	resolveStatusId: mock(() => Promise.resolve(1)),
	resolveIssueTypeId: mock(() => Promise.resolve(100)),
	resolvePriorityId: mock(() => Promise.resolve(2)),
	resolveUserId: mock(() => Promise.resolve(999)),
}));

const { getClient } = await import("#utils/client.ts");
const { resolveStatusId } = await import("#utils/resolve.ts");
const { default: consola } = await import("consola");

describe("issue edit", () => {
	it("課題を更新する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ issueKey: "PROJ-1", summary: "Updated Title" });

		const mod = await import("#commands/issue/edit.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-1", title: "Updated Title" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/issues/PROJ-1",
			expect.objectContaining({
				method: "PATCH",
				body: { summary: "Updated Title" },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Updated PROJ-1: Updated Title");
	});

	it("変更がない場合は警告表示", async () => {
		const mockClient = setupMockClient(getClient);

		const mod = await import("#commands/issue/edit.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-1" } } as never);

		expect(consola.warn).toHaveBeenCalledWith("No changes specified.");
		expect(mockClient).not.toHaveBeenCalledWith("/issues/PROJ-1", expect.objectContaining({ method: "PATCH" }));
	});

	it("ステータスを名前で変更する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ issueKey: "PROJ-1", summary: "Title" });

		const mod = await import("#commands/issue/edit.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-1", status: "処理中" } } as never);

		expect(resolveStatusId).toHaveBeenCalledWith(mockClient, "PROJ", "処理中");
		expect(mockClient).toHaveBeenCalledWith(
			"/issues/PROJ-1",
			expect.objectContaining({
				method: "PATCH",
				body: expect.objectContaining({ statusId: 1 }),
			}),
		);
	});
});
