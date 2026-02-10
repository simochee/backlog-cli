import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn((v: string) => v),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("status delete", () => {
	it("--yes でステータスを削除する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Old Status" });

		const mod = await import("#commands/status/delete.ts");
		await mod.default.run?.({
			args: { id: "1", project: "PROJ", "substitute-status-id": "2", yes: true },
		} as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/statuses/1",
			expect.objectContaining({
				method: "DELETE",
				body: { substituteStatusId: 2 },
			}),
		);
		expect(consola.prompt).not.toHaveBeenCalled();
		expect(consola.success).toHaveBeenCalledWith("Deleted status #1: Old Status");
	});

	it("確認キャンセルで削除しない", async () => {
		setupMockClient(getClient);
		vi.mocked(consola.prompt).mockResolvedValue(false as never);

		const mod = await import("#commands/status/delete.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ", "substitute-status-id": "2" } } as never);

		expect(consola.prompt).toHaveBeenCalledOnce();
		expect(consola.info).toHaveBeenCalledWith("Cancelled.");
	});
});
