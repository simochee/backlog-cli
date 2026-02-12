import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/format.ts", () => ({
	formatNotificationLine: mock(() => "  1           ASSIGNED          User A        PROJ-1 Test"),
	padEnd: mock((s: string, n: number) => s.padEnd(n)),
}));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("notification list", () => {
	it("通知一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{ id: 1, reason: 1, sender: { name: "User A" } },
			{ id: 2, reason: 2, sender: { name: "User B" } },
		]);

		const mod = await import("#commands/notification/list.ts");
		await mod.default.run?.({ args: { limit: "20", order: "desc" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/notifications",
			expect.objectContaining({ query: expect.objectContaining({ count: 20 }) }),
		);
		expect(consola.log).toHaveBeenCalledTimes(3);
	});

	it("0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/notification/list.ts");
		await mod.default.run?.({ args: { limit: "20", order: "desc" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No notifications found.");
	});

	it("min-id と max-id クエリを含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/notification/list.ts");
		await mod.default.run?.({ args: { limit: "20", order: "desc", "min-id": "10", "max-id": "100" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/notifications",
			expect.objectContaining({ query: expect.objectContaining({ minId: 10, maxId: 100 }) }),
		);
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
			const data = [
				{ id: 1, reason: 1, sender: { name: "User A" } },
				{ id: 2, reason: 2, sender: { name: "User B" } },
			];
			mockClient.mockResolvedValue(data);

			const mod = await import("#commands/notification/list.ts");
			await mod.default.run?.({ args: { limit: "20", order: "desc", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output).toEqual(data);
		});
	});
});
