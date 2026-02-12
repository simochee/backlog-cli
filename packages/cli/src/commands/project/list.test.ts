import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/format.ts", () => ({
	formatProjectLine: mock(() => "PROJ  Test Project  Active"),
	padEnd: mock((s: string, n: number) => s.padEnd(n)),
}));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("project list", () => {
	it("プロジェクト一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{ id: 1, projectKey: "PROJ1", name: "Project 1", archived: false },
			{ id: 2, projectKey: "PROJ2", name: "Project 2", archived: false },
		]);

		const mod = await import("#commands/project/list.ts");
		await mod.default.run?.({ args: { limit: "20" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/projects", expect.objectContaining({ query: {} }));
		// ヘッダー1回 + プロジェクト2回 = 3回
		expect(consola.log).toHaveBeenCalledTimes(3);
	});

	it("0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/project/list.ts");
		await mod.default.run?.({ args: { limit: "20" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No projects found.");
	});

	it("--archived でクエリに archived が含まれる", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/project/list.ts");
		await mod.default.run?.({ args: { archived: true, limit: "20" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/projects", expect.objectContaining({ query: { archived: true } }));
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
			const data = [{ id: 1, projectKey: "PROJ1", name: "Project 1", archived: false }];
			mockClient.mockResolvedValue(data);

			const mod = await import("#commands/project/list.ts");
			await mod.default.run?.({ args: { limit: "20", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output).toEqual(data);
		});
	});
});
