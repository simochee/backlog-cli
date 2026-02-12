import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("watching delete", () => {
	it("--yes でウォッチを削除する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({});

		const mod = await import("#commands/watching/delete.ts");
		await mod.default.run?.({ args: { "watching-id": "42", yes: true } } as never);

		expect(mockClient).toHaveBeenCalledWith("/watchings/42", expect.objectContaining({ method: "DELETE" }));
		expect(consola.prompt).not.toHaveBeenCalled();
		expect(consola.success).toHaveBeenCalledWith("Deleted watching 42.");
	});

	it("確認キャンセルで削除しない", async () => {
		const mockClient = setupMockClient(getClient);
		(consola.prompt as any).mockResolvedValue(false as never);

		const mod = await import("#commands/watching/delete.ts");
		await mod.default.run?.({ args: { "watching-id": "42" } } as never);

		expect(consola.prompt).toHaveBeenCalledTimes(1);
		expect(consola.info).toHaveBeenCalledWith("Cancelled.");
		expect(mockClient).not.toHaveBeenCalledWith("/watchings/42", expect.objectContaining({ method: "DELETE" }));
	});

	it("確認承認で削除する", async () => {
		const mockClient = setupMockClient(getClient);
		(consola.prompt as any).mockResolvedValue(true as never);
		mockClient.mockResolvedValue({});

		const mod = await import("#commands/watching/delete.ts");
		await mod.default.run?.({ args: { "watching-id": "55" } } as never);

		expect(consola.prompt).toHaveBeenCalledTimes(1);
		expect(mockClient).toHaveBeenCalledWith("/watchings/55", expect.objectContaining({ method: "DELETE" }));
		expect(consola.success).toHaveBeenCalledWith("Deleted watching 55.");
	});
});
