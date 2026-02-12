import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/resolve.ts", () => ({
	resolveProjectArg: mock((v: string) => v),
}));
mock.module("#utils/format.ts", () => ({
	formatDate: mock(() => "2024-01-01"),
	padEnd: mock((s: string, n: number) => s.padEnd(n)),
}));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("wiki list", () => {
	it("Wiki ページ一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{ id: 1, name: "Page 1", updated: "2024-01-01", createdUser: { name: "User A" } },
			{ id: 2, name: "Page 2", updated: "2024-01-02", createdUser: { name: "User B" } },
		]);

		const mod = await import("#commands/wiki/list.ts");
		await mod.default.run?.({ args: { project: "PROJ", limit: "20", sort: "updated", order: "desc" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/wikis",
			expect.objectContaining({ query: expect.objectContaining({ projectIdOrKey: "PROJ" }) }),
		);
		expect(consola.log).toHaveBeenCalledTimes(3);
	});

	it("0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/wiki/list.ts");
		await mod.default.run?.({ args: { project: "PROJ", limit: "20", sort: "updated", order: "desc" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No wiki pages found.");
	});

	it("keyword クエリを含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/wiki/list.ts");
		await mod.default.run?.({
			args: { project: "PROJ", limit: "20", sort: "updated", order: "desc", keyword: "test" },
		} as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/wikis",
			expect.objectContaining({ query: expect.objectContaining({ keyword: "test" }) }),
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
			const data = [{ id: 1, name: "Page 1", updated: "2024-01-01" }];
			mockClient.mockResolvedValue(data);

			const mod = await import("#commands/wiki/list.ts");
			await mod.default.run?.({
				args: { project: "PROJ", limit: "20", sort: "updated", order: "desc", json: "" },
			} as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output).toEqual(data);
		});
	});
});
