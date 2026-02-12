import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("issue delete", () => {
	it("--yes で課題を削除する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ issueKey: "PROJ-1", summary: "Issue Title" });

		const mod = await import("#commands/issue/delete.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-1", yes: true } } as never);

		expect(mockClient).toHaveBeenCalledWith("/issues/PROJ-1", expect.objectContaining({ method: "DELETE" }));
		expect(consola.prompt).not.toHaveBeenCalled();
		expect(consola.success).toHaveBeenCalledWith("Deleted PROJ-1: Issue Title");
	});

	it("確認キャンセルで削除しない", async () => {
		const mockClient = setupMockClient(getClient);
		(consola.prompt as any).mockResolvedValue(false as never);

		const mod = await import("#commands/issue/delete.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-1" } } as never);

		expect(consola.prompt).toHaveBeenCalledTimes(1);
		expect(consola.info).toHaveBeenCalledWith("Cancelled.");
		expect(mockClient).not.toHaveBeenCalledWith("/issues/PROJ-1", expect.objectContaining({ method: "DELETE" }));
	});

	it("確認承認で課題を削除する", async () => {
		const mockClient = setupMockClient(getClient);
		(consola.prompt as any).mockResolvedValue(true as never);
		mockClient.mockResolvedValue({ issueKey: "PROJ-2", summary: "Another Issue" });

		const mod = await import("#commands/issue/delete.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-2" } } as never);

		expect(consola.prompt).toHaveBeenCalledTimes(1);
		expect(mockClient).toHaveBeenCalledWith("/issues/PROJ-2", expect.objectContaining({ method: "DELETE" }));
		expect(consola.success).toHaveBeenCalledWith("Deleted PROJ-2: Another Issue");
	});
});
