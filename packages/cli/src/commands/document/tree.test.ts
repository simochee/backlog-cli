import { setupMockClient } from "@repo/test-utils";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/resolve.ts", () => ({
	resolveProjectArg: mock((v: string) => v),
}));
mock.module("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("document tree", () => {
	it("ドキュメントツリーを表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({
			projectId: 1,
			activeTree: {
				id: "Active",
				children: [
					{ id: "abc-123", name: "Doc 1", emoji: "", children: [] },
					{
						id: "def-456",
						name: "Folder",
						emoji: "",
						children: [{ id: "ghi-789", name: "Child", emoji: "", children: [] }],
					},
				],
			},
			trashTree: { id: "Trash", children: [] },
		});

		const mod = await import("#commands/document/tree.ts");
		await mod.default.run?.({ args: { project: "PROJ" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/documents/tree",
			expect.objectContaining({ query: { projectIdOrKey: "PROJ" } }),
		);
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Doc 1"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Child"));
	});

	it("0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({
			projectId: 1,
			activeTree: { id: "Active", children: [] },
			trashTree: { id: "Trash", children: [] },
		});

		const mod = await import("#commands/document/tree.ts");
		await mod.default.run?.({ args: { project: "PROJ" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No documents found.");
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
			const data = {
				projectId: 1,
				activeTree: { id: "Active", children: [{ id: "abc", name: "Doc", emoji: "", children: [] }] },
				trashTree: { id: "Trash", children: [] },
			};
			mockClient.mockResolvedValue(data);

			const mod = await import("#commands/document/tree.ts");
			await mod.default.run?.({ args: { project: "PROJ", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output.projectId).toBe(1);
		});
	});
});
