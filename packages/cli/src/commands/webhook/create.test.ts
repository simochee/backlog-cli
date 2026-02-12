import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { beforeEach, describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/resolve.ts", () => ({
	resolveProjectArg: mock((v: string) => v),
}));
mock.module("#utils/prompt.ts", () => {
	const fn = mock();
	return { default: fn, promptRequired: fn };
});
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: promptRequired } = await import("#utils/prompt.ts");
const { default: consola } = await import("consola");

describe("webhook create", () => {
	beforeEach(() => {
		(promptRequired as any).mockImplementation((_label: string, value?: string) => Promise.resolve(value as string));
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
