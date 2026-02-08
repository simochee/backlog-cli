import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("notification read-all", () => {
	it("全通知を既読にする", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(undefined);

		const mod = await import("#commands/notification/read-all.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(mockClient).toHaveBeenCalledWith("/notifications/markAsRead", expect.objectContaining({ method: "POST" }));
		expect(consola.success).toHaveBeenCalledWith("Marked all notifications as read.");
	});
});
