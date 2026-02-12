import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));
mock.module("#utils/format.ts", () => ({
	formatDate: mock(() => "2025-01-01"),
}));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("watching view", () => {
	it("ウォッチの詳細を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValueOnce({
			id: 42,
			type: "issue",
			resourceAlreadyRead: false,
			issue: { issueKey: "PROJ-1", summary: "Test Issue" },
			note: "My note",
			created: "2025-01-01T00:00:00Z",
			updated: "2025-01-02T00:00:00Z",
		});

		const mod = await import("#commands/watching/view.ts");
		await mod.default.run?.({ args: { "watching-id": "42" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/watchings/42");
		expect(consola.log).toHaveBeenCalledWith("  Watching #42");
		expect(consola.log).toHaveBeenCalledWith("    Type:           issue");
		expect(consola.log).toHaveBeenCalledWith("    Read:           No");
		expect(consola.log).toHaveBeenCalledWith("    Issue:          PROJ-1 — Test Issue");
		expect(consola.log).toHaveBeenCalledWith("    Note:           My note");
	});

	it("ノートなし・課題なしのウォッチを表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValueOnce({
			id: 99,
			type: "wiki",
			resourceAlreadyRead: true,
			issue: null,
			note: null,
			created: "2025-01-01T00:00:00Z",
			updated: "2025-01-01T00:00:00Z",
		});

		const mod = await import("#commands/watching/view.ts");
		await mod.default.run?.({ args: { "watching-id": "99" } } as never);

		expect(consola.log).toHaveBeenCalledWith("  Watching #99");
		expect(consola.log).toHaveBeenCalledWith("    Read:           Yes");
		// Issue と Note の行は表示されない
		expect(consola.log).not.toHaveBeenCalledWith(expect.stringContaining("Issue:"));
		expect(consola.log).not.toHaveBeenCalledWith(expect.stringContaining("Note:"));
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
				id: 42,
				type: "issue",
				resourceAlreadyRead: false,
				issue: { issueKey: "PROJ-1" },
				note: "note",
				created: "2025-01-01T00:00:00Z",
				updated: "2025-01-02T00:00:00Z",
			};
			mockClient.mockResolvedValueOnce(data);

			const mod = await import("#commands/watching/view.ts");
			await mod.default.run?.({ args: { "watching-id": "42", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output.id).toBe(42);
		});
	});
});
