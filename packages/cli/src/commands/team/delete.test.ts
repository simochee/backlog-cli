import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("team delete", () => {
	it("--yes でチームを削除する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Delete Team" });

		const mod = await import("#commands/team/delete.ts");
		await mod.default.run?.({ args: { "team-id": "1", yes: true } } as never);

		expect(mockClient).toHaveBeenCalledWith("/teams/1", expect.objectContaining({ method: "DELETE" }));
		expect(consola.prompt).not.toHaveBeenCalled();
		expect(consola.success).toHaveBeenCalledWith("Deleted team #1: Delete Team");
	});

	it("確認キャンセルで削除しない", async () => {
		setupMockClient(getClient);
		vi.mocked(consola.prompt).mockResolvedValue(false as never);

		const mod = await import("#commands/team/delete.ts");
		await mod.default.run?.({ args: { "team-id": "1" } } as never);

		expect(consola.prompt).toHaveBeenCalledOnce();
		expect(consola.info).toHaveBeenCalledWith("Cancelled.");
	});
});
