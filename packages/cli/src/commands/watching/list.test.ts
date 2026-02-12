import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));
mock.module("#utils/format.ts", () => ({
	formatDate: mock(() => "2025-01-01"),
	padEnd: mock((s: string, n: number) => s.padEnd(n)),
}));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("watching list", () => {
	it("ウォッチ一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValueOnce([
			{
				id: 1,
				issue: { issueKey: "PROJ-1", summary: "Issue 1" },
				updated: "2025-01-01T00:00:00Z",
				resourceAlreadyRead: true,
			},
			{
				id: 2,
				issue: { issueKey: "PROJ-2", summary: "Issue 2" },
				updated: "2025-01-02T00:00:00Z",
				resourceAlreadyRead: false,
			},
		]);

		const mod = await import("#commands/watching/list.ts");
		await mod.default.run?.({ args: { "user-id": "123", limit: "20", order: "desc" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/users/123/watchings",
			expect.objectContaining({
				query: { count: 20, order: "desc" },
			}),
		);
		// ヘッダー + 2行
		expect(consola.log).toHaveBeenCalledTimes(3);
	});

	it("user-id 省略時に自分の ID を取得する", async () => {
		const mockClient = setupMockClient(getClient);
		// GET /users/myself → GET /users/456/watchings
		mockClient.mockResolvedValueOnce({ id: 456 }).mockResolvedValueOnce([
			{
				id: 1,
				issue: { issueKey: "PROJ-1", summary: "Issue" },
				updated: "2025-01-01T00:00:00Z",
				resourceAlreadyRead: false,
			},
		]);

		const mod = await import("#commands/watching/list.ts");
		await mod.default.run?.({ args: { "user-id": undefined, limit: "20", order: "desc" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/users/myself");
		expect(mockClient).toHaveBeenCalledWith(
			"/users/456/watchings",
			expect.objectContaining({
				query: { count: 20, order: "desc" },
			}),
		);
	});

	it("sort オプションを指定する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValueOnce([]);

		const mod = await import("#commands/watching/list.ts");
		await mod.default.run?.({ args: { "user-id": "123", limit: "10", order: "asc", sort: "created" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/users/123/watchings",
			expect.objectContaining({
				query: { count: 10, order: "asc", sort: "created" },
			}),
		);
	});

	it("ウォッチが0件の場合はメッセージを表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValueOnce([]);

		const mod = await import("#commands/watching/list.ts");
		await mod.default.run?.({ args: { "user-id": "123", limit: "20", order: "desc" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No watchings found.");
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
				{
					id: 1,
					issue: { issueKey: "PROJ-1", summary: "Issue 1" },
					updated: "2025-01-01T00:00:00Z",
					resourceAlreadyRead: true,
				},
			];
			mockClient.mockResolvedValueOnce(data);

			const mod = await import("#commands/watching/list.ts");
			await mod.default.run?.({ args: { "user-id": "123", limit: "20", order: "desc", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output).toEqual(data);
		});
	});
});
