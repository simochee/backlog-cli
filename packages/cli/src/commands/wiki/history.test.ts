import { setupMockClient } from "@repo/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/format.ts", () => ({
	formatDate: vi.fn(() => "2024-01-01"),
	padEnd: vi.fn((s: string, n: number) => s.padEnd(n)),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("wiki history", () => {
	it("Wiki ページ履歴を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{ version: 3, name: "Page v3", created: "2024-01-03", createdUser: { name: "User A" } },
			{ version: 2, name: "Page v2", created: "2024-01-02", createdUser: { name: "User B" } },
		]);

		const mod = await import("#commands/wiki/history.ts");
		await mod.default.run?.({ args: { "wiki-id": "1", limit: "20" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/wikis/1/history", expect.objectContaining({ query: { count: 20 } }));
		expect(consola.log).toHaveBeenCalledTimes(3);
	});

	it("0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/wiki/history.ts");
		await mod.default.run?.({ args: { "wiki-id": "1", limit: "20" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No history found.");
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
			const data = [{ version: 3, name: "Page v3", created: "2024-01-03" }];
			mockClient.mockResolvedValue(data);

			const mod = await import("#commands/wiki/history.ts");
			await mod.default.run?.({ args: { "wiki-id": "1", limit: "20", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output).toEqual(data);
		});
	});
});
