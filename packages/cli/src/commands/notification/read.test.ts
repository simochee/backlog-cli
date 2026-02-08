import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("notification read", () => {
	it("通知を既読にする", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(undefined);

		const mod = await import("#commands/notification/read.ts");
		await mod.default.run?.({ args: { id: "123" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/notifications/123/markAsRead",
			expect.objectContaining({ method: "POST" }),
		);
		expect(consola.success).toHaveBeenCalledWith("Marked notification 123 as read.");
	});
});
