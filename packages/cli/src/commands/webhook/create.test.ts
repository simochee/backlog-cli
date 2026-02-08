import { setupMockClient } from "@repo/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn((v: string) => v),
}));
vi.mock("#utils/prompt.ts", () => {
	const fn = vi.fn();
	return { default: fn, promptRequired: fn };
});
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import promptRequired from "#utils/prompt.ts";
import consola from "consola";

describe("webhook create", () => {
	beforeEach(() => {
		vi.mocked(promptRequired).mockImplementation((_label: string, value?: string) => Promise.resolve(value as string));
	});

	it("Webhook を作成する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "New Hook" });

		const mod = await import("#commands/webhook/create.ts");
		await mod.default.run?.({
			args: { project: "PROJ", name: "New Hook", "hook-url": "https://example.com" },
		} as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/webhooks",
			expect.objectContaining({
				method: "POST",
				body: expect.objectContaining({ name: "New Hook", hookUrl: "https://example.com" }),
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Created webhook #1: New Hook");
	});

	it("--all-event と --activity-type-ids を含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 2, name: "Event Hook" });

		const mod = await import("#commands/webhook/create.ts");
		await mod.default.run?.({
			args: {
				project: "PROJ",
				name: "Event Hook",
				"hook-url": "https://example.com",
				"all-event": true,
				"activity-type-ids": "1,2,3",
			},
		} as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/webhooks",
			expect.objectContaining({
				method: "POST",
				body: expect.objectContaining({
					allEvent: true,
					"activityTypeIds[]": [1, 2, 3],
				}),
			}),
		);
	});
});
