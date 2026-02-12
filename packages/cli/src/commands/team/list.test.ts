import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/format.ts", () => ({
	padEnd: mock((s: string, n: number) => s.padEnd(n)),
}));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("team list", () => {
	it("チーム一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{ id: 1, name: "Team A", members: [{ id: 1 }, { id: 2 }] },
			{ id: 2, name: "Team B", members: [{ id: 3 }] },
		]);

		const mod = await import("#commands/team/list.ts");
		await mod.default.run?.({ args: { order: "desc", limit: "20" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/teams",
			expect.objectContaining({ query: expect.objectContaining({ count: 20 }) }),
		);
		expect(consola.log).toHaveBeenCalledTimes(3);
	});

	it("0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/team/list.ts");
		await mod.default.run?.({ args: { order: "desc", limit: "20" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No teams found.");
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
			const data = [{ id: 1, name: "Team A", members: [{ id: 1 }] }];
			mockClient.mockResolvedValue(data);

			const mod = await import("#commands/team/list.ts");
			await mod.default.run?.({ args: { order: "desc", limit: "20", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output).toEqual(data);
		});
	});
});
