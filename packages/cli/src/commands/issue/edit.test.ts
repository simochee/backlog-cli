import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));
vi.mock("#utils/resolve.ts", () => ({
	extractProjectKey: vi.fn(() => "PROJ"),
	resolveStatusId: vi.fn(() => Promise.resolve(1)),
	resolveIssueTypeId: vi.fn(() => Promise.resolve(100)),
	resolvePriorityId: vi.fn(() => Promise.resolve(2)),
	resolveUserId: vi.fn(() => Promise.resolve(999)),
}));

import { getClient } from "#utils/client.ts";
import { resolveStatusId } from "#utils/resolve.ts";
import consola from "consola";

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
