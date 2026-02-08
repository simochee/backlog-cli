import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn((v: string) => v),
}));
vi.mock("#utils/format.ts", () => ({
	formatDate: vi.fn(() => "2024-01-01"),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("webhook view", () => {
	const mockWebhook = {
		id: 1,
		name: "Test Hook",
		hookUrl: "https://example.com/hook",
		allEvent: false,
		activityTypeIds: [1, 2],
		description: "A test webhook",
		createdUser: { name: "User A" },
		created: "2024-01-01",
		updated: "2024-01-02",
	};

	it("Webhook 詳細を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockWebhook);

		const mod = await import("#commands/webhook/view.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/projects/PROJ/webhooks/1");
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Test Hook"));
	});

	it("allEvent が true の場合、Activity Types を表示しない", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ ...mockWebhook, allEvent: true });

		const mod = await import("#commands/webhook/view.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ" } } as never);

		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Yes"));
	});
});
