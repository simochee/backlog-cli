import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));
mock.module("#utils/prompt.ts", () => ({
	default: mock(async (label: string, existing?: string) => {
		if (existing) return existing;
		const { default: c } = await import("consola");
		return c.prompt(label, { type: "text" });
	}),
	confirmOrExit: mock(async (msg: string, skip?: boolean) => {
		if (skip) return true;
		const { default: c } = await import("consola");
		const confirmed = await c.prompt(msg, { type: "confirm" });
		if (!confirmed) {
			c.info("Cancelled.");
			return false;
		}
		return true;
	}),
}));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("wiki delete", () => {
	it("--yes で Wiki ページを削除する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Delete Me" });

		const mod = await import("#commands/wiki/delete.ts");
		await mod.default.run?.({ args: { "wiki-id": "1", yes: true } } as never);

		expect(mockClient).toHaveBeenCalledWith("/wikis/1", expect.objectContaining({ method: "DELETE" }));
		expect(consola.prompt).not.toHaveBeenCalled();
		expect(consola.success).toHaveBeenCalledWith("Deleted wiki page #1: Delete Me");
	});

	it("確認キャンセルで削除しない", async () => {
		setupMockClient(getClient);
		(consola.prompt as any).mockResolvedValue(false as never);

		const mod = await import("#commands/wiki/delete.ts");
		await mod.default.run?.({ args: { "wiki-id": "1" } } as never);

		expect(consola.prompt).toHaveBeenCalledOnce();
		expect(consola.info).toHaveBeenCalledWith("Cancelled.");
	});
});
