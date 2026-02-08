import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

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
