import { setupMockClient } from "@repo/test-utils";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/resolve.ts", () => ({
	resolveProjectArg: mock((v: string) => v),
	resolveProjectId: mock(() => Promise.resolve(100)),
}));
mock.module("#utils/format.ts", () => ({
	formatDate: mock(() => "2024-01-01"),
	padEnd: mock((s: string, n: number) => s.padEnd(n)),
}));
mock.module("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("document list", () => {
	it("ドキュメント一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{ id: "abc-123", title: "Doc 1", updated: "2024-01-01", createdUser: { name: "User A" } },
			{ id: "def-456", title: "Doc 2", updated: "2024-01-02", createdUser: { name: "User B" } },
		]);

		const mod = await import("#commands/document/list.ts");
		await mod.default.run?.({ args: { project: "PROJ", limit: "20", sort: "updated", order: "desc" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/documents",
			expect.objectContaining({ query: expect.objectContaining({ "projectId[]": [100] }) }),
		);
		expect(consola.log).toHaveBeenCalledTimes(3);
	});

	it("0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/document/list.ts");
		await mod.default.run?.({ args: { project: "PROJ", limit: "20", sort: "updated", order: "desc" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No documents found.");
	});

	it("keyword クエリを含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/document/list.ts");
		await mod.default.run?.({
			args: { project: "PROJ", limit: "20", sort: "updated", order: "desc", keyword: "test" },
		} as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/documents",
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
			const data = [{ id: "abc-123", title: "Doc 1", updated: "2024-01-01" }];
			mockClient.mockResolvedValue(data);

			const mod = await import("#commands/document/list.ts");
			await mod.default.run?.({
				args: { project: "PROJ", limit: "20", sort: "updated", order: "desc", json: "" },
			} as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output).toEqual(data);
		});
	});
});
