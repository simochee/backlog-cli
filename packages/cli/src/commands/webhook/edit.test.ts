import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn((v: string) => v),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

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
