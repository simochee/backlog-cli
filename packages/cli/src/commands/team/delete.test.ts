import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

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
		(consola.prompt as any).mockResolvedValue(false as never);

		const mod = await import("#commands/team/delete.ts");
		await mod.default.run?.({ args: { "team-id": "1" } } as never);

		expect(consola.prompt).toHaveBeenCalledTimes(1);
		expect(consola.info).toHaveBeenCalledWith("Cancelled.");
	});
});
