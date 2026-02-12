import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("watching add", () => {
	it("課題のウォッチを追加する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValueOnce({ id: 99 });

		const mod = await import("#commands/watching/add.ts");
		await mod.default.run?.({ args: { issue: "PROJ-1" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/watchings",
			expect.objectContaining({
				method: "POST",
				body: { issueIdOrKey: "PROJ-1" },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Added watching #99 for PROJ-1.");
	});

	it("ノート付きでウォッチを追加する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValueOnce({ id: 100 });

		const mod = await import("#commands/watching/add.ts");
		await mod.default.run?.({ args: { issue: "PROJ-2", note: "Important issue" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/watchings",
			expect.objectContaining({
				method: "POST",
				body: { issueIdOrKey: "PROJ-2", note: "Important issue" },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Added watching #100 for PROJ-2.");
	});
});
