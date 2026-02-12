import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("space notification run()", () => {
	it("通知がある場合は内容を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({
			content: "System maintenance scheduled.\nPlease save your work.",
			updated: "2024-06-01T10:00:00Z",
		});

		const mod = await import("#commands/space/notification.ts");
		await mod.default.run?.({} as never);

		expect(mockClient).toHaveBeenCalledWith("/space/notification");
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Space Notification"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Updated:"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Content:"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("System maintenance scheduled."));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Please save your work."));
	});

	it("通知がない場合は 'No space notification set.' を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({
			content: "",
			updated: "2024-06-01T10:00:00Z",
		});

		const mod = await import("#commands/space/notification.ts");
		await mod.default.run?.({} as never);

		expect(mockClient).toHaveBeenCalledWith("/space/notification");
		expect(consola.info).toHaveBeenCalledWith("No space notification set.");
	});
});
