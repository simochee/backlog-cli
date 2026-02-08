import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));
vi.mock("#utils/format.ts", () => ({
	formatDate: vi.fn(() => "2025-01-01"),
}));

import { getClient } from "#utils/client.ts";
import consola from "consola";

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
});
