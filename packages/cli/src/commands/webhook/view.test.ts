import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/resolve.ts", () => ({
	resolveProjectArg: mock((v: string) => v),
}));
mock.module("#utils/format.ts", () => ({
	formatDate: mock(() => "2024-01-01"),
}));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

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

	describe("--json", () => {
		let writeSpy: ReturnType<typeof spyOn>;

		beforeEach(() => {
			writeSpy = spyOn(process.stdout, "write").mockImplementation(() => true);
		});

		afterEach(() => {
			writeSpy.mockRestore();
		});

		it("--json で JSON を出力する", async () => {
			const mockClient = setupMockClient(getClient);
			mockClient.mockResolvedValue(mockWebhook);

			const mod = await import("#commands/webhook/view.ts");
			await mod.default.run?.({ args: { id: "1", project: "PROJ", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output.name).toBe("Test Hook");
		});
	});
});
