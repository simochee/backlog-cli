import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("watching read", () => {
	it("ウォッチを既読にする", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({});

		const mod = await import("#commands/watching/read.ts");
		await mod.default.run?.({ args: { "watching-id": "42" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/watchings/42/markAsRead", expect.objectContaining({ method: "POST" }));
		expect(consola.success).toHaveBeenCalledWith("Marked watching 42 as read.");
	});
});
