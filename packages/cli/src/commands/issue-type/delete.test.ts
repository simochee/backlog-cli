import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn((v: string) => v),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("issue-type delete", () => {
	it("--yes で課題種別を削除する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Old Type" });

		const mod = await import("#commands/issue-type/delete.ts");
		await mod.default.run?.({
			args: { id: "1", project: "PROJ", "substitute-issue-type-id": "2", yes: true },
		} as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/issueTypes/1",
			expect.objectContaining({
				method: "DELETE",
				body: { substituteIssueTypeId: 2 },
			}),
		);
		expect(consola.prompt).not.toHaveBeenCalled();
		expect(consola.success).toHaveBeenCalledWith("Deleted issue type #1: Old Type");
	});

	it("確認キャンセルで削除しない", async () => {
		setupMockClient(getClient);
		vi.mocked(consola.prompt).mockResolvedValue(false as never);

		const mod = await import("#commands/issue-type/delete.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ", "substitute-issue-type-id": "2" } } as never);

		expect(consola.prompt).toHaveBeenCalledOnce();
		expect(consola.info).toHaveBeenCalledWith("Cancelled.");
	});
});
