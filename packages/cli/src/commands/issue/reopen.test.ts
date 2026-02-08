import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));
vi.mock("#utils/resolve.ts", () => ({
	extractProjectKey: vi.fn(() => "PROJ"),
	resolveOpenStatusId: vi.fn(() => Promise.resolve(1)),
}));

import { getClient } from "#utils/client.ts";
import { resolveOpenStatusId } from "#utils/resolve.ts";
import consola from "consola";

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
