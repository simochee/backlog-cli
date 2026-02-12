import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

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
