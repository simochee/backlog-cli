import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

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
