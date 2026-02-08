import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("wiki delete", () => {
	it("--confirm で Wiki ページを削除する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Delete Me" });

		const mod = await import("#commands/wiki/delete.ts");
		await mod.default.run?.({ args: { "wiki-id": "1", confirm: true } } as never);

		expect(mockClient).toHaveBeenCalledWith("/wikis/1", expect.objectContaining({ method: "DELETE" }));
		expect(consola.prompt).not.toHaveBeenCalled();
		expect(consola.success).toHaveBeenCalledWith("Deleted wiki page #1: Delete Me");
	});

	it("確認キャンセルで削除しない", async () => {
		setupMockClient(getClient);
		vi.mocked(consola.prompt).mockResolvedValue(false as never);

		const mod = await import("#commands/wiki/delete.ts");
		await mod.default.run?.({ args: { "wiki-id": "1" } } as never);

		expect(consola.prompt).toHaveBeenCalledOnce();
		expect(consola.info).toHaveBeenCalledWith("Cancelled.");
	});
});
