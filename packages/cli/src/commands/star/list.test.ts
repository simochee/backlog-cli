import { setupMockClient } from "@repo/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));
vi.mock("#utils/format.ts", () => ({
	formatDate: vi.fn(() => "2025-01-01"),
	padEnd: vi.fn((s: string, n: number) => s.padEnd(n)),
}));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("star list", () => {
	it("スター一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValueOnce([
			{
				id: 1,
				title: "PROJ-1: Test Issue",
				presenter: { name: "testuser" },
				created: "2025-01-01T00:00:00Z",
			},
			{
				id: 2,
				title: "Wiki Page",
				presenter: { name: "another" },
				created: "2025-01-02T00:00:00Z",
			},
		]);

		const mod = await import("#commands/star/list.ts");
		await mod.default.run?.({ args: { "user-id": "123", limit: "20", order: "desc" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/users/123/stars",
			expect.objectContaining({
				query: { count: 20, order: "desc" },
			}),
		);
		// ヘッダー + 2行
		expect(consola.log).toHaveBeenCalledTimes(3);
	});

	it("user-id 省略時に自分の ID を取得する", async () => {
		const mockClient = setupMockClient(getClient);
		// GET /users/myself → GET /users/456/stars
		mockClient.mockResolvedValueOnce({ id: 456 }).mockResolvedValueOnce([
			{
				id: 1,
				title: "Issue",
				presenter: { name: "me" },
				created: "2025-01-01T00:00:00Z",
			},
		]);

		const mod = await import("#commands/star/list.ts");
		await mod.default.run?.({ args: { "user-id": undefined, limit: "20", order: "desc" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/users/myself");
		expect(mockClient).toHaveBeenCalledWith(
			"/users/456/stars",
			expect.objectContaining({
				query: { count: 20, order: "desc" },
			}),
		);
	});

	it("スターが0件の場合はメッセージを表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValueOnce([]);

		const mod = await import("#commands/star/list.ts");
		await mod.default.run?.({ args: { "user-id": "123", limit: "20", order: "desc" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No stars found.");
	});

	describe("--json", () => {
		let writeSpy: ReturnType<typeof vi.spyOn>;

		beforeEach(() => {
			writeSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
		});

		afterEach(() => {
			writeSpy.mockRestore();
		});

		it("--json で JSON を出力する", async () => {
			const mockClient = setupMockClient(getClient);
			const data = [{ id: 1, title: "PROJ-1: Test", presenter: { name: "user" }, created: "2025-01-01T00:00:00Z" }];
			mockClient.mockResolvedValueOnce(data);

			const mod = await import("#commands/star/list.ts");
			await mod.default.run?.({ args: { "user-id": "123", limit: "20", order: "desc", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output).toEqual(data);
		});
	});
});
