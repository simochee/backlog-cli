import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/resolve.ts", () => ({
	resolveProjectArg: mock((v: string) => v),
}));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("webhook edit", () => {
	it("Webhook を更新する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Updated Hook" });

		const mod = await import("#commands/webhook/edit.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ", name: "Updated Hook" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/webhooks/1",
			expect.objectContaining({
				method: "PATCH",
				body: expect.objectContaining({ name: "Updated Hook" }),
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Updated webhook #1: Updated Hook");
	});

	it("指定フィールドのみ PATCH ボディに含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Hook" });

		const mod = await import("#commands/webhook/edit.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ", "hook-url": "https://new.example.com" } } as never);

		const callBody = mockClient.mock.calls[0]?.[1]?.body;
		expect(callBody).toHaveProperty("hookUrl", "https://new.example.com");
		expect(callBody).not.toHaveProperty("name");
	});
});
