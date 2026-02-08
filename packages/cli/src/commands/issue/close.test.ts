import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));
vi.mock("#utils/resolve.ts", () => ({
	extractProjectKey: vi.fn(() => "PROJ"),
	resolveClosedStatusId: vi.fn(() => Promise.resolve(4)),
	resolveResolutionId: vi.fn(() => Promise.resolve(1)),
}));

import { getClient } from "#utils/client.ts";
import { resolveClosedStatusId, resolveResolutionId } from "#utils/resolve.ts";
import consola from "consola";

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
