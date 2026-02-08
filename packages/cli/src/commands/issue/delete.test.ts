import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("issue delete", () => {
	it("--yes で課題を削除する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ issueKey: "PROJ-1", summary: "Issue Title" });

		const mod = await import("#commands/issue/delete.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-1", yes: true } } as never);

		expect(mockClient).toHaveBeenCalledWith("/issues/PROJ-1", expect.objectContaining({ method: "DELETE" }));
		expect(consola.prompt).not.toHaveBeenCalled();
		expect(consola.success).toHaveBeenCalledWith("Deleted PROJ-1: Issue Title");
	});

	it("確認キャンセルで削除しない", async () => {
		const mockClient = setupMockClient(getClient);
		vi.mocked(consola.prompt).mockResolvedValue(false as never);

		const mod = await import("#commands/issue/delete.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-1" } } as never);

		expect(consola.prompt).toHaveBeenCalledOnce();
		expect(consola.info).toHaveBeenCalledWith("Cancelled.");
		expect(mockClient).not.toHaveBeenCalledWith("/issues/PROJ-1", expect.objectContaining({ method: "DELETE" }));
	});

	it("確認承認で課題を削除する", async () => {
		const mockClient = setupMockClient(getClient);
		vi.mocked(consola.prompt).mockResolvedValue(true as never);
		mockClient.mockResolvedValue({ issueKey: "PROJ-2", summary: "Another Issue" });

		const mod = await import("#commands/issue/delete.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-2" } } as never);

		expect(consola.prompt).toHaveBeenCalledOnce();
		expect(mockClient).toHaveBeenCalledWith("/issues/PROJ-2", expect.objectContaining({ method: "DELETE" }));
		expect(consola.success).toHaveBeenCalledWith("Deleted PROJ-2: Another Issue");
	});
});
