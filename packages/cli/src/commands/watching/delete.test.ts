import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

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
		vi.mocked(consola.prompt).mockResolvedValue(false as never);

		const mod = await import("#commands/watching/delete.ts");
		await mod.default.run?.({ args: { "watching-id": "42" } } as never);

		expect(consola.prompt).toHaveBeenCalledOnce();
		expect(consola.info).toHaveBeenCalledWith("Cancelled.");
		expect(mockClient).not.toHaveBeenCalledWith("/watchings/42", expect.objectContaining({ method: "DELETE" }));
	});

	it("確認承認で削除する", async () => {
		const mockClient = setupMockClient(getClient);
		vi.mocked(consola.prompt).mockResolvedValue(true as never);
		mockClient.mockResolvedValue({});

		const mod = await import("#commands/watching/delete.ts");
		await mod.default.run?.({ args: { "watching-id": "55" } } as never);

		expect(consola.prompt).toHaveBeenCalledOnce();
		expect(mockClient).toHaveBeenCalledWith("/watchings/55", expect.objectContaining({ method: "DELETE" }));
		expect(consola.success).toHaveBeenCalledWith("Deleted watching 55.");
	});
});
